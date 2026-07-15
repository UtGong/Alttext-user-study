"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { speakText, stopSpeech } from "@/lib/audio";
import { AudioPlayEvent } from "@/types/study";

type AudioDescriptionPlayerProps = {
  description: string;
  speed: number;
  voiceURI?: string;
  mode: "sample" | "practice" | "trial" | "preference";
  label?: string;
  maxReplays?: number;
  onPlayed?: () => void;
  onReplay?: () => void;
  onPlaybackEvent?: (event: AudioPlayEvent) => void;
  onEnded?: () => void;
};

export function AudioDescriptionPlayer({
  description,
  speed,
  voiceURI,
  mode,
  label = "description",
  maxReplays,
  onPlayed,
  onReplay,
  onPlaybackEvent,
  onEnded
}: AudioDescriptionPlayerProps) {
  const [playCount, setPlayCount] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const [status, setStatus] = useState("Not played yet.");
  const [errorMessage, setErrorMessage] = useState("");

  const playedOnce = playCount > 0;
  const replayDisabled =
    !playedOnce || (typeof maxReplays === "number" && replayCount >= maxReplays);

  function play(isReplay: boolean) {
    if (isReplay && replayDisabled) return;

    const nextPlayNumber = playCount + 1;
    const playedAt = new Date().toISOString();

    setErrorMessage("");
    setStatus(`Playing ${label}.`);
    stopSpeech();

    if (isReplay) {
      setReplayCount((count) => count + 1);
      onReplay?.();
    }

    if (!playedOnce) {
      onPlayed?.();
    }

    setPlayCount(nextPlayNumber);
    onPlaybackEvent?.({
      playedAt,
      playNumber: nextPlayNumber,
      isReplay
    });

    speakText({
      text: description,
      speed,
      voiceURI,
      onStart: () => setStatus(`Playing ${label}.`),
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

  const replayHelp =
    mode === "trial" && maxReplays === 1
      ? replayCount >= 1
        ? "The one allowed replay has been used."
        : "You may replay this description once."
      : mode === "preference"
        ? "You may play and replay this description as many times as needed."
        : "Use this audio to confirm that the voice and speed are comfortable.";

  return (
    <section
      className="card audio-card"
      aria-labelledby={`${label.replaceAll(" ", "-")}-heading`}
    >
      <h3 id={`${label.replaceAll(" ", "-")}-heading`}>Audio {label}</h3>

      <p className="help-text">{replayHelp}</p>

      <div className="button-row">
        <AccessibleButton type="button" onClick={() => play(false)}>
          Play {label}
        </AccessibleButton>

        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={() => play(true)}
          disabled={replayDisabled}
        >
          Replay {label}
        </AccessibleButton>
      </div>

      <p className="visible-status" aria-live="polite">
        {status}
      </p>

      {mode === "trial" && maxReplays === 1 && playedOnce && (
        <p className="help-text">
          Replay used: {replayCount > 0 ? "Yes" : "No"}
        </p>
      )}

      {errorMessage && (
        <p className="warning" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
