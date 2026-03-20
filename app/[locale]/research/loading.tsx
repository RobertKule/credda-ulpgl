// app/[locale]/research/loading.tsx
export default function ResearchLoading() {
  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Skeleton Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 border-b border-white/5 pb-16">
          <div className="space-y-6 w-full max-w-2xl">
            <div className="h-2 w-32 bg-white/5 animate-pulse" />
            <div className="h-20 w-full bg-white/5 animate-pulse" />
          </div>
          <div className="h-12 w-64 bg-white/5 animate-pulse hidden md:block" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-8 p-8 border border-white/5 bg-[#111110]">
              <div className="aspect-[4/5] bg-black/40 animate-pulse" />
              <div className="space-y-4">
                <div className="h-2 w-24 bg-white/5 animate-pulse" />
                <div className="h-8 w-full bg-white/5 animate-pulse" />
                <div className="h-20 w-full bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
