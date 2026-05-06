interface StatCardProps {
  index: string;
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'red' | 'yellow' | 'black';
  trend?: 'up' | 'down' | 'flat';
}

const accentMap: Record<NonNullable<StatCardProps['accent']>, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  black: 'bg-black',
};

const StatCard = ({ index, label, value, hint, accent = 'red', trend }: StatCardProps) => {
  const accentColor = accentMap[accent];

  const formatted =
    typeof value === 'number' && Number.isFinite(value)
      ? value.toLocaleString('fr-FR')
      : value;

  return (
    <div className="group relative bg-white border border-black/10 hover:border-black p-6 transition-colors duration-200">
      <div aria-hidden className={`absolute top-0 left-0 right-0 h-[2px] ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between mb-6">
        <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 leading-tight max-w-[70%]">
          {label}
        </div>
        <div className="font-mono text-[10px] tracking-widest text-gray-400">{index}</div>
      </div>

      <div className="font-azonix text-4xl lg:text-5xl text-black leading-none tracking-tight">
        {formatted}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className={`w-6 h-px ${accentColor}`} />
        {hint && (
          <div className="font-nekst text-[10px] tracking-[0.25em] uppercase text-gray-500">
            {hint}
          </div>
        )}
        {trend && (
          <div
            className={`ml-auto text-[10px] font-mono ${
              trend === 'up'
                ? 'text-emerald-600'
                : trend === 'down'
                  ? 'text-red-500'
                  : 'text-gray-400'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '·'}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
