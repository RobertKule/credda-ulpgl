export default function PageLoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[50vh] bg-background flex flex-col items-center justify-center gap-6 py-24">
      <div
        className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary/70 font-outfit">{label}</p>
      )}
    </div>
  );
}
