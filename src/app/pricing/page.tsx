import { PRICING_CONFIG, getAnnualSavings } from '@/types';
import Link from 'next/link';

export default function Pricing() {
  const plans = Object.entries(PRICING_CONFIG).map(([key, config]) => ({
    id: key,
    ...config,
  }));

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="font-bold text-xs tracking-widest text-(--accent)! uppercase mb-3">
            Transparent Pricing
          </div>
          <h2 className="font-bold text-4xl text-white mb-4 leading-tight">
            Plans For Every Agency
          </h2>
          <p className="leading-relaxed max-w-2xl mb-12">
            Start free with our Founding tier. No feature gating. Every plan includes full platform
            access with AI capabilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
            {plans.map((plan) => {
              const annual = plan.pricing.annual;
              const monthly = plan.pricing.monthly;
              const savings = getAnnualSavings(plan.id as any);
              const isEnterprise = plan.id === 'enterprise';
              const isFounding = plan.id === 'founding';

              return (
                <div
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-xl border p-8 shadow-2xl shadow-slate-950/40 transition-transform duration-200 hover:-translate-y-1 ${
                    isFounding
                      ? 'border-(--accent)! bg-slate-900 '
                      : 'border-slate-700 bg-slate-900/95'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--accent)! bg-slate-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-400 shadow-lg shadow-(--accent)!/20">
                      {plan.badge}
                    </div>
                  )}

                  <div className="flex h-full flex-col justify-between gap-4 ">
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="text-xs uppercase tracking-[0.28em] ">{plan.name}</h3>
                        <p className="mt-3 text-sm ">{plan.description}</p>
                      </div>

                      <div className="space-y-4 text-center">
                        {isEnterprise ? (
                          <div className="space-y-3">
                            <div className="flex items-baseline justify-center gap-3">
                              <span className="text-4xl font-bold text-white">$7K</span>
                              <span className="pb-2 text-sm ">/yr</span>
                            </div>
                            <p className="text-xs uppercase tracking-[0.24em] ">
                              First dept + $2K each additional
                            </p>
                          </div>
                        ) : isFounding ? (
                          <div className="space-y-2">
                            <div className="rounded-3xl bg-slate-800 px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                                Free 90 days to start
                              </p>
                              <p className="mt-2 text-xs text-slate-300">
                                Locked for life price on activation
                              </p>
                            </div>
                            <div className="flex items-end justify-center gap-4">
                              <span className="text-3xl font-bold tracking-tight text-white">
                                ${monthly}
                              </span>
                              <span className="pb-2 text-sm ">/mo</span>
                            </div>
                            <p className="text-sm ">Locked forever after trial</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            {monthly && (
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-white">${monthly}</span>
                                <span className="pb-2 text-sm ">/mo</span>
                              </div>
                            )}
                            {annual && (
                              <div className="flex items-center gap-2 ">
                                <span className="text-sm">${annual}</span>
                                <span className="text-xs uppercase tracking-[0.18em]">/yr</span>
                              </div>
                            )}
                            {savings && <p className="text-xs text-emerald-400">Save {savings}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-end  gap-3 mt-auto">
                      <ul className="space-y-2 text-sm text-slate-300 mt-auto md:min-h-52">
                        <li className="flex items-start gap-3 border-b border-slate-700">
                          <span className="mt-1 text-(--accent)!">✓</span>
                          <span>
                            {plan.features.adminSeats} Admin + {plan.features.viewerSeats} Viewer
                            seats
                          </span>
                        </li>
                        {plan.features.trialDays && (
                          <li className="flex items-start gap-3 border-b border-slate-700">
                            <span className="mt-1 text-(--accent)!">✓</span>
                            <span>{plan.features.trialDays}-day free trial</span>
                          </li>
                        )}
                        <li className="flex items-start gap-3 border-b border-slate-700">
                          <span className="mt-1 text-(--accent)!">✓</span>
                          <span>Full platform access</span>
                        </li>
                        <li className="flex items-start gap-3 border-b border-slate-700">
                          <span className="mt-1 text-(--accent)!">✓</span>
                          <span>All Intelligence Report features</span>
                        </li>
                        {plan.features.apiAccess && (
                          <li className="flex items-start gap-3 border-b border-slate-700">
                            <span className="mt-1 text-(--accent)!">✓</span>
                            <span>API access</span>
                          </li>
                        )}
                        {isEnterprise && (
                          <>
                            <li className="flex items-start gap-3 border-b border-slate-700">
                              <span className="mt-1 text-(--accent)!">✓</span>
                              <span>Multi-department access</span>
                            </li>
                            <li className="flex items-start gap-3 border-b border-slate-700">
                              <span className="mt-1 text-(--accent)!">✓</span>
                              <span>Dedicated support</span>
                            </li>
                          </>
                        )}
                      </ul>

                      <Link
                        href={`/auth/signup?plan=${plan.id}`}
                        className={`inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${
                          isFounding
                            ? 'bg-(--accent)! hover:bg-orange-600 text-(--foreground)! shadow-lg shadow-(--accent)!/20'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {isFounding ? 'Claim Founding Rate' : 'Get Started'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center mb-12">
            <h3 className="font-bold text-lg text-white mb-2">Grant-Eligible Platform</h3>
            <p className=" text-sm leading-relaxed max-w-2xl mx-auto">
              Frontline Frameworks is a SHRM Recertification Provider. Subscription costs and
              training engagements may qualify for public safety wellness grants, workforce
              development funding, and HR professional development budgets. We provide grant support
              letters and budget justification language.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-md p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-2">What happens after my 90-day trial?</h4>
                <p className="text-sm ">
                  Your Founding rate ($149/month or $1,499/year) locks in permanently. You'll need
                  to add billing details before the trial ends.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Can I change my plan later?</h4>
                <p className="text-sm ">
                  Yes! You can upgrade at any time. Founding pricing remains locked forever once you
                  activate it.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Do you offer annual discounts?</h4>
                <p className="text-sm ">
                  Yes. Annual plans save 8-10% compared to monthly billing across all tiers.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Is there a setup fee?</h4>
                <p className="text-sm ">
                  No setup fees. Start your 90-day trial immediately with no credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
