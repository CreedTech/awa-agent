import Link from "next/link";

export function LiveFeatureUnavailable({ feature }: { feature: string }) {
  return <div className="page page-narrow">
    <div className="card card-pad" role="status">
      <h1 className="page-title" style={{ fontSize: 24 }}>{feature} is not available yet</h1>
      <p style={{ color: "var(--muted)", marginTop: 10 }}>
        This area does not have a working backend endpoint. It will appear here when live data is available.
      </p>
      <Link className="btn btn-primary" href="/explore" style={{ marginTop: 18 }}>Explore live properties</Link>
    </div>
  </div>;
}
