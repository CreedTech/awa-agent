import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";

const POINTS = [
  "See the first-year rent on every listing before you visit.",
  "Request an inspection and get a six-digit code for the visit.",
  "The street address appears after the agent confirms your code at the door.",
];

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="aw-auth">
      <aside className="aw-auth-side">
        <Link href="/" aria-label="AwaAgent home" className="aw-header-logo">
          <Logo light size={30} />
        </Link>
        <div>
          <h2>Rent a home you&apos;ve <em>seen in person.</em></h2>
          <ul className="aw-auth-points">
            {POINTS.map((point) => (
              <li key={point}>
                <Icon name="check" size={18} /> {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="aw-auth-main">
        <div className="aw-auth-form">
          <Link href="/" aria-label="AwaAgent home" className="aw-auth-mobile-logo">
            <Logo size={28} />
          </Link>
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {footer && <div>{footer}</div>}
        </div>
      </main>
    </div>
  );
}
