import { APP_URL, NREL_URL, NREL_API_KEY, SAAS_URL, SAAS_TOKEN } from "@env";
import axios from "axios";

console.log("APP_URL ", APP_URL);

export const restInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'skip-browser-warning'
  },
});

export const nrelInstance = axios.create({
  baseURL: NREL_URL,
  params: {
    api_key: NREL_API_KEY,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export const saasInstance = axios.create({
  baseURL: SAAS_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: SAAS_TOKEN,
  },
});
