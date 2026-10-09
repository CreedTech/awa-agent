import Link from "next/link";

export function LiveFeatureUnavailable({ feature }: { feature: string }) {
  return <div className="page page-narrow">
    <div className="card card-pad" role="status">
      <h1 className="page-title" style={{ fontSize: 24 }}>{feature} is unavailable</h1>
      <p style={{ color: "var(--muted)", marginTop: 10 }}>
        We could not open this area right now. Please try again later.
      </p>
      <Link className="btn btn-primary" href="/explore" style={{ marginTop: 18 }}>Explore live properties</Link>
    </div>
  </div>;
}
