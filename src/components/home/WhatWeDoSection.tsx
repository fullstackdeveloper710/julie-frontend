import FeatureCards from './FeatureCards';

export default function WhatWeDoSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="font-bold text-xs tracking-widest text-(--accent) uppercase mb-3">
            What We Do
          </div>
          <h2 className="font-extrabold text-3xl md:text-4xl text-white mb-4">
            Operational Intelligence.
            <br />
            Not Just Data.
          </h2>
          <p className=" leading-relaxed max-w-xl">
            Monthly check-ins take 15 minutes. The platform does the rest — scoring, analysis,
            projections, and AI-generated reports your command staff can act on immediately.
          </p>
        </div>
        <FeatureCards />
      </div>
    </section>
  );
}
