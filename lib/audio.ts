export type SpeechVoiceOption = {
  name: string;
  lang: string;
  voiceURI: string;
  label: string;
};

export function getAvailableVoices(): SpeechVoiceOption[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices().map((voice) => ({
    name: voice.name,
    lang: voice.lang,
    voiceURI: voice.voiceURI,
    label: `${voice.name} (${voice.lang})`
  }));
}

export function getPreferredVoice(voiceURI?: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();

  if (voiceURI) {
    const selected = voices.find((voice) => voice.voiceURI === voiceURI);
    if (selected) return selected;
  }

  const preferredEnglishVoice =
    voices.find((voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("natural")) ||
    voices.find((voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("google")) ||
    voices.find((voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("microsoft")) ||
    voices.find((voice) => voice.lang.startsWith("en"));

  return preferredEnglishVoice ?? voices[0] ?? null;
}

export function speakText(
  text: string,
  speed: number,
  voiceURI?: string,
  onEnd?: () => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speed;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = getPreferredVoice(voiceURI);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}