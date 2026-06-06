"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PropertyCard } from "@/components/property/property-card";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";

export default function SavedPage() {
  const saved = useAppStore(useShallow((s) => s.properties.filter((p) => s.savedIds.includes(p.id))));

  return (
    <div className="page">
      <PageHeader title="Saved homes" subtitle="Properties you've bookmarked to revisit." />
      {saved.length === 0 ? (
        <EmptyState icon="bookmark" title="Save homes you like" description="Tap the bookmark on any listing and it'll show up here." action={{ label: "Explore homes", href: "/explore" }} />
      ) : (
        <div className="prop-grid">
          {saved.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
