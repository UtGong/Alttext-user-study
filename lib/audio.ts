export type SpeechVoiceOption = {
  name: string;
  lang: string;
  voiceURI: string;
  label: string;
};

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getAvailableVoices(): SpeechVoiceOption[] {
  if (!isSpeechSupported()) {
    return [];
  }

  return window.speechSynthesis.getVoices().map((voice) => ({
    name: voice.name,
    lang: voice.lang,
    voiceURI: voice.voiceURI,
    label: `${voice.name} (${voice.lang})`
  }));
}

function getSelectedVoice(voiceURI?: string): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) {
    return null;
  }

  if (!voiceURI) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.voiceURI === voiceURI) ?? null;
}

function estimateSpeechDurationMs(text: string, speed: number) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 165 * Math.max(speed, 0.5);
  const estimatedMinutes = wordCount / wordsPerMinute;
  const estimatedMs = estimatedMinutes * 60 * 1000;

  return Math.max(2500, Math.min(estimatedMs + 1200, 120000));
}

export function stopSpeech() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakText({
  text,
  speed,
  voiceURI,
  onStart,
  onEnd,
  onError
}: {
  text: string;
  speed: number;
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}) {
  if (!isSpeechSupported()) {
    onError?.("Speech synthesis is not supported in this browser.");
    onEnd?.();
    return;
  }

  const cleanedText = text.trim();

  if (!cleanedText) {
    onError?.("There is no description text to play.");
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const selectedVoice = getSelectedVoice(voiceURI);

  utterance.rate = speed;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = "en-US";
  }

  let finished = false;

  const fallbackTimer = window.setTimeout(() => {
    if (!finished) {
      finished = true;
      onEnd?.();
    }
  }, estimateSpeechDurationMs(cleanedText, speed));

  utterance.onend = () => {
    if (!finished) {
      finished = true;
      window.clearTimeout(fallbackTimer);
      onEnd?.();
    }
  };

  utterance.onerror = (event) => {
    if (!finished) {
      finished = true;
      window.clearTimeout(fallbackTimer);
      onError?.(`Speech failed: ${event.error}. Try the system default voice or another browser.`);
      onEnd?.();
    }
  };

  try {
    window.speechSynthesis.speak(utterance);

    // Do not wait for browser onstart. Some voices never fire it.
    onStart?.();

    window.setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 50);
  } catch {
    window.clearTimeout(fallbackTimer);
    onError?.("Speech could not be started. Try another voice or browser.");
    onEnd?.();
  }
}