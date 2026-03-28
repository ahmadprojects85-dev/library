import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // We are setting 'admin' / '123' as the hardcoded credentials based on user instruction
    if (username === 'admin' && password === '123') {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'auth_token',
        value: 'authenticated_admin_session',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
