"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import {
  QUESTION_AUDIO_STARTING_EVENT,
  SPEECH_INPUT_STARTING_EVENT,
  stopSpeech
} from "@/lib/audio";

type RecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type RecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<RecognitionResultLike>;
};

type RecognitionErrorEventLike = {
  error: string;
};

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: RecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type RecognitionConstructor = new () => RecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

type SpeechAnswerInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
};

function joinTranscript(existing: string, addition: string) {
  return [existing.trim(), addition.trim()].filter(Boolean).join(" ");
}

function recognitionErrorMessage(error: string) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone or speech-recognition access was denied. Allow access in browser settings, or type the answer.";
    case "audio-capture":
      return "No working microphone was found. Check the audio input, or type the answer.";
    case "network":
      return "The browser's speech-recognition service could not be reached. Check the connection, or type the answer.";
    case "no-speech":
      return "No speech was detected. Select Start speaking and try again, or type the answer.";
    default:
      return `Speech recognition stopped because of a ${error} error. You can try again or type the answer.`;
  }
}

export function SpeechAnswerInput({
  id,
  value,
  onChange,
  rows = 5,
  required = false
}: SpeechAnswerInputProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Speech input is off.");
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const startTimerRef = useRef<number | null>(null);
  const baseTextRef = useRef("");
  const finalTranscriptRef = useRef("");
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const errorRef = useRef("");

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    const stopForQuestionPlayback = () => {
      if (recognitionRef.current) {
        setStatus("Stopping the current speech input.");
        recognitionRef.current.stop();
      }
    };

    window.addEventListener(QUESTION_AUDIO_STARTING_EVENT, stopForQuestionPlayback);
    window.addEventListener(SPEECH_INPUT_STARTING_EVENT, stopForQuestionPlayback);

    return () => {
      window.removeEventListener(QUESTION_AUDIO_STARTING_EVENT, stopForQuestionPlayback);
      window.removeEventListener(SPEECH_INPUT_STARTING_EVENT, stopForQuestionPlayback);
      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, []);

  function startListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition || listening) return;

    stopSpeech();
    window.dispatchEvent(new Event(SPEECH_INPUT_STARTING_EVENT));
    setErrorMessage("");
    errorRef.current = "";
    setStatus("Question playback stopped. Starting microphone.");

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    baseTextRef.current = valueRef.current;
    finalTranscriptRef.current = "";

    recognition.onresult = (event) => {
      let finalAddition = "";
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalAddition = joinTranscript(finalAddition, transcript);
        } else {
          interimTranscript = joinTranscript(interimTranscript, transcript);
        }
      }

      if (finalAddition) {
        finalTranscriptRef.current = joinTranscript(finalTranscriptRef.current, finalAddition);
      }

      const recognizedText = joinTranscript(finalTranscriptRef.current, interimTranscript);
      onChangeRef.current(joinTranscript(baseTextRef.current, recognizedText));
      setStatus(interimTranscript ? "Listening and transcribing." : "Listening. Recognized text was added to the answer.");
    };

    recognition.onerror = (event) => {
      const message = recognitionErrorMessage(event.error);
      errorRef.current = message;
      setErrorMessage(message);
      setStatus("Speech input stopped.");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      onChangeRef.current(joinTranscript(baseTextRef.current, finalTranscriptRef.current));

      if (!errorRef.current) {
        setStatus(
          finalTranscriptRef.current
            ? "Speech input stopped. Review the transcript before continuing."
            : "Speech input stopped. No final speech was added."
        );
      }
    };

    startTimerRef.current = window.setTimeout(() => {
      startTimerRef.current = null;

      try {
        recognition.start();
        setListening(true);
        setStatus("Listening. Speak your answer now.");
      } catch {
        recognitionRef.current = null;
        setListening(false);
        const message = "Speech recognition could not start. Try again, check microphone permissions, or type the answer.";
        errorRef.current = message;
        setErrorMessage(message);
        setStatus("Speech input could not start.");
      }
    }, 200);
  }

  function stopListening() {
    if (startTimerRef.current !== null) {
      window.clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }

    setStatus("Stopping speech input.");
    recognitionRef.current?.stop();
  }

  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    baseTextRef.current = event.target.value;
    finalTranscriptRef.current = "";

    if (listening) {
      recognitionRef.current?.stop();
    }

    onChange(event.target.value);
  }

  const helpId = `${id}-speech-help`;
  const statusId = `${id}-speech-status`;

  return (
    <div className="speech-answer-input">
      <textarea
        id={id}
        required={required}
        rows={rows}
        value={value}
        onChange={changeText}
        aria-describedby={`${helpId} ${statusId}`}
      />

      <div className="button-row speech-input-controls">
        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={startListening}
          disabled={supported !== true || listening}
        >
          Start speaking
        </AccessibleButton>
        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={stopListening}
          disabled={!listening}
        >
          Stop transcription
        </AccessibleButton>
      </div>

      <p id={helpId} className="help-text">
        Starting speech input stops question playback to prevent it from entering your answer.
        Review and edit the transcript before continuing. This website stores the resulting text,
        not microphone audio; the browser&apos;s speech service may process the audio.
      </p>
      <p id={statusId} className="visible-status" aria-live="polite">
        {supported === false
          ? "Live transcription is not supported in this browser. Type here or use your device's dictation feature."
          : status}
      </p>
      {errorMessage && (
        <p className="warning" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
