import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
        userId: string
        identity: string
    }; // Define your user type here
  }
}
