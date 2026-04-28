import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background:
          'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 50%, rgb(15, 25, 34) 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(46, 64, 85, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(46, 64, 85, 0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(at 30% 50%, rgba(240, 90, 40, 0.08) 0%, transparent 60%), radial-gradient(at 70% 50%, rgba(44, 62, 80, 0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-(--accent)/30 bg-(--accent)/10">
          <span className="w-2 h-2 rounded-full bg-(--accent) animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-(--accent) uppercase">
            SHRM Recertification Provider | IADLEST Credentialed
          </span>
        </div>

        <h1 className="font-extrabold lg:text-[clamp(2.8rem,6vw,4.8rem)] md:text-6xl text-2xl leading-tight mb-6 text-white ">
          The Intelligence Platform
          <br />
          <span className="text-(--accent) ">Built For Those Who Protect Us</span>
        </h1>

        <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Frontline Frameworks gives public safety agencies a structured monthly diagnostic system
          that turns operational data into AI-powered workforce intelligence — so leaders can act
          before problems escalate.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            'SHRM Recertification Provider',
            'IADLEST Credentialed',
            'Privacy-Conscious Design',
            'AI-Powered Reports',
          ].map((tag) => (
            <div
              key={tag}
              className="px-4 py-2 bg-slate-800/40 border border-slate-700 rounded text-xs font-semibold tracking-wide  uppercase"
            >
              {tag}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/platform-demo">
            <Button buttonClassName="!font-bold text-sm tracking-wider uppercase px-8 py-3 rounded bg-(--accent) text-slate-950 hover:bg-(--accent)/80 transition-colors">
              Try The Demo
            </Button>
          </Link>
          <Link href="/pricing">
            <Button buttonClassName="!font-bold text-sm tracking-wider bg-transparent uppercase px-8 py-3 rounded border border-slate-700 text-white hover:border-slate-600 transition-colors">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
