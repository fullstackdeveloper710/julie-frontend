import Image from 'next/image';
import targetImage from '@/assets/icons/target.png';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-bold text-xs tracking-widest text-(--accent) uppercase mb-3">
                Our Story
              </div>
              <h2 className="font-bold text-4xl text-white mb-6 leading-tight">
                Built By Someone
                <br />
                Who Lived It
              </h2>
              <p className=" leading-relaxed mb-4">
                Frontline Frameworks was founded by a former 911 dispatcher who experienced
                firsthand the impact of workforce stress, leadership gaps, and operational burnout
                in high-demand public safety environments.
              </p>
              <p className=" leading-relaxed mb-4">
                What started as a leadership development and training company has evolved into a
                comprehensive workforce intelligence platform — giving agencies the data-driven
                tools they need to support their people before problems escalate.
              </p>
              <p className=" leading-relaxed mb-6">
                Every feature, every score, every report is designed with one goal: helping public
                safety agencies retain great people and build resilient organizations.
              </p>
              <div className="space-y-3">
                {[
                  'SHRM Recertification Provider — approved to offer SHRM Professional Development Credits (PDCs)',
                  'IADLEST Credentialed — recognized by the International Association of Directors of Law Enforcement Standards and Training',
                  'NAADAC & COPA Approved Curriculum — aligned with IC&RC five-domain peer support model',
                  'Certified Peer Support Specialist (CPRS) — training aligned with national peer recovery standards',
                  'Founded by a former 911 dispatcher — authentic public safety expertise',
                ].map((cred, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm "
                  >
                    <div className="w-2 h-2 rounded-full bg-(--accent) shrink-0 mt-1" />
                    {cred}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center mb-4">
                <div className="text-7xl mb-4 leading-24">
                  {/* Replace with professional framework/structure graphic - suggested sources: Unplash, Pexels, or custom SVG */}
                  <div className="w-full h-32 flex items-center justify-center relative">
                    <Image
                      src={targetImage}
                      alt="Frontline Frameworks Mission"
                      fill
                      className="object-contain opacity-50"
                      style={{
                        filter: ' invert(1)',
                      }}
                    />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-white mb-3">Our Mission</h3>
                <p className=" text-sm leading-[1.8]">
                  To give every public safety agency — regardless of size or budget — the <br />{' '}
                  workforce intelligence tools they need to protect their people, strengthen
                  <br /> their culture, and sustain their mission.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 gap-y-8">
                {[
                  { number: '15+', label: 'Years Experience' },
                  { number: '100%', label: 'Privacy-Conscious Design' },
                  { number: '3', label: 'Multiple Intelligence Report Types' },
                  { number: '5', label: 'Scoring Domains' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 border-t-4 border-t-(--accent) border-slate-700 rounded-lg p-4 text-center"
                  >
                    <div className="font-bold text-2xl text-(--accent) mb-1">{stat.number}</div>
                    <div className="text-xs tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
