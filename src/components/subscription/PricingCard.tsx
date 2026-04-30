'use client';

import Link from 'next/link';
import type { PricingPlan } from '@/lib/pricing';
import { USER_PLAN, BILLING_INTERVAL } from '@/types/enums';

interface Props {
  plan: PricingPlan;
  billingInterval: BILLING_INTERVAL;
  founderSpotsRemaining?: number;
}

function SavingsDisplay({
  monthly,
  annual,
  isAnnual,
}: {
  monthly: number;
  annual: number;
  isAnnual: boolean;
}) {
  const saved = monthly * 12 - annual;
  if (saved <= 0) return null;
  if (isAnnual) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-extrabold text-emerald-400">1 month FREE</span>
        <span className="text-sm font-semibold text-emerald-400">
          Save ${saved.toLocaleString()}
        </span>
      </div>
    );
  }

  return null;
}

export function PricingCard({ plan, billingInterval, founderSpotsRemaining }: Props) {
  const isFounder = plan.id === USER_PLAN.FOUNDER;
  const isEnterprise = plan.id === USER_PLAN.ENTERPRISE;
  const isAnnual = billingInterval === BILLING_INTERVAL.ANNUAL;

  const monthlyPrice = plan.pricing.monthly;
  const annualPrice = plan.pricing.annual;
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;
  const intervalLabel = isAnnual ? '/yr' : '/mo';

  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border p-8 shadow-2xl shadow-slate-950/40 transition-transform duration-200 hover:-translate-y-1 ${
        isFounder
          ? 'border-(--accent)! bg-slate-900'
          : 'border-slate-700 bg-slate-900/95'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--accent)! bg-slate-950 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-400 shadow-lg shadow-(--accent)!/20">
          {plan.badge}
        </div>
      )}

      <div className="flex h-full flex-col gap-4">

        {/* Plan name + description */}
        <div className="text-center">
          <h3 className="text-xs uppercase tracking-[0.28em] text-white">{plan.name}</h3>
          <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
          {isFounder && founderSpotsRemaining !== undefined && (
            <p className="mt-1.5 text-xs font-semibold text-orange-400">
              {founderSpotsRemaining} spot{founderSpotsRemaining !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* Pricing block */}
        <div className="text-center space-y-2">
          {isEnterprise ? (
            <>
              <div className="flex flex-wrap items-end justify-center gap-2">
                <span className="text-4xl font-bold text-white">$10K</span>
                <span className="pb-2 text-sm text-slate-300">/yr</span>
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Base · +$3K/yr per add-on department
              </p>
              <p className="text-xs text-slate-500">Annual only · 7 seats included</p>
            </>
          ) : displayPrice !== null ? (
            <>
              <div className="flex flex-wrap items-end justify-center gap-2">
                <span className="text-4xl font-bold text-white">
                  ${displayPrice.toLocaleString()}
                </span>
                <span className="pb-2 text-sm text-slate-300">{intervalLabel}</span>
              </div>

              {/* Annual: formula line */}
              {isAnnual && monthlyPrice && (
                <p className="text-xs text-slate-400">
                  ${monthlyPrice}/mo × 11 months billed annually
                </p>
              )}

              {/* Savings display — annual shows "1 month FREE", monthly shows "X% off" */}
              {monthlyPrice && annualPrice && (
                <SavingsDisplay monthly={monthlyPrice} annual={annualPrice} isAnnual={isAnnual} />
              )}

            </>
          ) : null}
        </div>

        {/* Feature list + CTA */}
        <div className="flex flex-1 flex-col justify-end gap-3 mt-auto">
          <ul className="space-y-2 text-sm text-slate-300 md:min-h-52">
            {/* Seat line */}
            <li className="flex items-start gap-3 border-b border-slate-700 pb-2">
              <span className="mt-0.5 text-(--accent)!">✓</span>
              {isEnterprise ? (
                <span>1 master + 2 dept holders + 4 managers (7 seats total)</span>
              ) : (
                <span>
                  {plan.features.departmentUserSeats} holder{plan.features.departmentUserSeats > 1 ? 's' : ''} +{' '}
                  {plan.features.managerSeats} manager{plan.features.managerSeats > 1 ? 's' : ''}
                  {' '}({plan.features.departmentUserSeats + plan.features.managerSeats} seats total)
                </span>
              )}
            </li>
            {plan.featureHighlights.map((f) => (
              <li key={f} className="flex items-start gap-3 border-b border-slate-700 pb-2">
                <span className="mt-0.5 text-(--accent)!">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/auth/signup?plan=${plan.id}&billing=${billingInterval}`}
            className={`inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${
              isFounder
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
