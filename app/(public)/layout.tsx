import { AppFrame } from "@/components/layout/app-frame";

/** Public marketplace + tenant-facing pages share the AppFrame chrome. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
