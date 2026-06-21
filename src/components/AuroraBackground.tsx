export default function AuroraBackground() {
  return (
    <div className="aurora-wrap pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2 hidden sm:block" />
      <div className="aurora-blob aurora-blob-3 hidden md:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/10 to-obsidian" />
    </div>
  );
}
