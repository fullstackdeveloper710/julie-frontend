'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Logo } from './Logo';
import { useAppSelector, useAppDispatch, useSignOutMutation, logout } from '@/hooks';
import type { User } from '@/types';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [signOut, { isLoading: isSigningOut }] = useSignOutMutation();

  const isDashboard = pathname?.startsWith('/dashboard');

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/signin');
  };
  // ///get user
  const { data, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  // Show user initial or fallback

  const userData = data?.data;

  const userEmail = userData?.email || 'User';
  const userInitial = userData?.email ? userData.email.charAt(0).toUpperCase() : 'U';

  if (isDashboard) {
    return (
      <header className="sticky top-0 z-200 flex items-center justify-between md:px-7 px-3 h-20 bg-slate-900 border-b-4 border-(--accent)">
        <Link href="/" className="flex items-center mt-3 mb-3 ml-1">
          <Logo size={120} className="mx-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <span
            className="text-[0.5rem] sm:text-xs font-semibold tracking-widest uppercase text-blue-300"
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
          >
            Operational Diagnostic System
          </span>

          <div className="relative">
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              buttonClassName="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-(--accent) rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">{userInitial}</span>
              </div>
              <span className="text-xs text-slate-300 max-w-37.5 truncate hidden sm:inline">
                {userEmail}
              </span>
              <svg
                className={`w-4 h-4  transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </Button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="text-xs ">Signed in as</p>
                  <p className="text-sm text-white font-semibold truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    router.push('/dashboard/manager');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent)! active transition-colors disabled:opacity-50 uppercase"
                >
                  Create Admin
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent)! active transition-colors disabled:opacity-50 uppercase"
                >
                  {isSigningOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
  return (
    <nav className="relative bg-slate-900 border-b-4 h-20 border-(--accent)">
      <div className=" mx-auto md:px-7 px-3">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex relative top-[-2px] items-center mt-3 mb-3 ml-1">
            <Logo size={120} className="mx-auto" />
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-(--accent) sm:hidden"
              aria-controls="mobile-menu"
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu((prev) => !prev)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div className="hidden navBar sm:flex items-center gap-4">
              <Link
                href="/"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/') ? 'active' : 'text-slate-300 hover:text-white'
                }`}
              >
                HOME
              </Link>
              <Link
                href="/about"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/about') ? 'active' : 'text-slate-300 hover:text-white'
                }`}
              >
                ABOUT
              </Link>
              <Link
                href="/platform-demo"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/platform-demo') ? 'active' : 'text-slate-300 hover:text-white'
                }`}
              >
                PLATFORM DEMO
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/pricing') ? 'active' : 'text-slate-300 hover:text-white'
                }`}
              >
                PRICING
              </Link>

              {accessToken ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowDropdown(!showDropdown)}
                    buttonClassName="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-6 h-6 bg-(--accent) rounded-full flex items-center justify-center">
                      <span className="text-slate-900 font-bold text-xs">{userInitial}</span>
                    </div>
                    <span className="text-xs text-slate-300 max-w-30 truncate hidden sm:inline">
                      {userEmail}
                    </span>
                  </Button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent)!  transition-colors uppercase"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent)!  transition-colors border-t border-slate-700 disabled:opacity-50 uppercase"
                      >
                        {isSigningOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className={`text-sm font-semibold transition-colors ${
                      isActive('/auth/signin') ? ' active' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    LOGIN
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="bg-(--accent) hover:bg-orange-600 text-slate-900! font-bold py-1! px-6! rounded transition-colors"
                  >
                    GET STARTED
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`absolute left-0 right-0 top-20 w-full z-[300] sm:hidden bg-slate-900 border-b-4 border-(--accent) transition-all duration-300 ease-out ${showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          id="mobile-menu"
        >
          <div className="space-y-3 px-2 pt-2 pb-4">
            <Link
              href="/"
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${
                isActive('/')
                  ? 'bg-slate-800  active'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              HOME
            </Link>
            <Link
              href="/about"
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${
                isActive('/about')
                  ? 'bg-slate-800  active'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/platform-demo"
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${
                isActive('/platform-demo')
                  ? 'bg-slate-800  active'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              PLATFORM DEMO
            </Link>
            <Link
              href="/pricing"
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${
                isActive('/pricing')
                  ? 'bg-slate-800  active'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              PRICING
            </Link>

            {accessToken ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-sm font-semibold rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors uppercase"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  disabled={isSigningOut}
                  className="w-full text-left rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-(--accent)!  transition-colors disabled:opacity-50 uppercase"
                >
                  {isSigningOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${
                    isActive('/auth/signin')
                      ? 'bg-slate-800  active'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-(--accent) hover:bg-orange-600 text-white font-bold text-center rounded-md px-3 py-2 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  GET STARTED
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
