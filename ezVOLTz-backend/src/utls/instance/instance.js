import axios from 'axios';
import dotenv from 'dotenv';
import { logExternalAPI } from '../../middleware/saaschargeLogger.js';

dotenv.config();

// Function to setup Axios interceptors
const setupLoggingInterceptor = (axiosInstance, instanceName) => {
  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const logData = {
        method: config.method.toUpperCase(),
        endpoint: `${instanceName}: ${config.baseURL}${config.url}`,
        payload: config.data || {},
      };

      logExternalAPI(logData); // Log outgoing request
      return config;
    },
    (error) => {
      logExternalAPI({
        method: 'REQUEST ERROR',
        endpoint: error.config
          ? `${instanceName}: ${error.config.baseURL}${error.config.url}`
          : 'UNKNOWN',
        payload: error.message,
        status: 500,
      });

      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const logData = {
        method: response.config.method.toUpperCase(),
        endpoint: `${instanceName}: ${response.config.baseURL}${response.config.url}`,
        payload: response.config.data || {},
        status: response.status,
      };

      logExternalAPI(logData); // Log successful response
      return response;
    },
    (error) => {
      const logData = {
        method: error.config?.method.toUpperCase() || 'UNKNOWN',
        endpoint: error.config
          ? `${instanceName}: ${error.config.baseURL}${error.config.url}`
          : 'UNKNOWN',
        payload: error.response?.data || error.message,
        status: error.response?.status || 500,
      };

      logExternalAPI(logData); // Log API response error
      return Promise.reject(error);
    }
  );
};

// Create SaaSCharge API Instances
export const saasChargeInstanceDev = axios.create({
  baseURL: process.env.SAASCHARGE_BASE_URL_DEV,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.SAASCHARGE_API_KEY,
    'api-key': process.env.SAASCHARGE_API_KEY,
  },
});

export const saasChargeInstanceApi = axios.create({
  baseURL: process.env.SAASCHARGE_BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.SAASCHARGE_API_KEY,
    'api-key': process.env.SAASCHARGE_API_KEY,
  },
});

// Attach logging interceptors
setupLoggingInterceptor(saasChargeInstanceDev, 'SaaSCharge Dev');
setupLoggingInterceptor(saasChargeInstanceApi, 'SaaSCharge API');
