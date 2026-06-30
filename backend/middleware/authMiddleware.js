import { verifyToken } from '../utils/jwt.js';

/**
 * Express middleware to protect API routes with JWT check
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token is invalid.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach decoded user info (contains userId, email, name) to request object
    req.user = decoded;
    
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.',
    });
  }
};

export default authMiddleware;
