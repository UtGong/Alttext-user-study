# BLV User Study Interface

This is a Next.js + TypeScript prototype for a blind and low vision user study comparing three image-description ordering conditions:

1. Baseline: no explicit ordering constraint
2. Spatial ordering: front-to-background ordering
3. Semantic ordering: ordering based on semantic relationships

The interface is designed to be screen-reader accessible, keyboard-first, audio-first, and easy for researchers to run locally.

## Features

- Participant setup
- Researcher sequence group selection: A, B, or C
- Audio speed selection before the real study
- Practice trial with speed confirmation
- 15 comprehension trials
- Play/replay only during real trials
- No pause or speed adjustment during real trials
- Replay count logging
- Free recall response collection
- Spatial relation questions
- Semantic gist answer
- 1–5 Likert ratings
- Per-image workload ratings for condition-by-condition comparison
- Optional preference trials
- Final interview notes
- JSON export
- Comprehension CSV export
- Local autosave through `localStorage`
- Persistent randomized comprehension-image order
- Firebase schema versioning and response summaries

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Project structure

```text
blv-user-study-next/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AccessibleButton.tsx
│   ├── AudioDescriptionPlayer.tsx
│   ├── LikertScale.tsx
│   ├── ProgressIndicator.tsx
│   └── RadioGroup.tsx
├── data/
│   └── stimuli.json
├── lib/
│   ├── audio.ts
│   ├── config.ts
│   ├── export.ts
│   └── stimuli.ts
├── types/
│   └── study.ts
├── README.md
└── RESEARCHER_CHECKLIST.md
```

## Stimulus data

Stimuli are stored in:

```text
data/stimuli.json
```

Each stimulus includes:

- row index
- image UUID
- complexity level
- image set
- baseline, spatial, and semantic descriptions
- target elements
- spatial questions
- gist question

The interface currently uses browser text-to-speech for the descriptions. When real audio files are available, add audio file paths to the `audio` object for each condition and update `AudioDescriptionPlayer` to use native audio playback instead of `speechSynthesis`.

## Counterbalancing

The study uses three sequence groups:

| Group | Set 1 | Set 2 | Set 3 |
|---|---|---|---|
| A | Baseline | Spatial | Semantic |
| B | Spatial | Semantic | Baseline |
| C | Semantic | Baseline | Spatial |

Researchers select the sequence group on the participant setup page.

## Audio behavior

Before the real study, participants select their preferred speed:

- 0.75x
- 1.0x
- 1.25x
- 1.5x
- 1.75x
- 2.0x

During real trials:

- Participants can play the description.
- Participants can replay the description.
- Participants cannot pause.
- Participants cannot change speed.
- The Next button is disabled until the description has been played at least once.
- Replay count is logged.

## Updated study procedure

- Comprehension image order is randomized once per participant and persisted so a resumed session keeps the same order.
- Spatial questions 1 to 3 include Yes, No, and Not sure.
- Spatial questions 4 to 6 use Yes and No responses.
- Section 8 separately measures overall scene clarity, spatial-relationship confidence, and content comprehension.
- A mental-demand workload rating is collected after every image and exported with condition, complexity, and randomized display position.
- In preference trials, descriptions A, B, and C can be replayed without a limit. All three must be played before a ranking is saved.
- The ranking explanation is required and stored with playback events and replay counts.

## Data storage

The full study state is autosaved in the browser and submitted to Firestore at completion. Version 2 records include `schemaVersion`, `comprehensionOrder`, per-trial `randomizedDisplayPosition`, revised Section 8 rating fields, per-image workload, preference playback events, replay counts, ranking, and ranking explanation. CSV exports provide condition-level workload rows and the revised rating constructs.

## Accessibility design notes

The interface intentionally uses native controls:

- `button`
- `input`
- `textarea`
- `fieldset`
- `legend`
- radio groups

The UI avoids drag-and-drop, hover-only interaction, hidden custom widgets, and mouse-only flows.

## Researcher notes

Before running a real study, manually verify:

1. Spatial questions are correct for each image.
2. The selected 15 comprehension stimuli are final.
3. The 3 preference stimuli are final.
4. The text-to-speech voice is acceptable, or replace TTS with recorded audio files.
5. Exported JSON/CSV contains the fields needed for analysis.
6. The interface has been tested with keyboard only and at least one screen reader.
