// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomTooltip({ active, payload, label, currency }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-xl p-3 border border-white/10">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map(
          (
            entry: { name: string; value: number; color: string },
            index: number,
          ) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {currency} {entry.value.toLocaleString()}
            </p>
          ),
        )}
      </div>
    );
  }
  return null;
}
