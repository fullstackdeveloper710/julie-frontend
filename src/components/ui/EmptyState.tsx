interface EmptyStateProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  subtitle?: string;
  children?: React.ReactNode;
  layout?: 'centered' | 'default';
}

export function EmptyState({
  icon,
  title,
  description,
  subtitle,
  children,
  layout = 'centered',
}: EmptyStateProps) {
  if (layout === 'default') {
    return (
      <div>
        <div className="mb-6">
          <div
            className="font-condensed font-bold text-2xl tracking-wider text-white"
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
          >
            {title}
          </div>
          <div className="text-sm  mt-1 mb-6">
            {description}
          </div>
        </div>

        {subtitle && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 text-xs text-blue-300">
            ℹ &nbsp;{subtitle}
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-10 mb-4 text-center">
          <div className="text-4xl mb-3">{icon}</div>
          {children}
        </div>
      </div>
    );
  }

  // Centered layout (default)
  return (
    <div className="px-7 py-8 max-w-5xl mx-auto">
      <div className="text-center py-16 px-5">
        <div className="text-5xl mb-4">{icon}</div>
        <h2
          className="font-bold text-3xl mb-3 text-white"
          style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
        >
          {title}
        </h2>
        <p className=" max-w-xl mx-auto mb-6 leading-relaxed">
          {description}
        </p>
        {subtitle && (
          <div className="text-xs text-slate-500">
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
