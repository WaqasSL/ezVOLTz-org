import express from "express";
import https from "https";
import fs from "fs";
import path, { dirname, join } from "path";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import swaggerJsdoc from "swagger-jsdoc";
import routes from "./src/routes/index.js";
import swaggerUiExpress from "swagger-ui-express";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import { requestMiddleware } from "./src/middleware/requestsMiddleware.js";
import startChargerStatusCron from "./src/cron/chargerStatusCron.js";
// import mailchimp from '@mailchimp/mailchimp_marketing';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

//Multiple Domain
let whitelist = [
  "https://www.staging.ezvoltz.app",
  "https://staging.ezvoltz.app",
  "https://www.ezvoltz.app",
  "https://ezvoltz.tech",
  "https://www.ezvoltz.tech",
  "https://ezvoltz.app",
  "https://localhost:3000",
  "https://stagging.dmxz7awb3rmsv.amplifyapp.com",
  "https://staging.ezvoltz.tech",
  "https://www.staging.ezvoltz.tech",
];

let corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.set("trust proxy", (ip) => {
  return true;
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50, // Limit each IP to 50 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    code: 429,
    error: "Too many requests, please try again after a minute.",
  },
});

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Firebase notification config
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      fs.readFileSync(
        join("src", "config", "firebase", "notifications.json"),
        "utf8"
      )
    )
  ),
});

// Apply the rate limiting middleware to all requests
// app.use(limiter);
app.use(cors(corsOptions));

// Apply the logger middleware to all requests
app.use(requestMiddleware);

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
  })
);

//MailChimp
// mailchimp.setConfig({
//   apiKey:
//     process.env.MAILCHIMP_API_KEY,
//   server: 'us5',
// });

//Routes
app.get("/", (req, res) => res.send("<h1>Server is up and running</h1>"));
app.use("/api/v1", limiter, routes);

//Server Running
const PORT = process.env.PORT || 5200;

//Swagger UI
const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ezVOLTz api's that are writter in Node with MongoDB",
      version: "1.0.0",
    },
    servers: [{ url: `${process.env.BACKEND_URL}:${PORT}/api/v1` }],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: [
    `${__dirname}/src/swagger/routes/*.js`,
    `${__dirname}/src/swagger/schemas/*.js`,
  ], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(openapiSpecification)
);

mongoose.set("strictQuery", false);

//HTTPS Server
if (process.env.SERVER === "development") {
  const sslServer = https.createServer(
    {
      cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
      key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    },
    app
  );

  sslServer.listen(PORT, () =>
    mongoose
      .connect(process.env.MONGOOSE_URI)
      .then(() => {
        startChargerStatusCron();
        console.log(`Server is up and running on https://localhost:${PORT}/`);
      })
      .catch((error) => console.error({ error }))
  );
} else {
  app.listen(PORT, () =>
    mongoose
      .connect(process.env.MONGOOSE_URI)
      .then(() => {
        startChargerStatusCron();
        console.log(`Server is up and running on http://localhost:${PORT}/`);
      })
      .catch((error) => console.error({ error }))
  );
}
