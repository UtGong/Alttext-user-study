"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { speakText } from "@/lib/audio";

type AudioDescriptionPlayerProps = {
  description: string;
  speed: number;
  voiceURI?: string;
  mode: "sample" | "practice" | "trial" | "preference";
  label?: string;
  onPlayed?: () => void;
  onReplay?: () => void;
  onEnded?: () => void;
};

export function AudioDescriptionPlayer({
  description,
  speed,
  voiceURI,
  mode,
  label = "description",
  onPlayed,
  onReplay,
  onEnded
}: AudioDescriptionPlayerProps) {
  const [playedOnce, setPlayedOnce] = useState(false);
  const [status, setStatus] = useState("Not played yet.");

  function play(isReplay: boolean) {
    setStatus(`Playing ${label}.`);

    if (isReplay) {
      onReplay?.();
    }

    if (!playedOnce) {
      onPlayed?.();
    }

    setPlayedOnce(true);

    speakText(description, speed, voiceURI, () => {
      setStatus(`${label} ended.`);
      onEnded?.();
    });
  }

  return (
    <section className="card audio-card" aria-labelledby={`${label.replaceAll(" ", "-")}-heading`}>
      <h3 id={`${label.replaceAll(" ", "-")}-heading`}>Audio {label}</h3>

      <p className="help-text">
        Speed: {speed}x.{" "}
        {mode === "trial"
          ? "During real trials, only play and replay are available."
          : "Use this to confirm audio comfort."}
      </p>

      <div className="button-row">
        <AccessibleButton type="button" onClick={() => play(false)}>
          Play {label}
        </AccessibleButton>

        <AccessibleButton type="button" variant="secondary" onClick={() => play(true)}>
          Replay {label}
        </AccessibleButton>
      </div>

      <p className="visible-status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}