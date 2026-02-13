import chalk from 'chalk';

export const requestMiddleware = async (req, res, next) => {
  const start = Date.now();
  console.log(
    chalk.blue(`📥 Incoming Request: ${req.method} ${req.url} from ${req.ip}`)
  );

  // Capture the response status when it's finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? chalk.red : chalk.green;
    console.log(
      statusColor(
        `${
          res.statusCode >= 200 && res.statusCode < 400 ? '✅' : '❌'
        } - Response Sent: ${req.method} ${req.url} - Status: ${
          res.statusCode
        } - Time: ${duration}ms`
      )
    );
  });

  // Capture errors if any
  res.on('error', (err) => {
    console.error(
      chalk.red(
        `❌ Error on Request: ${req.method} ${req.url} - Error: ${err.message}`
      )
    );
  });

  next();
};
