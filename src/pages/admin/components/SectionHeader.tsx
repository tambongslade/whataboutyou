import { useEffect, useState } from 'react';

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}

const SectionHeader = ({ index, eyebrow, title, subtitle, meta, children }: SectionHeaderProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dateLabel = now
    .toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'short' })
    .toUpperCase()
    .replace('.', '');

  return (
    <header className="mb-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-3 flex items-center gap-2">
            <span>{index}</span>
            <span className="w-6 h-px bg-gray-300" />
            <span className="text-red-500 font-nekst tracking-[0.4em]">{eyebrow}</span>
          </div>
          <h1 className="font-azonix text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight leading-[0.95]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 font-nekst text-sm text-gray-500 max-w-xl">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
          <div>{dateLabel}</div>
          {meta && <div className="text-gray-700">{meta}</div>}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />
        <div className="w-1.5 h-1.5 bg-red-500" />
        <div className="h-px w-10 bg-yellow-400" />
        <div className="w-1.5 h-1.5 bg-black" />
      </div>

      {children && <div className="mt-6">{children}</div>}
    </header>
  );
};

export default SectionHeader;
