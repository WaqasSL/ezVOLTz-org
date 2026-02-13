import dotenv from 'dotenv';
import { s3Client } from '../config/config.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

dotenv.config();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Function to generate daily log file name
const getLogFileName = () => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  return `logs/${dateString}.txt`;
};

// Function to append logs to S3
const appendLogToS3 = async (newLog) => {
  try {
    const LOG_FILE_NAME = getLogFileName(); // Get daily log file name
    let existingLogs = '';

    // Try fetching the existing log file from S3
    try {
      const data = await s3Client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: LOG_FILE_NAME,
        })
      );

      // Convert Stream to String
      const streamToString = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks).toString('utf-8');
      };

      existingLogs = await streamToString(data.Body);
    } catch (err) {
      console.warn(
        `Log file (${LOG_FILE_NAME}) not found, creating a new one...`
      );
    }

    // Append the new log entry (plain text format)
    const updatedLogs = existingLogs + newLog + '\n';

    // Upload the updated log file to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: LOG_FILE_NAME,
        Body: updatedLogs,
        ContentType: 'text/plain', // Store as a text file
      })
    );

    console.log(`Log updated successfully in S3: ${LOG_FILE_NAME}`);
  } catch (error) {
    console.error('Error appending log to S3:', error);
  }
};

// Function to log internal Express API requests and responses
export const apiLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (body) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Ensure undefined values are properly handled
    const responseBody = body ? JSON.stringify(body, null, 2) : 'N/A';
    const requestBody = req.body ? JSON.stringify(req.body, null, 2) : '{}';

    // Structured log entry
    const logEntry = `
---------------------------------------------
[${new Date().toISOString()}]
REQUEST:
  Method: ${req.method}
  Endpoint: ${req.originalUrl}
  Payload: ${requestBody}

RESPONSE:
  Status: ${statusCode}
  Body: ${responseBody}
  Duration: ${duration}ms
---------------------------------------------
`;

    appendLogToS3(logEntry);
    originalSend.call(this, body);
  };

  next();
};

// Function to log external API requests (Axios logging)
export const logExternalAPI = (logData) => {
  const { method, endpoint, payload, status, response } = logData;

  // Ensure undefined values are properly handled
  const responseBody = response ? JSON.stringify(response, null, 2) : 'N/A';
  const requestBody = payload ? JSON.stringify(payload, null, 2) : '{}';

  // Structured log entry
  const logEntry = `
---------------------------------------------
[${new Date().toISOString()}]
EXTERNAL REQUEST:
  Method: ${method}
  Endpoint: ${endpoint}
  Payload: ${requestBody}

RESPONSE:
  Status: ${status}
  Body: ${responseBody}
---------------------------------------------
`;

  appendLogToS3(logEntry);
};
