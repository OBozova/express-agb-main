import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function generateToken(username: string, identity: string): string {
    //change secret put it into env
  return jwt.sign({ username, identity }, 'myawesomesecret' as string, { expiresIn: '1h' });
}

export async function verifyPassword(username: string, password: string): Promise<boolean> {
  // get password from users and made a user table and use some encryption for password
  return password === '123456';
}