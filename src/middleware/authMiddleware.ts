// middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Check for authentication token in the request headers
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    // console.log(token)
    // vefiy the token 
    if (token != '123'){
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // If authentication passes, call the original handler
    return handler(req);
  };
}