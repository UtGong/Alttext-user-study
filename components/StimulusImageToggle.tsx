"use client";

import { useId, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";

type Props = {
  imageFilename: string;
  imageUrl?: string;
};

export function StimulusImageToggle({ imageFilename, imageUrl }: Props) {
  const [visible, setVisible] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const regionId = `stimulus-image-${useId().replaceAll(":", "")}`;
  const source = imageUrl?.trim() || `/images/${encodeURIComponent(imageFilename)}`;

  return (
    <section className="stimulus-image-controls" aria-label="Study image controls">
      <AccessibleButton
        type="button"
        variant="secondary"
        aria-expanded={visible}
        aria-controls={regionId}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? "Hide image" : "Show image"}
      </AccessibleButton>

      {visible && (
        <div id={regionId} className="stimulus-image-frame">
          {loadError ? (
            <p className="warning" role="alert">
              The image file is unavailable. Ask the researcher to verify the study image assets.
            </p>
          ) : (
            // A content description here would reveal experimental information before it is heard.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="stimulus-image"
              src={source}
              alt="Study stimulus"
              onLoad={() => setLoadError(false)}
              onError={() => setLoadError(true)}
            />
          )}
        </div>
      )}
    </section>
  );
}
