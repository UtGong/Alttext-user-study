# BLV User Study Interface

This is a Next.js + TypeScript prototype for a blind and low vision user study comparing two image-description ordering conditions:

1. No order: no explicit ordering constraint
2. Spatial (Depth): front-to-background ordering

The interface is designed to be screen-reader accessible, keyboard-first, audio-first, and easy for researchers to run locally.

## Features

- Participant setup
- One combined pilot-comprehension and preference workflow
- Researcher sequence group metadata: A or B; it does not alter the fixed pilot conditions
- Audio speed selection before the real study
- Practice trial with speed confirmation
- 10 pilot comprehension trials followed by 3 preference trials
- A Show image/Hide image control on every pilot and preference trial
- Play/replay only during real trials
- No pause or speed adjustment during real trials
- Replay count logging
- Free recall response collection
- Optional live speech-to-text for open-ended responses, with editable transcripts
- Spatial relation questions
- Verbal Likert ratings with stable 1–5 analysis values
- Mental demand and frustration ratings after each image
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
- no-order and spatial-depth descriptions used by the interface
- target elements
- spatial questions
- optional description metrics
- role-specific fields such as `pilotIndex` or `preferenceConditions`

The revised file contains 20 retained main comprehension records, 13 active pilot records, and
3 active preference records. The main records and their drafted questions remain in the JSON for
future use but are not offered as a study mode. Records are addressed by a composite trial ID
built from role, image set, UUID, and pilot index where applicable; repeated UUIDs across roles
are preserved.

The interface currently uses browser text-to-speech for the descriptions. When real audio files are available, add audio file paths to the `audio` object for each condition and update `AudioDescriptionPlayer` to use native audio playback instead of `speechSynthesis`.

Image controls resolve each `imageFilename` under `public/images/`. Place the selected image
files there with their exact JSON filenames. An optional future `imageUrl` value overrides the
local path. Images are hidden by default, and missing files produce a participant-facing error.

Open-ended answer fields also offer optional browser speech recognition. Starting speech input stops text-to-speech playback, requests microphone access, and inserts recognized text into the editable answer field. The website does not retain microphone audio. Browser speech-recognition support varies, so typing and operating-system dictation remain available fallbacks.

## Fixed pilot condition groups

The active comprehension task uses 10 records labeled `pilot`, divided into two fixed groups.
Each group contains one low-, two medium-, and two high-complexity images. Five records use the
`baseline` description (No order), and five use the `spatial` description (Spatial (Depth)). The
assignment is stored in each record's `pilotCondition` and does not reverse between researcher
sequence groups A and B.

The three preference trials follow the pilot comprehension trials automatically. Each record
supplies its two active conditions through `preferenceConditions`; their A/B labels are randomized
without revealing condition names.

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
- Every spatial question includes Yes, No, and Not sure. Not sure is stored as uncertain and is excluded from accuracy scoring.
- Experience ratings separately measure overall scene clarity, spatial-relationship confidence, and content comprehension.
- Mental demand and frustration are collected after each image for condition-by-condition comparison.
- In preference trials, descriptions A and B can be replayed without a limit. Both must be played before a preference is saved.
- Preference responses are Description A, Description B, or No preference.
- The preference explanation is required and stored with playback events and replay counts.

## Data storage

The full study state is autosaved in the browser and submitted to Firestore at completion.
Version 10 records identify the combined workflow and include session and composite trial IDs,
role and pilot metadata, exact presented text, optional description metrics, ordered playback
events, overall and intrinsic/absolute accuracy, response timing, workload responses, and complete
preference mappings. Each pilot trial records `spatialExpressionCount` as the canonical count for
the description actually presented.
Description metrics are exported as study metadata and are never shown to participants.

The home page also contains a researcher-only data viewer. Set a strong, private
`RESEARCHER_ACCESS_KEY` environment variable on the server and enter that same key in the
researcher panel to fetch all Firestore records. Do not expose this value through a
`NEXT_PUBLIC_` environment variable.

Researchers fetch protected records from the home page and are then routed to `/analysis`,
where they can select which participant records to include. The dashboard summarizes spatial accuracy,
uncertainty, experience ratings, workload, timing, replays, preferences, complexity, frame of
reference, and object focus. It also provides downloads for the raw records and computed
analysis as JSON. Free-recall and interview text remains available for manual qualitative coding.

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
2. The 13 active pilot stimuli are final; the 20 inactive main records remain intact for future use.
3. The 3 preference stimuli and their `preferenceConditions` are final.
4. The text-to-speech voice is acceptable, or replace TTS with recorded audio files.
5. Exported JSON/CSV contains the fields needed for analysis.
6. The interface has been tested with keyboard only and at least one screen reader.
