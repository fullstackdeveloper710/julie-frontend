export default function FeatureCards() {
  const features = [
    {
      icon: '',
      title: '5-Domain Health Scoring',
      desc: 'Leadership Sustainability, Fatigue Resistance, Peer Support Readiness, Operational Resilience, and Organizational Stability — scored every month.',
    },
    {
      icon: '',
      title: 'Operational Intelligence Reports',
      desc: 'ODS generates quarterly narrative reports including executive summary, risk indicators, scenario projections, and strategic recommendations.',
    },
    {
      icon: '',
      title: 'Grant Writing Assistant',
      desc: "Uses your agency's live operational data to generate ready-to-submit grant justification language for COPS, BJA, FEMA SAFER, and more.",
    },
    {
      icon: '',
      title: 'FMLA & OT Pattern Flags',
      desc: 'Automatically identifies compounding leave and overtime patterns before they become legal or HR issues — with specific recommended actions.',
    },
    {
      icon: '',
      title: 'Peer Benchmarking',
      desc: "Compare your agency's scores against anonymized national averages for your agency type — Law Enforcement, Fire, EMS, Dispatch, or Corrections.",
    },
    {
      icon: '',
      title: 'Custom Alert System',
      desc: 'Set threshold alerts for health scores, FMLA rates, vacancy levels, and morale — receive email notifications when metrics cross critical levels.',
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-slate-800 border-t-4 border-t-(--accent) rounded-lg p-7">
          <div className="text-3xl mb-3">{feature.icon}</div>
          <h3 className="font-bold text-lg text-white mb-2">{feature.title}</h3>
          <p className="text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}
