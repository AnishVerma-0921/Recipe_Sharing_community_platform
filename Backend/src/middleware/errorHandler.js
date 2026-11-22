/**
 * Centralised error-handling middleware.
 * Always returns a consistent JSON shape:
 *   { success: false, error: { code, message, details? } }
 */

export function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode ?? err.status ?? 500;

  // Don't leak internals in production
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
