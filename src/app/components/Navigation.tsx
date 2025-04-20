'use client';

import Link from 'next/link';
import { useAuth } from '../auth/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const view = pathname.split('/')[1] || 'dashboard';

  return (
    <div className="text-xs bg-gray-200 text-gray-700 p-2 mb-4 rounded flex justify-between items-center">
      <div>
        Debug - Current View: {view} | User: {user ? user.displayName || 'You' : 'Not logged in'}
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link href="/" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span>•</span>
            <button onClick={() => logout()} className="hover:text-blue-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="hover:text-blue-600">
              Login
            </Link>
            <span>•</span>
            <Link href="/auth/register" className="hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 