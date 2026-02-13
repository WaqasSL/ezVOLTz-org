import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
//Twillio
const accountSid = process.env.TW_ACCOUNT_SID;
const authToken = process.env.TW_AUTH_TOKEN;
export const twillioVerifySid = process.env.TW_VERIFY_SID;
export const twillioClient = twilio(accountSid, authToken);

export const sgMailClient = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
