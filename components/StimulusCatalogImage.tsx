"use client";

import { useState } from "react";
import Image from "next/image";

export function StimulusCatalogImage({ filename, uuid }: { filename: string; uuid: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return <div className="catalog-image-missing" role="status">Image file unavailable: {filename}</div>;
  }

  return (
    <Image
      className="catalog-image"
      src={`/images/${encodeURIComponent(filename)}`}
      alt={`Study stimulus ${uuid}`}
      width={960}
      height={720}
      unoptimized
      onError={() => setMissing(true)}
    />
  );
}
