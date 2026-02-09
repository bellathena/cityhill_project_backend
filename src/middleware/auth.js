const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verify JWT token and attach user info to request
 */

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const error = new Error('No authorization header provided');
      error.status = 401;
      throw error;
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      const error = new Error('Invalid authorization header format. Use "Bearer <token>"');
      error.status = 401;
      throw error;
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(error.status || 401).json({ error: error.message });
  }
};

/**
 * Optional Authentication Middleware
 * Verify JWT token if provided, but don't require it
 */

const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // No token provided, continue without user info
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      const error = new Error('Invalid authorization header format');
      error.status = 401;
      throw error;
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      role: decoded.role
    };

    next();
  } catch (error) {
    // If token is invalid, still continue but without user info
    if (error.status === 401) {
      return res.status(401).json({ error: error.message });
    }
    next();
  }
};

/**
 * Role-based Authorization Middleware
 * Check if user has required role
 */

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('User not authenticated');
      error.status = 401;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error('Insufficient permissions');
      error.status = 403;
      return next(error);
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole
};
