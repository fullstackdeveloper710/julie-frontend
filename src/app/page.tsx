'use client';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import WhatWeDoSection from '@/components/home/WhatWeDoSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSection />
      <StatsSection />
      <WhatWeDoSection />
      <NewsletterSection />
    </div>
  );
}
