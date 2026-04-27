export default function StatsSection() {
    return (
        <section className="bg-slate-900 border-y border-slate-800 py-8 px-4">
            <div className="max-w-6xl mx-auto flex justify-center gap-12 flex-wrap">
                {[
                    { number: '5', label: 'Scoring Domains' },
                    { number: '3', label: 'Multiple Intelligence Report Types' },
                    { number: '12', label: 'Months of Tracking' },
                    { number: '100%', label: 'Privacy-Conscious Design' },
                ].map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="font-bold text-3xl text-(--accent) mb-1">
                            {stat.number}
                        </div>
                        <div className="text-xs font-semibold tracking-widest  uppercase">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
