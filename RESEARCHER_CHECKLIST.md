# Researcher Checklist

## Before each participant

- Open the study interface in a supported browser.
- Confirm the participant ID format.
- Assign sequence group A or B.
- Confirm audio output device and volume.
- Confirm microphone input and speech-to-text support if the participant wants to speak answers.
- Ask participant to select audio speed.
- Run the practice trial.
- Confirm whether the selected speed is comfortable.
- Confirm that the randomized image order is recorded in the saved study state.

## During the study

- Do not reveal condition names to participants.
- Comprehension images appear in a randomized order for each participant.
- After each image, collect mental demand and frustration ratings.
- During preference trials, let the participant play and replay descriptions A and B freely.
- Confirm that both descriptions were played before the participant submits a preference.
- After each preference, ask the participant to explain the reason for their choice.
- Do not help answer comprehension questions.
- Record any accessibility issues or confusion.
- Ask participants to review speech-to-text answers before continuing; use headphones to prevent question audio from reaching the microphone.
- If the participant asks to stop, stop the session.

## After the study

- Complete final interview notes.
- Export JSON.
- Export CSV.
- Verify the workload CSV contains one row per image with mental demand, frustration, condition, and display position.
- Verify preference exports contain randomized order, preferred condition, ranking explanations, and playback events.
- Verify exported files are saved.
- Clear session before the next participant.

## Accessibility QA before deployment

- Keyboard-only navigation.
- NVDA + Chrome.
- VoiceOver + Safari.
- Live transcription in the supported study browser, including denied microphone permission and unsupported-browser fallbacks.
- Browser zoom at 200%.
- High contrast mode.
- No mouse.
