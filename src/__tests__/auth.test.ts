// auth.test.ts

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../middleware/authenticate'; // Adjust path as per your project structure
import AgbCode from '../models/agbCodes.model'; // Adjust path as per your project structure

const app = express();

// Mock middleware to bypass actual route handling
app.use((req, res, next) => {
  next();
});

// Endpoint to test middleware
app.get('/testAuth', authenticateUser, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

describe('authenticateUser Middleware', () => {
  it('should authenticate user with valid token', async () => {
    // Mock JWT token creation based on your secret and user information
    const token = jwt.sign({ username: 'testuser' }, 'myawesomesecret');

    // Mock finding user in database
    const findOneMock = jest.spyOn(AgbCode, 'findOne').mockResolvedValueOnce({
      agbCode: 'testuser', // Mock user object as per your model
    } as any);

    const response = await request(app)
      .get('/testAuth')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      userId: 'testuser',
      identity: 'user',
    });

    findOneMock.mockRestore(); // Restore the original findOne method
  });

  it('should return 401 if Authorization header is missing', async () => {
    const response = await request(app).get('/testAuth');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization header missing or invalid');
  });

  it('should return 401 if token is invalid', async () => {
    const response = await request(app)
      .get('/testAuth')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  it('should return 401 if user is not found', async () => {
    // Mock JWT token creation based on your secret and user information
    const token = jwt.sign({ username: 'nonexistentuser' }, 'myawesomesecret');

    // Mock finding user in database
    const findOneMock = jest.spyOn(AgbCode, 'findOne').mockResolvedValueOnce(null);

    const response = await request(app)
      .get('/testAuth')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User not found');

    findOneMock.mockRestore(); // Restore the original findOne method
  });
});
