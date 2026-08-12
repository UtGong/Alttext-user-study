"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { QUESTION_AUDIO_STARTING_EVENT, speakText } from "@/lib/audio";

type QuestionAudioButtonProps = {
  text: string;
  speed?: number;
  voiceURI?: string;
  label?: string;
};

export function QuestionAudioButton({
  text,
  speed = 1,
  voiceURI,
  label = "Play question"
}: QuestionAudioButtonProps) {
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function play() {
    setErrorMessage("");
    setStatus("Playing question.");
    window.dispatchEvent(new Event(QUESTION_AUDIO_STARTING_EVENT));

    speakText({
      text,
      speed,
      voiceURI,
      onEnd: () => setStatus("Question ended."),
      onError: (message) => {
        setErrorMessage(message);
        setStatus("Question could not be played.");
      }
    });
  }

  return (
    <div className="question-audio-control">
      <AccessibleButton type="button" variant="secondary" onClick={play}>
        {label}
      </AccessibleButton>
      <span className="sr-status" aria-live="polite">
        {status}
      </span>
      {errorMessage && (
        <p className="warning" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
