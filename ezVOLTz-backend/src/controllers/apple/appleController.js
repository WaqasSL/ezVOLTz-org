import jwt from "jsonwebtoken";
import fs from "fs";
import AppleAuth from "apple-auth";
import axios from "axios";
import { errorMessage } from "../../config/config.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import User from "../../models/UserModel.js";
import stripe from "../../config/stripe/stripe.js";
import Account from "../../models/Account.js";
import { createDriver } from "../saasCharge/saasChargeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 🔹 Generate Apple Client Secret JWT
 */
function generateAppleClientSecret(config, platform) {
  let keyFileName;
  // Determine which key file to use based on environment
  if (process.env.ENVIRONMENT === "staging") {
    keyFileName =
      platform === "android" ? "StagingAuthKeyAndroid.p8" : "StagingAuthKey.p8";
  } else {
    keyFileName = "LiveAuthKey.p8";
  }

  const keyPath = path.join(__dirname, "../../config/apple", keyFileName);
  const privateKey = fs.readFileSync(keyPath).toString();

  return jwt.sign(
    {
      iss: config.team_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months expiration
      aud: "https://appleid.apple.com",
      sub: config.client_id,
    },
    privateKey,
    { algorithm: "ES256", keyid: config.key_id }
  );
}

/**
 * 🔹 Exchange Authorization Code for Apple Tokens
 */
async function exchangeAppleAuthCodeForTokens(authCode, config, platform) {
  try {
    const clientSecret = generateAppleClientSecret(config, platform);

    const response = await axios.post(
      "https://appleid.apple.com/auth/token",
      null,
      {
        params: {
          client_id: config.client_id,
          client_secret: clientSecret,
          code: authCode,
          grant_type: "authorization_code",
          redirect_uri: config.redirect_uri,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error exchanging Apple auth code:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 🔹 Refresh Apple Access Token
 */
async function refreshAppleAccessToken(refreshToken, config) {
  try {
    const clientSecret = generateAppleClientSecret(config);

    const response = await axios.post(
      "https://appleid.apple.com/auth/token",
      null,
      {
        params: {
          client_id: config.client_id,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error refreshing Apple access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Route for generating the Apple Sign-In token
export const appleSignIn = async (req, res) => {
  try {
    console.log(JSON.stringify(req.body, null, 2));
    const currentLoginDate = new Date();
    const appleResponse = req.body.authorization || req.session.appleAuth;
    const appleAuthorizationToken = appleResponse
      ? appleResponse?.id_token
      : req.body?.token;

    if (!appleAuthorizationToken)
      return res
        .status(400)
        .json({ error: "Missing Apple authorization token" });
    else req.session.appleAuth = appleResponse;

    const { email, sub } = jwt.decode(appleAuthorizationToken) || {};

    if (!sub) return res.status(400).json({ error: "Invalid Apple ID token" });

    // Load Apple config
    let appleConfigPath;
    if (process.env.ENVIRONMENT === "staging") {
      appleConfigPath = path.join(
        __dirname,
        "../../config/apple",
        req.body.platform === "ios"
          ? "appleStagingConfig.json"
          : "appleStagingConfigWeb.json"
      );
    }else {
      appleConfigPath = path.join(
        __dirname,
        "../../config/apple",
        req.body.platform === "ios"
          ? "appleLiveConfig.json"
          : "appleConfigWebAndAndroid.json"
      );
    }
    const appleConfig = JSON.parse(fs.readFileSync(appleConfigPath, "utf8"));

    // 🔹 Check if user exists before using the authorization code
    let user =
      (await User.findOne({ appleUserId: sub })) ||
      (await User.findOne({ email }));

    if (user) {
      user.appleUserId = sub;
      await user.save();
    } else {
      let appleRefreshToken = req.body?.appleRefreshToken || null;
      if (!req.body?.appleRefreshToken) {
        // Authorization code is only used here if user does not exist
        const appleTokens = await exchangeAppleAuthCodeForTokens(
          req.body?.authorization?.code,
          appleConfig,
          req.body.platform // Pass platform here
        );
        appleRefreshToken = appleTokens.refresh_token;
      }

      if (!req.body?.name) {
        return res.status(203).send({
          error: "Following information is required.",
          isNameRequired: !req.body?.name,
          name: req.body?.name || "",
          email: email || req.body?.email,
          appleUserId: sub,
          appleRefreshToken,
          registerMethod: req.body?.registerMethod || "apple",
          platform: req.body?.platform,
          token: appleAuthorizationToken,
          authorization: req.body.authorization,
        });
      }

      user = await User.create({
        name: req.body.name,
        email: email || req.body.email,
        password: "",
        appleUserId: sub,
        appleRefreshToken,
        platform: req.body?.platform,
        registerMethod: req.body?.registerMethod || "apple",
        country: "United States",
        phone: req.body?.phone || null,
        city: "Washington, D.C.",
        isActive: true,
        lastLoginAt: currentLoginDate,
      });

      console.log(JSON.stringify(user, null, 2));

      // Create Stripe Customer & Account
      const customer = await stripe.customers.create({
        name: user?.name,
        email: user?.email,
        description: "My Test Customer For ezVOLTZ",
      });

      await Account.create({
        userId: user?._id,
        customerId: customer?.id,
      });

      createDriver({ userId: user?._id });
    }

    // Generate JWT Tokens
    const sessionUser = { userId: user?._id, email: user?.email };
    req.session.userInfo = sessionUser;

    const accessToken = jwt.sign(
      { user: sessionUser },
      process.env.HASH_ACCESS_KEY,
      { expiresIn: "7d", algorithm: "HS512" }
    );

    const refreshToken = jwt.sign(
      { user: sessionUser },
      process.env.HASH_SECRET_KEY,
      { expiresIn: "30d", algorithm: "HS512" }
    );

    res.status(200).send({
      user: { ...user.toObject(), lastLoginAt: currentLoginDate },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Apple Sign-In Error:", error);
    errorMessage(res, error);
  }
};

// Route for revoking the Apple Sign-In token
export const appleRevokeAccount = async (req, res) => {
  try {
    const { token, platform } = req.body;

    let auth;

    if (process.env.ENVIRONMENT === "staging") {
      // Determine which .p8 key file to use based on platform
      const keyFileName =
        platform === "android"
          ? "StagingAuthKeyAndroid.p8"
          : "StagingAuthKey.p8";

      // Load Apple config JSON based on platform
      const configFileName =
        platform === "ios"
          ? "appleStagingConfig.json"
          : "appleStagingConfigWeb.json";

      auth = new AppleAuth(
        fs.readFileSync(
          path.join(__dirname, "../../config/apple", configFileName)
        ),
        fs
          .readFileSync(path.join(__dirname, "../../config/apple", keyFileName))
          .toString(),
        "text"
      );
    } else {
      // Revoke the Apple Sign-In token
      auth = new AppleAuth(
        fs.readFileSync(
          path.join(
            __dirname,
            "../../config/apple",
            platform === "ios"
              ? "appleLiveConfig.json"
              : "appleConfigWebAndAndroid.json"
          )
        ),
        fs
          .readFileSync(
            path.join(__dirname, "../../config/apple", "LiveAuthKey.p8")
          )
          .toString(),
        "text"
      );
    }

    await auth.revokeToken(token);

    res.status(200).json({ message: "Token revoked successfully" });
  } catch (error) {
    errorMessage(res, error);
  }
};
