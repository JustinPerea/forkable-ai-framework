/**
 * Error Handler Middleware
 *
 * Provides comprehensive error handling for the forkable AI framework
 * with proper logging, user-friendly messages, and monitoring integration.
 */

const { config } = require('../config/app-config');
const monitoringService = require('../services/monitoring-service');

/**
 * Error handling middleware
 */
function errorHandler(error, req, res, next) {
  // Log error details
  console.error('🚨 Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Track error in monitoring
  monitoringService.trackError({
    error: error.message,
    endpoint: req.path,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  });

  // Determine error type and response
  let statusCode = error.statusCode || 500;
  let message = 'Internal server error';
  let userMessage = 'Something went wrong. Please try again.';
  let details = null;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    userMessage = 'Please check your input and try again.';
    details = error.details;
  } else if (error.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'Authentication failed';
    userMessage = 'Please log in to access this resource.';
  } else if (error.name === 'AuthorizationError') {
    statusCode = 403;
    message = 'Access denied';
    userMessage = 'You do not have permission to access this resource.';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
    userMessage = 'The requested resource was not found.';
  } else if (error.name === 'RateLimitError') {
    statusCode = 429;
    message = 'Too many requests';
    userMessage = 'You are making too many requests. Please wait and try again.';
  } else if (error.message.includes('timeout')) {
    statusCode = 408;
    message = 'Request timeout';
    userMessage = 'The request took too long to process. Please try again.';
  } else if (error.message.includes('quota') || error.message.includes('limit')) {
    statusCode = 429;
    message = 'Service limit exceeded';
    userMessage = 'Service usage limit exceeded. Please try again later.';
  } else if (error.userMessage) {
    // Error with custom user message (from AI service, etc.)
    message = error.message;
    userMessage = error.userMessage;
  }

  // Prepare response
  const response = {
    error: {
      message: message,
      userMessage: userMessage,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    }
  };

  // Add details in development mode
  if (config.monitoring.logLevel === 'debug' || process.env.NODE_ENV === 'development') {
    response.error.details = details;
    response.error.stack = error.stack;
  }

  // Set response headers
  res.status(statusCode);
  res.set('Content-Type', 'application/json');

  // Send response
  res.json(response);
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.name = 'NotFoundError';
  error.statusCode = 404;
  next(error);
}

/**
 * Async error wrapper
 * Catches errors from async route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error creator
 */
function createValidationError(message, details = null) {
  const error = new Error(message);
  error.name = 'ValidationError';
  error.statusCode = 400;
  error.details = details;
  return error;
}

/**
 * Authentication error creator
 */
function createAuthError(message = 'Authentication required') {
  const error = new Error(message);
  error.name = 'AuthenticationError';
  error.statusCode = 401;
  return error;
}

/**
 * Authorization error creator
 */
function createAuthzError(message = 'Insufficient permissions') {
  const error = new Error(message);
  error.name = 'AuthorizationError';
  error.statusCode = 403;
  return error;
}

/**
 * Rate limit error creator
 */
function createRateLimitError(message = 'Rate limit exceeded') {
  const error = new Error(message);
  error.name = 'RateLimitError';
  error.statusCode = 429;
  return error;
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createValidationError,
  createAuthError,
  createAuthzError,
  createRateLimitError
};