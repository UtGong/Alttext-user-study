"use client";

import { useEffect, useRef, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import {
  QUESTION_AUDIO_STARTING_EVENT,
  SPEECH_INPUT_STARTING_EVENT,
  stopSpeech
} from "@/lib/audio";
import type {
  RecognitionErrorEventLike,
  RecognitionEventLike,
  RecognitionLike
} from "@/types/speech-recognition";

type SpeechOption = {
  value: string;
  label: string;
  aliases?: string[];
};

function normalizeSpeech(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

const numberWords = ["one", "two", "three", "four", "five"];
const ordinalWords = ["first", "second", "third", "fourth", "fifth"];

export function matchSpokenOption(transcript: string, options: SpeechOption[]) {
  const heard = normalizeSpeech(transcript);
  if (!heard) return null;

  const exactMatches = options.filter((option) =>
    [option.label, ...(option.aliases ?? [])]
      .map(normalizeSpeech)
      .some((candidate) => candidate === heard || candidate.replaceAll(" ", "") === heard.replaceAll(" ", ""))
  );
  if (exactMatches.length === 1) return exactMatches[0];

  const phraseMatches = options
    .map((option) => ({
      option,
      length: Math.max(
        ...[option.label, option.value, ...(option.aliases ?? [])]
          .map(normalizeSpeech)
          .filter(Boolean)
          .filter((candidate) => ` ${heard} `.includes(` ${candidate} `))
          .map((candidate) => candidate.length),
        0
      )
    }))
    .filter((match) => match.length > 0)
    .sort((a, b) => b.length - a.length);

  if (phraseMatches.length && phraseMatches[0].length > (phraseMatches[1]?.length ?? 0)) {
    return phraseMatches[0].option;
  }

  const tokens = new Set(heard.split(" "));
  const indexedMatches = options.filter((_, index) =>
    tokens.has(String(index + 1)) ||
    tokens.has(numberWords[index] ?? "") ||
    tokens.has(ordinalWords[index] ?? "")
  );
  return indexedMatches.length === 1 ? indexedMatches[0] : null;
}

function recognitionErrorMessage(error: string) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone access was denied. Allow access in browser settings or use the standard controls.";
  }
  if (error === "no-speech") return "No speech was detected. Try again or use the standard controls.";
  if (error === "audio-capture") return "No working microphone was found. Use the standard controls.";
  return "Speech recognition stopped. Try again or use the standard controls.";
}

export function SpeechChoiceInput({
  id,
  options,
  onChange,
  buttonLabel = "Answer by voice",
  listeningPrompt,
  helpText = "Speak a choice or its number. The matched standard control will be selected; review it before continuing."
}: {
  id: string;
  options: SpeechOption[];
  onChange: (value: string) => void;
  buttonLabel?: string;
  listeningPrompt?: string;
  helpText?: string;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Voice answer is off.");
  const [error, setError] = useState("");
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    const stopCurrentRecognition = () => recognitionRef.current?.stop();
    window.addEventListener(QUESTION_AUDIO_STARTING_EVENT, stopCurrentRecognition);
    window.addEventListener(SPEECH_INPUT_STARTING_EVENT, stopCurrentRecognition);
    return () => {
      window.removeEventListener(QUESTION_AUDIO_STARTING_EVENT, stopCurrentRecognition);
      window.removeEventListener(SPEECH_INPUT_STARTING_EVENT, stopCurrentRecognition);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      recognitionRef.current?.abort();
    };
  }, []);

  function startListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || listening) return;

    stopSpeech();
    window.dispatchEvent(new Event(SPEECH_INPUT_STARTING_EVENT));
    setError("");
    setStatus("Question playback stopped. Starting microphone.");

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = document.documentElement.lang || "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      const match = matchSpokenOption(transcript, options);

      if (match) {
        onChange(match.value);
        setStatus(`Selected ${match.label}. Review the selected control before continuing.`);
      } else {
        setStatus(`Heard “${transcript},” but could not match one choice. Try again or use the standard controls.`);
      }
    };
    recognition.onerror = (event) => {
      const message = recognitionErrorMessage(event.error);
      setError(message);
      setStatus("Voice answer stopped.");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      try {
        recognition.start();
        setListening(true);
        setStatus(
          listeningPrompt ??
            (options.length <= 8
              ? `Listening. Say one choice: ${options.map((option) => option.label).join(", ")}.`
              : "Listening. Speak your answer now.")
        );
      } catch {
        recognitionRef.current = null;
        setListening(false);
        setError("Speech recognition could not start. Try again or use the standard controls.");
      }
    }, 200);
  }

  function stopListening() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    recognitionRef.current?.stop();
    setStatus("Stopping voice answer.");
  }

  return (
    <div className="speech-choice-input" aria-describedby={`${id}-voice-help ${id}-voice-status`}>
      <div className="button-row speech-input-controls">
        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={startListening}
          disabled={supported !== true || listening}
        >
          {buttonLabel}
        </AccessibleButton>
        <AccessibleButton type="button" variant="secondary" onClick={stopListening} disabled={!listening}>
          Stop listening
        </AccessibleButton>
      </div>
      <p id={`${id}-voice-help`} className="help-text">
        {helpText}
      </p>
      <p id={`${id}-voice-status`} className="visible-status" aria-live="polite">
        {supported === false
          ? "Voice answers are not supported in this browser. Use the standard controls or your device’s voice-control feature."
          : status}
      </p>
      {error && <p className="warning" role="alert">{error}</p>}
    </div>
  );
}
