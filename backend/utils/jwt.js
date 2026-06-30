import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_clouddrive_key_2026_xyz';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generates a signed JSON Web Token for the authenticated user
 * @param {Object} payload - User session data containing UserID, email, etc.
 * @returns {string} - JWT string
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Decodes and verifies the authenticity of a JSON Web Token
 * @param {string} token - Signed JWT string
 * @returns {Object} - Decoded payload contents
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
