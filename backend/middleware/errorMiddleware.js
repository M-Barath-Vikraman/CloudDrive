/**
 * Centralized global error handling middleware for Express
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Error Caught:');
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Hide details in production environment
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorMiddleware;
