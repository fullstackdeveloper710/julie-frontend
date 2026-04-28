'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { Logo } from './Logo';
import {
  useAppDispatch,
  useAppSelector,
  useListMyAgenciesQuery,
  setSelectedAgencyId,
  signOutLocally,
} from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import AgencyBadge from '../AgencyBadge';
import { HEADING_FONT } from '@/utils/constant';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.user.accessToken);
  const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAgencyMenu, setShowAgencyMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: userResp } = useGetCurrentUserQuery(undefined, { skip: !accessToken });
  const { data: agencyResp } = useListMyAgenciesQuery(undefined, { skip: !accessToken });
  const user = userResp?.data;
  const userEmail = user?.email || 'User';
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';
  const plan = user?.plan;
  const isEnterprise = plan === 'Enterprise';
  const isAdmin = user?.role === 'manager';
  const agencies = agencyResp?.data?.agencies ?? [];
  const capacity = agencyResp?.data?.capacity;
  const selectedAgency = agencies.find((a) => a._id === selectedAgencyId) ?? agencies[0];
  const isDashboard = pathname?.startsWith('/dashboard');
  const isOnAgencySetup = pathname?.startsWith('/dashboard/agency-setup');
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    dispatch(signOutLocally());
    router.replace('/auth/signin');
  };

  const switchAgency = (agencyId: string) => {
    dispatch(setSelectedAgencyId(agencyId));
    setShowAgencyMenu(false);
  };

  // Close menus on route change.
  useEffect(() => {
    setShowUserMenu(false);
    setShowAgencyMenu(false);
    setShowMobileMenu(false);
  }, [pathname]);

  if (isDashboard) {
    return (
      <header className="sticky top-0 z-200 flex items-center justify-between md:px-7 px-3 h-20 bg-slate-900 border-b-4 border-(--accent)">
        <Link href="/" className="flex items-center mt-3 mb-3 ml-1">
          <Logo size={120} className="mx-auto" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="text-[0.5rem] sm:text-xs font-semibold tracking-widest uppercase text-blue-300 hidden md:inline"
            style={{ fontFamily: HEADING_FONT }}
          >
            Operational Diagnostic System
          </span>

          {!isOnAgencySetup && selectedAgency && (
            <AgencyBadge
              isEnterprise={isEnterprise && !isAdmin}
              selected={selectedAgency}
              agencies={agencies}
              canCreateMore={!isAdmin && !!capacity?.canCreateMore}
              isOpen={showAgencyMenu}
              onToggle={() => setShowAgencyMenu((v) => !v)}
              onSwitch={switchAgency}
            />
          )}

          <div className="relative">
            <Button
              onClick={() => setShowUserMenu(!showUserMenu)}
              buttonClassName="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-(--accent) rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">{userInitial}</span>
              </div>
              <span className="text-xs text-slate-300 max-w-37.5 truncate hidden sm:inline">
                {userEmail}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm text-white font-semibold truncate">{userEmail}</p>
                  {plan && (
                    <p className="text-[10px] text-(--accent) font-bold uppercase tracking-widest mt-1">
                      {plan} Plan
                    </p>
                  )}
                </div>
                <Link
                  href="/dashboard/agencies"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent) transition-colors uppercase"
                >
                  {isAdmin
                    ? `View ${isEnterprise ? 'Agencies' : 'Agency'}`
                    : `Manage ${isEnterprise ? 'Agencies' : 'Agency'}`}
                </Link>
                {!isAdmin && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/dashboard/manager');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent) transition-colors uppercase"
                  >
                    Manage Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent) transition-colors border-t border-slate-700 uppercase"
                >
                  Logout
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
      <div className="mx-auto md:px-7 px-3">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex relative top-[-2px] items-center mt-3 mb-3 ml-1">
            <Logo size={120} className="mx-auto" />
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-slate-800 sm:hidden"
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
                className={`text-sm font-semibold transition-colors ${isActive('/') ? 'active' : 'text-slate-300 hover:text-white'}`}
              >
                HOME
              </Link>
              <Link
                href="/about"
                className={`text-sm font-semibold transition-colors ${isActive('/about') ? 'active' : 'text-slate-300 hover:text-white'}`}
              >
                ABOUT
              </Link>
              <Link
                href="/platform-demo"
                className={`text-sm font-semibold transition-colors ${isActive('/platform-demo') ? 'active' : 'text-slate-300 hover:text-white'}`}
              >
                PLATFORM DEMO
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-semibold transition-colors ${isActive('/pricing') ? 'active' : 'text-slate-300 hover:text-white'}`}
              >
                PRICING
              </Link>

              {accessToken ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    buttonClassName="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-6 h-6 bg-(--accent) rounded-full flex items-center justify-center">
                      <span className="text-slate-900 font-bold text-xs">{userInitial}</span>
                    </div>
                    <span className="text-xs text-slate-300 max-w-30 truncate hidden sm:inline">
                      {userEmail}
                    </span>
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent) transition-colors uppercase"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-(--accent) transition-colors border-t border-slate-700 uppercase"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className={`text-sm font-semibold transition-colors ${isActive('/auth/signin') ? ' active' : 'text-slate-300 hover:text-white'}`}
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
              onClick={() => setShowMobileMenu(false)}
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${isActive('/') ? 'bg-slate-800  active' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              HOME
            </Link>
            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${isActive('/about') ? 'bg-slate-800  active' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              ABOUT
            </Link>
            <Link
              href="/platform-demo"
              onClick={() => setShowMobileMenu(false)}
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${isActive('/platform-demo') ? 'bg-slate-800  active' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              PLATFORM DEMO
            </Link>
            <Link
              href="/pricing"
              onClick={() => setShowMobileMenu(false)}
              className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${isActive('/pricing') ? 'bg-slate-800  active' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              PRICING
            </Link>

            {accessToken ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-semibold rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors uppercase"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-(--accent) transition-colors uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block text-sm font-semibold rounded-md px-3 py-2 transition-colors ${isActive('/auth/signin') ? 'bg-slate-800  active' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setShowMobileMenu(false)}
                  className="block bg-(--accent) hover:bg-orange-600 text-white font-bold text-center rounded-md px-3 py-2 transition-colors"
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
