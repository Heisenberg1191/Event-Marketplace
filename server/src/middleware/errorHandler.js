export const notFound = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};