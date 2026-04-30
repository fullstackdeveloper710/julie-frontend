type Props = {
  totalSteps: number;
  currentStep: number;
};

export function StepProgress({ totalSteps, currentStep }: Props) {
  return (
    <div className="flex gap-1 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1.5 rounded-full transition-colors ${
            i < currentStep ? 'bg-(--accent)' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
}
