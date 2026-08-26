import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stimuli = JSON.parse(await readFile(new URL("../data/stimuli.json", import.meta.url), "utf8"));
const comprehension = stimuli.filter((item) => item.role === "comprehension");
const preference = stimuli.filter((item) => item.role === "preference");
const pilot = stimuli.filter((item) => item.role === "pilot" && item.imageSet === "pilot");
const reserve = stimuli.filter((item) => item.role === "reserve" && item.imageSet === "pilot");
const activeConditions = ["baseline", "spatial"];

test("the revised stimulus inventory contains 35 role-separated records", () => {
  assert.equal(stimuli.length, 35);
  assert.equal(comprehension.length, 20);
  assert.equal(pilot.length, 10);
  assert.equal(preference.length, 3);
  assert.equal(reserve.length, 2);
});

test("all comprehension stimuli provide the two active descriptions", () => {
  assert.equal(comprehension.length, 20);
  for (const item of comprehension) {
    for (const condition of activeConditions) assert.ok(item.descriptions[condition]?.trim(), `${item.uuid} lacks ${condition}`);
  }
});

test("preference stimuli provide the two active descriptions", () => {
  assert.equal(preference.length, 3);
  for (const item of preference) {
    assert.equal(item.imageSet, "preference");
    assert.deepEqual(item.preferenceConditions, activeConditions);
    for (const condition of activeConditions) assert.ok(item.descriptions[condition]?.trim(), `${item.uuid} lacks ${condition}`);
  }
});

test("the pilot set contains exactly 10 consecutively indexed records", async () => {
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  assert.match(source, /stimulus\.role === "pilot" && stimulus\.imageSet === "pilot"/);
  assert.equal(pilot.length, 10);
  assert.deepEqual(pilot.map((item) => item.pilotIndex).sort((a, b) => a - b), Array.from({ length: 10 }, (_, index) => index + 1));
  for (const item of pilot) {
    for (const condition of activeConditions) assert.ok(item.descriptions[condition]?.trim(), `${item.uuid} lacks ${condition}`);
  }
  assert.doesNotMatch(flow, /descriptions\.(semantic|spatial2d)/);
});

test("the pilot set contains 2 low, 4 medium, and 4 high complexity images", () => {
  const complexityCounts = Object.fromEntries(
    ["low", "medium", "high"].map((level) => [level, pilot.filter((item) => item.complexityLevel === level).length])
  );
  assert.deepEqual(complexityCounts, { low: 2, medium: 4, high: 4 });
  assert.deepEqual(
    reserve.map((item) => item.uuid).sort(),
    ["00209fb1-64a2-4961-9ccc-8c6c06117df2", "c1059816-1dc7-4af1-a5b3-26772de84b08"]
  );
  assert.ok(reserve.every((item) => item.pilotIndex === undefined));
});

test("fixed pilot conditions each contain 1 low, 2 medium, and 2 high complexity images", () => {
  const expectedUuids = {
    baseline: [
      "03da43fa-743f-49d5-92ad-d521accc5759",
      "bf9843af-1922-483f-8b6b-ccfa852de356",
      "c50ee8c2-db92-4e58-a6b8-0243dfe829d8",
      "c77f8b64-98a2-4b3c-b270-1863ece147c5",
      "d25ae4f0-6e09-4ae3-9229-5d45ca3dec56"
    ],
    spatial: [
      "25c98bc8-af28-4194-a056-daeae1f0a001",
      "7ef08b06-e4ff-49e5-8c13-f79dd0b1a872",
      "823405e0-599f-4fd8-ae71-4d901edc36b0",
      "c9c0f26e-a559-43ab-b517-0384e347ade8",
      "d37bc3dc-c3e0-4019-9725-f33404d7d5bc"
    ]
  };

  for (const condition of activeConditions) {
    const group = pilot.filter((item) => item.pilotCondition === condition);
    assert.equal(group.length, 5);
    assert.deepEqual(
      Object.fromEntries(["low", "medium", "high"].map((level) => [level, group.filter((item) => item.complexityLevel === level).length])),
      { low: 1, medium: 2, high: 2 }
    );
    assert.deepEqual(group.map((item) => item.uuid).sort(), expectedUuids[condition]);
  }
});

test("pilot copies use the updated pilot questions", () => {
  const river = pilot.find((item) => item.uuid === "823405e0-599f-4fd8-ae71-4d901edc36b0");
  assert.ok(river);
  assert.ok(river.spatialQuestions.some((q) => q.question === "Were the small boats positioned in front of the bridge?" && q.correctAnswer === "Yes"));
});

test("active pilot question sets contain two intrinsic and two absolute Yes/No questions", () => {
  for (const item of pilot) {
    const questions = item.spatialQuestions ?? [];
    assert.equal(questions.length, 4, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "intrinsic").length, 2, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "absolute").length, 2, item.uuid);
    assert.ok(questions.every((q) => JSON.stringify(q.options) === JSON.stringify(["Yes", "No"])), item.uuid);
    assert.ok(questions.every((q) => q.correctAnswer === "Yes" || q.correctAnswer === "No"), item.uuid);
  }
});

test("the shared image is reserved for the preference task", async () => {
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  const preferenceOnlyUuid = "cd382af4-5334-485a-8121-c52ce7abf13a";
  assert.equal(preference.filter((item) => item.uuid === preferenceOnlyUuid).length, 1);
  assert.equal(pilot.some((item) => item.uuid === preferenceOnlyUuid), false);
  assert.equal(new Set([...pilot, ...preference].map((item) => item.imageFilename)).size, pilot.length + preference.length);
  assert.match(source, /`\$\{stimulus\.role\}:\$\{stimulus\.imageSet\}:\$\{stimulus\.uuid\}`/);
  assert.match(source, /map\(createStimulusTrialId\)/);
  assert.doesNotMatch(source, /find\(\(stimulus\) => stimulus\.uuid ===/);
});

test("main records may omit description metrics without affecting loading", async () => {
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  assert.ok(comprehension.some((item) => item.descriptionMetrics === undefined));
  assert.match(flow, /stimulus\.descriptionMetrics\?\.baseline\?\.spatialExpressionCount \?\? null/);
  assert.match(flow, /const spatialExpressionCount = stimulus\.descriptionMetrics\?\.\[condition\]\?\.spatialExpressionCount \?\? null/);
});

test("all stimuli have complete spatial question sets", () => {
  for (const item of stimuli) assert.equal(item.spatialQuestions?.length, 4, item.uuid);
});

test("participant-facing Likert labels include numeric scale points", async () => {
  const source = await readFile(new URL("../components/LikertScale.tsx", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  assert.match(source, /\{score\}: \{labels\[score - 1\]\}/);
  assert.match(flow, /\["Not at all", "Slightly", "Moderately", "Very", "Extremely well"\]/);
  assert.match(source, /"Not at all"/);
  assert.match(flow, /The description gave me enough information about where things were in the image\./);
  assert.doesNotMatch(flow, /After listening to this description, I feel confident that I understand the artwork\./);
  assert.doesNotMatch(flow, /This description gave me enough information to understand the image\./);
});

test("participant questions provide speech playback controls", async () => {
  const button = await readFile(new URL("../components/QuestionAudioButton.tsx", import.meta.url), "utf8");
  const radio = await readFile(new URL("../components/RadioGroup.tsx", import.meta.url), "utf8");
  const likert = await readFile(new URL("../components/LikertScale.tsx", import.meta.url), "utf8");
  const comprehensionFlow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");

  assert.match(button, /speakText/);
  assert.match(button, /Play question/);
  assert.match(radio, /Answer choices:/);
  assert.match(radio, /QuestionAudioButton/);
  assert.match(likert, /Answer choices:/);
  assert.match(likert, /QuestionAudioButton/);
  assert.match(comprehensionFlow, /recallPrompt[\s\S]*QuestionAudioButton/);
  assert.match(preferenceFlow, /What made the spatial arrangement clearer[\s\S]*QuestionAudioButton/);
});

test("every active trial provides an accessible image show and hide control", async () => {
  const toggle = await readFile(new URL("../components/StimulusImageToggle.tsx", import.meta.url), "utf8");
  const comprehensionFlow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");

  assert.match(toggle, /"Show image"/);
  assert.match(toggle, /"Hide image"/);
  assert.match(toggle, /aria-expanded=\{visible\}/);
  assert.match(toggle, /`\/images\/\$\{encodeURIComponent\(imageFilename\)\}`/);
  assert.match(toggle, /imageUrl\?\.trim\(\)/);
  assert.match(toggle, /The image file is unavailable/);
  assert.match(comprehensionFlow, /<StimulusImageToggle[\s\S]*imageFilename=\{stimulus\.imageFilename\}/);
  assert.match(preferenceFlow, /<StimulusImageToggle[\s\S]*imageFilename=\{stimulus\.imageFilename\}/);
});

test("consent and every answer type support speech interaction", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const choice = await readFile(new URL("../components/SpeechChoiceInput.tsx", import.meta.url), "utf8");
  const radio = await readFile(new URL("../components/RadioGroup.tsx", import.meta.url), "utf8");
  const likert = await readFile(new URL("../components/LikertScale.tsx", import.meta.url), "utf8");
  const preference = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");

  assert.match(app, /Play complete consent form/);
  assert.match(app, /name="consentDecision"/);
  assert.match(app, /Confirm consent decision/);
  assert.match(app, /id="participant-id"[\s\S]*onChange=\{\(participantId\)/);
  assert.match(choice, /window\.SpeechRecognition \|\| window\.webkitSpeechRecognition/);
  assert.match(choice, /Speak a choice or its number/);
  assert.match(choice, /Selected \$\{match\.label\}/);
  assert.match(choice, /review it before continuing/i);
  assert.match(radio, /<SpeechChoiceInput[\s\S]*options=\{options\}/);
  assert.match(likert, /<SpeechChoiceInput[\s\S]*onChange=\{\(nextValue\) => onChange\(Number\(nextValue\)\)\}/);
  assert.match(preference, /name="preferred-description"/);
  assert.match(preference, /<RadioGroup/);
});

test("revised participant-facing study questions are present", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const comprehensionFlow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const player = await readFile(new URL("../components/AudioDescriptionPlayer.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(app, /BLV Image Description Study|Accessible User Study Interface/);
  assert.doesNotMatch(comprehensionFlow, /In 1-2 sentences, what was the main focus of the scene\?/);
  assert.match(comprehensionFlow, /Mention what you remember, including the people or objects present/);
  assert.match(comprehensionFlow, /\["Not sure"\]/);
  assert.doesNotMatch(preferenceFlow, /Question 1: Best description|Which description helped you understand the image best/);
  assert.match(preferenceFlow, /Which description communicates the spatial arrangement more clearly\?/);
  assert.match(preferenceFlow, /label: "No preference"/);
  assert.match(preferenceFlow, /preferenceChoice === "none" \? "No preference"/);
  assert.doesNotMatch(player, /You may play and replay this description as many times as needed/);
  assert.match(app, /<h2>Final Questions<\/h2>/);
  assert.match(app, /clear mental map of a scene right away/);
  assert.match(app, /mentally tiring or overwhelming/);
  assert.match(app, /most important rule you would recommend/);
});

test("uncertain spatial answers are recorded but excluded from accuracy scoring", async () => {
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const scoring = await readFile(new URL("../lib/scoring.ts", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");

  assert.match(flow, /const isUncertain = answer === "Not sure"/);
  assert.match(flow, /isCorrect: q\.correctAnswer && !isUncertain \? answer === q\.correctAnswer : null/);
  assert.match(scoring, /answer\.correctAnswer !== null && !answer\.isUncertain/);
  assert.match(scoring, /frameOfReference === "intrinsic"/);
  assert.match(scoring, /frameOfReference === "absolute"/);
  assert.match(flow, /spatialAccuracyProportion: accuracy\.overall\.proportion/);
  assert.match(types, /isUncertain: boolean/);
});

test("all participant answers are retained in the Firestore payload and exports", async () => {
  const route = await readFile(new URL("../app/api/save-result/route.ts", import.meta.url), "utf8");
  const save = await readFile(new URL("../lib/saveResult.ts", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const exportSource = await readFile(new URL("../lib/export.ts", import.meta.url), "utf8");

  assert.match(save, /body: JSON\.stringify\(state\)/);
  assert.match(route, /const resultToSave = \{[\s\S]*\.\.\.body/);
  assert.match(route, /\.set\(resultToSave\)/);
  assert.match(flow, /freeRecall,[\s\S]*spatialAnswers: answers/);
  assert.match(flow, /participantId:[\s\S]*sessionId:[\s\S]*trialId/);
  assert.match(flow, /role:[\s\S]*pilotIndex:[\s\S]*condition/);
  assert.match(flow, /baselineSpatialExpressionCount[\s\S]*spatialKendallTau/);
  assert.match(flow, /eventSequence: current\.length \+ 1/);
  assert.match(flow, /ratings: \{ overallSceneClarity:[\s\S]*spatialRelationsConfidence:[\s\S]*contentComprehension:/);
  assert.match(flow, /workload: \{ mentalDemand:[\s\S]*frustration:/);
  assert.doesNotMatch(flow, /effort:/);
  assert.match(preferenceFlow, /ranking,[\s\S]*explanation/);
  assert.match(preferenceFlow, /preferenceChoice,[\s\S]*preferredCondition/);
  assert.match(app, /interviewResponses: questions\.map[\s\S]*questionId:[\s\S]*question:[\s\S]*answer:/);
  assert.match(app, /practiceResponse: practiceResponse\.trim\(\)/);
  assert.match(flow, /freeRecallQuestion: recallPrompt/);
  assert.match(flow, /ratingQuestions[\s\S]*workloadQuestions/);
  assert.match(preferenceFlow, /rankingQuestion,[\s\S]*explanationQuestion/);
  assert.match(exportSource, /spatialAnswersJson: response\.spatialAnswers/);
  assert.match(exportSource, /explanation: response\.explanation/);
  assert.match(exportSource, /answer: response\.answer/);
});

test("open-ended answers support editable live transcription", async () => {
  const input = await readFile(new URL("../components/SpeechAnswerInput.tsx", import.meta.url), "utf8");
  const comprehensionFlow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");

  assert.match(input, /window\.SpeechRecognition \|\| window\.webkitSpeechRecognition/);
  assert.match(input, /stopSpeech\(\)/);
  assert.match(input, /SPEECH_INPUT_STARTING_EVENT/);
  assert.match(input, /Start speaking/);
  assert.match(input, /Stop transcription/);
  assert.match(input, /Review and edit the transcript before continuing/);
  assert.match(input, /not microphone audio/);
  assert.match(input, /Live transcription is not supported in this browser/);
  assert.doesNotMatch(comprehensionFlow, /id="gist-answer"/);
  assert.match(comprehensionFlow, /<SpeechAnswerInput id="free-recall"/);
  assert.match(preferenceFlow, /<SpeechAnswerInput[\s\S]*id="ranking-explanation"/);
  assert.match(app, /id="practice-response"[\s\S]*onChange=\{setPracticeResponse\}/);
  assert.match(app, /interviewResponses: questions\.map/);
});

test("speech-input consent and schema include final interview transcripts", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const config = await readFile(new URL("../lib/config.ts", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/save-result/route.ts", import.meta.url), "utf8");
  const exportSource = await readFile(new URL("../lib/export.ts", import.meta.url), "utf8");

  assert.match(app, /optional live speech recognition/);
  assert.match(app, /speech[\s\S]*service may process the audio/);
  assert.match(config, /STUDY_SCHEMA_VERSION = 11/);
  assert.match(types, /schemaVersion: 11/);
  assert.match(types, /interviewResponses: InterviewResponse\[\]/);
  assert.match(route, /interviewAnswerCount/);
  assert.match(exportSource, /exportInterviewCsv/);
  assert.match(exportSource, /exportInterviewCsv\(state\)/);
});

test("pilot condition assignments are fixed across sequence groups", async () => {
  const config = await readFile(new URL("../lib/config.ts", import.meta.url), "utf8");
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");

  assert.doesNotMatch(config, /PILOT_LATIN_SQUARE/);
  assert.match(source, /return stimulus\.pilotCondition/);
  assert.doesNotMatch(source, /stimulus\.pilotIndex! % 2/);
  assert.ok(pilot.every((item) => activeConditions.includes(item.pilotCondition)));
});

test("preference flow uses record conditions, ignores spatial questions, and logs randomized mappings", async () => {
  const source = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const stimuliSource = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  assert.match(source, /shuffle\(getPreferenceConditions\(stimulus\)\)/);
  assert.match(stimuliSource, /stimulus\.preferenceConditions \?\? \[\]/);
  assert.match(source, /randomizedOrder,/);
  assert.match(source, /condition: item\.condition/);
  assert.match(source, /preferredCondition/);
  assert.match(source, /\["A", "B"\]/);
  assert.doesNotMatch(source, /"C"|"D"/);
  assert.doesNotMatch(source, /spatialQuestions/);
  assert.doesNotMatch(source, /descriptions\.(semantic|spatial2d)/);
  assert.doesNotMatch(source, /Text of Description|description-text-block/);
});

test("preference descriptions use one heading and a flat audio layout", async () => {
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const player = await readFile(new URL("../components/AudioDescriptionPlayer.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(preferenceFlow, /className="preference-description-card"/);
  assert.match(preferenceFlow, /<AudioDescriptionPlayer[\s\S]*embedded/);
  assert.match(player, /!embedded &&/);
  assert.equal((css.match(/\.question-card\s*\{/g) ?? []).length, 1);
  assert.equal((css.match(/\.audio-card\s*\{/g) ?? []).length, 1);
});

test("the only study flow combines pilot comprehension followed by preference", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");

  assert.match(types, /StudyMode = "pilot-preference"/);
  assert.match(app, /studyMode: "pilot-preference"/);
  assert.doesNotMatch(app, /Researcher study mode|Main comprehension \(20 images\)|Preference comparison \(3 images\)/);
  assert.match(source, /stimulus\.role === "comprehension"/);
  assert.match(source, /getComprehensionStimuli\(\): Stimulus\[\] \{[\s\S]*return pilotComprehensionStimuli/);
  assert.match(flow, /preferenceStimuli\.length \? "preference" : "interview"/);
  assert.match(app, /Study task: Pilot comprehension and preference/);
});

test("exports include randomized order and verbal and internal Likert values", async () => {
  const source = await readFile(new URL("../lib/export.ts", import.meta.url), "utf8");
  assert.match(source, /randomizedOrderJson/);
  assert.match(source, /overallSceneClarityLabel/);
  assert.match(source, /overallSceneClarity\?\.value/);
  assert.match(source, /spatialAccuracyScore/);
  assert.match(source, /spatialEligibleQuestionCount/);
  assert.match(source, /intrinsicAccuracyProportion/);
  assert.match(source, /absoluteAccuracyProportion/);
  assert.match(source, /baselineSpatialExpressionCount/);
  assert.match(source, /spatialSpatialExpressionCount/);
  assert.match(source, /spatialKendallTau/);
  assert.match(source, /"spatialExpressionCount"/);
  assert.match(source, /spatialExpressionCount: response\.spatialExpressionCount/);
  assert.match(source, /"complexityScore"/);
  assert.match(source, /complexityScore: response\.complexityScore/);
  assert.match(source, /descriptionACondition/);
  assert.match(source, /playbackEventsJson/);
});

test("analysis surfaces description metrics at aggregate and participant levels", async () => {
  const analysis = await readFile(new URL("../lib/analysis.ts", import.meta.url), "utf8");
  const dashboard = await readFile(new URL("../components/AnalysisDashboard.tsx", import.meta.url), "utf8");

  assert.match(analysis, /baselineSpatialExpressionCount: NumericSummary/);
  assert.match(analysis, /presentedSpatialExpressionCount: NumericSummary/);
  assert.match(analysis, /spatialKendallTau: NumericSummary/);
  assert.match(analysis, /presentedKendallTau: NumericSummary/);
  assert.match(analysis, /trialMetrics: TrialMetricSummary\[\]/);
  assert.match(analysis, /current-schema-v11-description-metrics/);
  assert.match(dashboard, /Description metrics by condition/);
  assert.match(dashboard, /Baseline spatial expressions/);
  assert.match(dashboard, /Spatial-order Kendall’s τ/);
  assert.match(dashboard, /Trial-level description metrics/);
  assert.match(dashboard, /Mean spatial expressions/);
});

test("expected speech interruptions do not display playback errors", async () => {
  const source = await readFile(new URL("../lib/audio.ts", import.meta.url), "utf8");
  assert.match(source, /event\.error === "interrupted" \|\| event\.error === "canceled"/);
  const interruptionGuard = source.indexOf('event.error === "interrupted"');
  const visibleError = source.indexOf("onError?.(`Speech failed:");
  assert.ok(interruptionGuard > -1 && interruptionGuard < visibleError);
});

test("comprehension audio remains available with only one replay", async () => {
  const player = await readFile(new URL("../components/AudioDescriptionPlayer.tsx", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  assert.match(player, /onClick=\{\(\) => play\(false\)\} disabled=\{playedOnce\}/);
  assert.match(flow, /maxReplays=\{1\}/);
  assert.doesNotMatch(flow, /step === "audio" && <><AudioDescriptionPlayer/);
});

test("test mode can generate mock records and jump to the save page", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const mock = await readFile(new URL("../lib/mockStudyData.ts", import.meta.url), "utf8");
  assert.match(app, /Generate mock data and go to save page/);
  assert.match(app, /updateState\(createMockStudyData\(state\)\)/);
  assert.match(mock, /phase: "complete", testMode: true/);
  assert.match(mock, /activeComprehensionStimuli\.map/);
  assert.match(mock, /preferenceStimuli\.map/);
});

test("study requires recorded consent before participant setup and saving", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/save-result/route.ts", import.meta.url), "utf8");

  assert.match(types, /\| "consent"/);
  assert.match(types, /acceptedAt: string/);
  assert.match(app, /Consent to Participate/);
  assert.match(app, /Participation is voluntary/);
  assert.match(app, /You may stop immediately if you feel uncomfortable/);
  assert.match(app, /phase: "setup",[\s\S]*accepted: true/);
  assert.match(route, /A valid consent record is required before saving study data/);
});
