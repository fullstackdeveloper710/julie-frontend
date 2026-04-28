import Link from 'next/link';
import type { PricingPlan } from '@/lib/pricing';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const isFounding = plan.id === 'founding';
  const isEnterprise = plan.id === 'enterprise';

  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border p-8 shadow-2xl shadow-slate-950/40 transition-transform duration-200 hover:-translate-y-1 ${
        isFounding ? 'border-(--accent)! bg-slate-900' : 'border-slate-700 bg-slate-900/95'
      }`}
    >
      {plan.badge && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--accent)! bg-slate-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-400 shadow-lg shadow-(--accent)!/20">
          {plan.badge}
        </div>
      )}

      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-xs uppercase tracking-[0.28em] text-white">{plan.name}</h3>
            <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
          </div>

          <div className="space-y-4 text-center">
            <div className="space-y-2">
              {plan.display.promo && !isEnterprise && (
                <div className="rounded-3xl bg-slate-800 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    {plan.display.promo}
                  </p>
                  {plan.display.priceNote && (
                    <p className="mt-2 text-xs text-slate-300">{plan.display.priceNote}</p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-end justify-center gap-2">
                <span className="text-4xl font-bold text-white">{plan.display.priceLabel}</span>
                <span className="pb-2 text-sm text-slate-300">{plan.display.priceIntervalLabel}</span>
              </div>

              {isEnterprise && plan.display.priceNote && (
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {plan.display.priceNote}
                </p>
              )}

              {plan.annualSavings && !isEnterprise && (
                <p className="text-xs text-emerald-400">Save {plan.annualSavings}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-3 mt-auto">
          <ul className="space-y-2 text-sm text-slate-300 mt-auto md:min-h-52">
            <li className="flex items-start gap-3 border-b border-slate-700">
              <span className="mt-1 text-(--accent)!">✓</span>
              <span>
                {plan.features.adminSeats} Admin + {plan.features.viewerSeats} Viewer seats
              </span>
            </li>
            {plan.features.trialDays && (
              <li className="flex items-start gap-3 border-b border-slate-700">
                <span className="mt-1 text-(--accent)!">✓</span>
                <span>{plan.features.trialDays}-day free trial</span>
              </li>
            )}
            {plan.featureHighlights.map((feature) => (
              <li key={feature} className="flex items-start gap-3 border-b border-slate-700">
                <span className="mt-1 text-(--accent)!">✓</span>
                <span>{feature}</span>
              </li>
            ))}
            {plan.features.apiAccess && !plan.featureHighlights.some((feature) => feature === 'API access') && (
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
            {plan.display.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}