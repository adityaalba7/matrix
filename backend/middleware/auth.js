import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'MISSING_TOKEN', 'Authorization token is required.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'TOKEN_EXPIRED', 'Access token has expired. Please refresh.', 401);
    }
    return sendError(res, 'INVALID_TOKEN', 'Access token is invalid.', 401);
  }
};

export default authMiddleware;
