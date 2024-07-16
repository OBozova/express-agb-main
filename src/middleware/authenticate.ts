// middleware/authenticate.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AgbCode from '../models/agbCodes.model'; // Adjust path as per your project structure

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'myawesomesecret') as { username: string };
    if (decoded.username !== 'admin')
    {
      const user = await AgbCode.findOne({ where: { agbCode: decoded.username } });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
    }

    req.user = {
      userId: decoded.username,
      identity: decoded.username === 'admin' ? 'admin' : 'user'
    }; // Attach user object to request for further use
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}