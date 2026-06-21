interface SectionDividerProps {
  label?: string;
}

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="section-divider container-main" aria-hidden="true">
      <span className="section-divider-line" />
      {label ? (
        <span className="section-divider-label font-mono text-[9px] uppercase tracking-[0.35em] text-fog/50 shrink-0">
          {label}
        </span>
      ) : (
        <span className="section-divider-dot" />
      )}
      <span className="section-divider-line section-divider-line--reverse" />
    </div>
  );
}
