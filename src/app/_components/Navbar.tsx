import React from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { getSessionUserEmail } from '../actions/auth';

export default async function Navbar() {
  const session = await getSessionUserEmail();
  console.log(session);
  return (
    <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Contact Manager
            </Link>

            <div className="flex items-center space-x-4">
                {session ? (
                    <>
                        <Link href="/contact" className="text-blue-600 hover:text-blue-600 mr-8">
                            Contacts
                        </Link>
                        <Link href="/contact/post" className="text-blue-600 hover:text-blue-600 mr-8">
                            Posts
                        </Link>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-blue-600 hover:text-blue-600 mr-8">
                            Login
                        </Link>
                        <Link href="/register" className="text-blue-600 hover:text-blue-600 mr-8">
                            Register
                        </Link>
                        <Link href="/contact/post" className="text-blue-600 hover:text-blue-600 mr-8">
                            Posts
                        </Link>
                    </>
                
                )}
            </div>
        </div>
    </div>
  );
}