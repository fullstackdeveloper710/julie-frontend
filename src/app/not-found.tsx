'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div
        className="w-full"
        style={{
          background: 'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="text-9xl font-black text-(--accent) opacity-25 leading-none">404</div>
              <div className="text-6xl font-black text-(--accent) -mt-16">404</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-slate-400 text-lg mb-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-slate-500 text-sm mb-12">
            Check the URL or navigate to one of the links below.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button buttonClassName="px-8 py-3 bg-(--accent) hover:bg-orange-600 text-slate-950 font-bold text-sm tracking-widest uppercase rounded-lg transition-colors w-full sm:w-auto">
                Dashboard →
              </Button>
            </Link>

            <Link href="/">
              <Button buttonClassName="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-colors w-full sm:w-auto">
                Home
              </Button>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-700">
            <p className="text-slate-500 text-sm mb-4">Need help?</p>
            <p className="text-slate-400">
              Contact support at{' '}
              <a
                href="mailto:support@frontlineframework.com"
                className="text-(--accent) hover:text-orange-600 font-semibold"
              >
                support@frontlineframework.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
