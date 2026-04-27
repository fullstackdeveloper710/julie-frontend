'use client';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

export function AppFrame({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');
    return (
        <>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            {!isDashboard && <Footer />}
        </>
    );
}
