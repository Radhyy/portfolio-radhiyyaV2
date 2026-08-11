export default function SkeletonGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 w-full">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i} 
            className="relative w-full aspect-[16/10] md:h-[260px] md:aspect-auto rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-200/50"
          >
            {/* Bottom-to-Top Sweep Animation */}
            <div 
              className="absolute inset-0 z-10 opacity-60"
              style={{
                background: 'linear-gradient(to top, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                backgroundSize: '100% 200%',
                animation: 'sweep-up 1.5s ease-in-out infinite'
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 z-20">
              <div className="w-3/4 h-6 bg-slate-300 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-slate-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep-up {
          0% { background-position: 0% 200%; }
          100% { background-position: 0% -100%; }
        }
      `}} />
    </>
  );
}
