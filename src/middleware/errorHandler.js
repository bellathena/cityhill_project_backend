/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma validation error
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(400).json({ error: `${field} already exists` });
  }

  // Prisma validation error
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid reference' });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
