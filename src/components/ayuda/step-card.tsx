export function StepCard({
  step,
  title,
  description,
  icon: Icon,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-slate-400" />
          <h4 className="text-sm font-bold text-white">{title}</h4>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
