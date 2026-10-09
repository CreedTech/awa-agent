import Link from "next/link";
import { PropImage } from "@/components/shared/prop-image";
import { SITE_IMAGES } from "@/lib/site-images";

export function NoInventory() {
  return (
    <div className="aw-empty">
      <figure className="aw-empty-photo">
        <PropImage src={SITE_IMAGES.neighbourhood.src} label={SITE_IMAGES.neighbourhood.alt} className="aw-fill" sizes="(max-width: 800px) 100vw, 40vw" />
      </figure>
      <div className="aw-empty-body">
        <h3>New homes are on the way</h3>
        <p>No homes are open for inspection right now. Listings appear here the moment they pass review, with photos, the first-year rent and the assigned agent.</p>
        <div className="aw-empty-actions">
          <Link href="/how-it-works" className="aw-btn aw-btn-ink">See how a visit works</Link>
          <Link href="/#partners" className="aw-btn aw-btn-line">List a property</Link>
        </div>
      </div>
    </div>
  );
}
