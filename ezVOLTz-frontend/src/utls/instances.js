import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instanceNREL = axios.create({
  baseURL: process.env.REACT_APP_NREL_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_NREL_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instanceRV = axios.create({
  baseURL: process.env.REACT_APP_RV_URI,
  params: {
    api_key: process.env.REACT_APP_RV_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instanceSassCharge = axios.create({
  baseURL: process.env.REACT_APP_SAASCHARGE_URI,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.REACT_APP_SAASCHARGE_API_KEY,
  },
});
