import Link from 'next/link';
import React from 'react';
import { Logo } from './Logo';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  links?: { name: string; href: string }[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  copyright?: React.ReactNode;
  contact?: React.ReactNode;
}

export function Footer({
  className = '',
  style = {},
  links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Demo', href: '/platform-demo' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Login', href: '/auth/signin' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
  title = <Logo size={200} className="mx-auto mb-2" />,
  description = 'Operational Diagnostic System — Workforce Resilience Intelligence Platform',
  copyright = (
    <>
      © 2025 Frontline Frameworks. All rights reserved. SHRM Recertification Provider. IADLEST
      Credentialed.
    </>
  ),
  contact = <>Training@FrontlineFrameworks.org · www.FrontlineFrameworks.org</>,
}: Props) {
  return (
    <footer className={`bg-slate-950 border-t-4 border-t-(--accent) ${className}`} style={style}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-xs mb-4">{description}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs hover:text-slate-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-xs border-t border-slate-800 pt-6">
          <p>{copyright}</p>
          <p>{contact}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
