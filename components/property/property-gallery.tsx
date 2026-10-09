"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { PhotoViewer } from "@/components/property/photo-viewer";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [viewing, setViewing] = useState<number | null>(null);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="aw-gallery aw-gallery-0">
        <PropImage label={title} className="aw-gallery-tile" />
      </div>
    );
  }

  const tiles = images.slice(0, 5);
  return (
    <div className="aw-gallery-wrap">
      <div className={cn("aw-gallery", `aw-gallery-${Math.min(count, 5)}`)}>
        {tiles.map((src, index) => (
          <button
            key={src + index}
            type="button"
            className="aw-gallery-tile"
            onClick={() => setViewing(index)}
            aria-label={`Open photo ${index + 1} of ${count}`}
          >
            <PropImage
              src={src}
              label={`${title}, photo ${index + 1} of ${count}`}
              className="aw-gallery-img"
              sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 20vw"}
              priority={index === 0}
            />
          </button>
        ))}
      </div>
      {count > 1 && (
        <button type="button" className="aw-gallery-all" onClick={() => setViewing(0)}>
          <Icon name="image" size={16} /> {`View all ${count} photos`}
        </button>
      )}
      {viewing !== null && (
        <PhotoViewer images={images} index={viewing} title={title} onIndexChange={setViewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
