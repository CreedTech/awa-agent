export function ListingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="aw-grid" aria-busy="true" aria-label="Loading homes">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="aw-card aw-card-skeleton" aria-hidden>
          <div className="aw-card-media aw-shimmer" />
          <div className="aw-card-body">
            <span className="aw-shimmer aw-line-sm" />
            <span className="aw-shimmer aw-line-lg" />
            <span className="aw-shimmer aw-line-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
