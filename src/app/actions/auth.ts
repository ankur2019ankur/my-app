'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import type { User } from '../_type/user';

const sessionCookieName = 'session_user_email';

export type LoginState = {
  error: string | null;
};

function isNextRedirectError(error: unknown): error is { digest: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '').trim();

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const response = await axios.get<User[]>('http://localhost:3001/users', {
      params: { email, password },
      maxBodyLength: Infinity,
    });
    const user = response.data[0];

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, user.email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    redirect('/contact');
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
      return { error: apiMessage ?? 'Unable to verify login right now.' };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Login failed.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  redirect('/login');
}

export async function getSessionUserEmail() {
  const cookieStore = await cookies();
  return cookieStore.get(sessionCookieName)?.value ?? null;
}