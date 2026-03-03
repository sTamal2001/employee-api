const errorHandler = (err, req, res, next) => {
  // Default to 500 if no statusCode was set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle PostgreSQL duplicate entry error
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with that email already exists.',
    });
  }

  // Log unexpected errors (not your AppError)
  if (!err.isOperational) {
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;