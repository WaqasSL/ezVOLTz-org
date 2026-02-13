import * as Yup from "yup";

export const loginWithEmailSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters are required")
    .max(16, "Maximum 16 characters are required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      "Password must contain at least one number, one uppercase, one lowercase and one special character"
    )
    .required("Password is required"),
});

export const loginWithGoogleSchema = Yup.object().shape({
  phone: Yup.string().trim().required(`Phone is required`),
});

export const loginWithFacebookSchema = Yup.object().shape({
  phone: Yup.string().trim().required(`Phone is required`),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export const loginWithAppleSchema = Yup.object().shape({
  phone: Yup.string().trim().required(`Phone is required`),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Name must contain letters only"),
});

export const personalInformationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Name must contain letters only"),
  email: Yup.string()
    .trim()
    .email("Please enter valid email")
    .required("Email is required"),
  phone: Yup.string().trim().required(`Phone is required`),
  password: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters are required")
    .max(16, "Maximum 16 character are required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      "Password must contain at least one number, one uppercase, one lowercase and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
});

// validation schema for feedback and contactus

// start
export const guestUserSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter valid email")
    .required("Email is required"),
  name: Yup.string().trim().required("Name is required"),
  subject: Yup.string().trim().required("Subject is required"),
  description: Yup.string().trim().required("Message is required"),
});

export const verifiedUserSchema = Yup.object().shape({
  subject: Yup.string().trim().required("Subject is required"),
  description: Yup.string().trim().required("Message is required"),
});
// end

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required").trim(),
  newPassword: Yup.string()
    .min(8, "Minimum 8 characters are required")
    .max(16, "Maximum 16 character are required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      "Password must contain at least one number, one uppercase, one lowercase and one special character"
    )
    .required("New password is required")
    .trim(),
  confirmNewPassword: Yup.string()
    .required("Confirm new password is required")
    .oneOf(
      [Yup.ref("newPassword")],
      "New password and confirm new password does not match"
    ),
});

export const setPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Minimum 8 characters are required")
    .max(16, "Maximum 16 character are required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      "Password must contain at least one number, one uppercase, one lowercase and one special character"
    )
    .required("New password is required")
    .trim(),
  confirmNewPassword: Yup.string()
    .required("Confirm new password is required")
    .oneOf(
      [Yup.ref("newPassword")],
      "New password and confirm new password does not match"
    ),
});

export const changePhoneSchema = Yup.object().shape({
  phone: Yup.string().trim().required(`Phone is required`),
});
