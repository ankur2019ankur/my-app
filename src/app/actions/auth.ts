'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import type { User } from '../_type/user';
import { createUser, getUsers } from '../api/user';

const sessionCookieName = 'session_user_email';

export type LoginState = {
  error: string | null;
};

export type RegisterState = {
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
    cookieStore.set(sessionCookieName, JSON.stringify(user), {
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

export async function register(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  try {
    const session = await getSessionUserEmail();
    if (session) {
      throw new Error('You are already logged in. Please logout before creating a new account.');
    }

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '').trim();

    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const users = await getUsers();
    const userExists = users.some((user) => user.email.toLowerCase() === email);

    if (userExists) {
      throw new Error('A user with this email already exists.');
    }

    const createdUser = await createUser({ name, email, password });
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, JSON.stringify(createdUser), {
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
      return { error: apiMessage ?? 'Unable to create user right now.' };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Registration failed.' };
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