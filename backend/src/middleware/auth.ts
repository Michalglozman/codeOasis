import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}; 