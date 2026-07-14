"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { speakText, stopSpeech } from "@/lib/audio";

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
  const [errorMessage, setErrorMessage] = useState("");

  function play(isReplay: boolean) {
    setErrorMessage("");
    setStatus(`Playing ${label}.`);

    stopSpeech();

    if (isReplay) {
      onReplay?.();
    }

    if (!playedOnce) {
      onPlayed?.();
    }

    setPlayedOnce(true);

    speakText({
      text: description,
      speed,
      voiceURI,
      onStart: () => {
        setStatus(`Playing ${label}.`);
      },
      onEnd: () => {
        setStatus(`${label} ended.`);
        onEnded?.();
      },
      onError: (message) => {
        setErrorMessage(message);
        setStatus(`${label} could not be played.`);
      }
    });
  }

  return (
    <section
      className="card audio-card"
      aria-labelledby={`${label.replaceAll(" ", "-")}-heading`}
    >
      <h3 id={`${label.replaceAll(" ", "-")}-heading`}>Audio {label}</h3>

      <p className="help-text">
        {mode === "trial"
          ? "Play the description before answering. You may replay it if needed."
          : "Use this audio to confirm that the voice and speed are comfortable."}
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

      {errorMessage && (
        <p className="warning" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}