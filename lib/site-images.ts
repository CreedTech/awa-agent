/** Unsplash License photos (unsplash.com/license) used as page atmosphere only, never presented as listings. */
export interface SiteImage {
  src: string;
  alt: string;
}

const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const SITE_IMAGES = {
  apartments: {
    src: unsplash("1531300365552-da5abe58a725"),
    alt: "A five-storey apartment block with terracotta balconies under a blue sky",
  },
  rooftops: {
    src: unsplash("1658394818344-20f0f11a9121"),
    alt: "Rust-red zinc rooftops and a white apartment building seen from a balcony",
  },
  neighbourhood: {
    src: unsplash("1639774275491-71d62502a4e0"),
    alt: "Houses and palm trees across a green residential neighbourhood",
  },
  kitchen: {
    src: unsplash("1633119712778-30d94755de54"),
    alt: "A bright fitted kitchen with marble walls and pendant lights",
  },
} satisfies Record<string, SiteImage>;
