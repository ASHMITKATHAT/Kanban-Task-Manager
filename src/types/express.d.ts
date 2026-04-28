import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// update 2026-01-03 13:21:40

// update 2026-02-01 17:18:21

// update 2026-02-07 16:17:07

// update 2026-03-31 11:42:38

// update 2026-04-28 17:31:50
