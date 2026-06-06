import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="col center" style={{ minHeight: "100vh", textAlign: "center", gap: 18, padding: 24 }}>
      <Logo size={34} />
      <span className="grid place-items-center" style={{ width: 72, height: 72, borderRadius: 20, background: "var(--navy-050)", color: "var(--navy-600)" }}>
        <Icon name="explore" size={32} />
      </span>
      <h1 style={{ fontSize: 28 }}>Page not found</h1>
      <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 380 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="row gap-3">
        <Link href="/" className="btn btn-primary">Back home</Link>
        <Link href="/explore" className="btn btn-ghost">Explore homes</Link>
      </div>
    </div>
  );
}
