import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stimuli = JSON.parse(await readFile(new URL("../data/stimuli.json", import.meta.url), "utf8"));
const comprehension = stimuli.filter((item) => item.role === "comprehension");
const preference = stimuli.filter((item) => item.role === "preference");
const conditions = ["baseline", "spatial", "semantic", "spatial2d"];

test("all 20 comprehension stimuli provide four non-empty descriptions", () => {
  assert.equal(comprehension.length, 20);
  for (const item of comprehension) {
    for (const condition of conditions) assert.ok(item.descriptions[condition]?.trim(), `${item.uuid} lacks ${condition}`);
  }
});

test("preference stimuli provide all four descriptions", () => {
  assert.ok(preference.length > 0);
  for (const item of preference) assert.deepEqual(Object.keys(item.descriptions).sort(), [...conditions].sort());
});

test("spatial question sets are either omitted or four scorable questions", () => {
  for (const item of comprehension) {
    const questions = item.spatialQuestions ?? [];
    if (!questions.length) continue;
    assert.equal(questions.length, 4, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "intrinsic").length, 2, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "absolute").length, 2, item.uuid);
    assert.ok(questions.every((q) => q.correctAnswer && q.options.includes(q.correctAnswer)), item.uuid);
    const perfectScore = questions.filter((q) => q.correctAnswer === q.correctAnswer).length;
    assert.equal(perfectScore, 4);
  }
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
  assert.match(comprehensionFlow, /gistPrompt[\s\S]*QuestionAudioButton/);
  assert.match(preferenceFlow, /Why did you choose this ranking\?[\s\S]*QuestionAudioButton/);
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
  assert.match(preference, /Rank by voice/);
  assert.match(preference, /parseSpokenRanking/);
});

test("revised participant-facing study questions are present", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const comprehensionFlow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const preferenceFlow = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const player = await readFile(new URL("../components/AudioDescriptionPlayer.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(app, /BLV Image Description Study|Accessible User Study Interface/);
  assert.match(comprehensionFlow, /In 1-2 sentences, what was the main focus of the scene\?/);
  assert.match(comprehensionFlow, /Mention what you remember, including the people or objects present/);
  assert.match(comprehensionFlow, /\["Not sure"\]/);
  assert.doesNotMatch(preferenceFlow, /Question 1: Best description|Which description helped you understand the image best/);
  assert.match(preferenceFlow, /const bestChoice = ranking\.first/);
  assert.doesNotMatch(player, /You may play and replay this description as many times as needed/);
  assert.match(app, /<h2>Final Questions<\/h2>/);
  assert.match(app, /clear mental map of a scene right away/);
  assert.match(app, /mentally tiring or overwhelming/);
  assert.match(app, /most important rule you would recommend/);
});

test("uncertain spatial answers are recorded but excluded from accuracy scoring", async () => {
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");

  assert.match(flow, /const isUncertain = answer === "Not sure"/);
  assert.match(flow, /isCorrect: q\.correctAnswer && !isUncertain \? answer === q\.correctAnswer : null/);
  assert.match(flow, /answer\.correctAnswer !== null && !answer\.isUncertain/);
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
  assert.match(flow, /gistAnswer,[\s\S]*freeRecall,[\s\S]*spatialAnswers: answers/);
  assert.match(flow, /ratings: \{ overallSceneClarity:[\s\S]*spatialRelationsConfidence:[\s\S]*contentComprehension:/);
  assert.match(flow, /workload: \{ mentalDemand:[\s\S]*effort:[\s\S]*frustration:/);
  assert.match(preferenceFlow, /ranking,[\s\S]*explanation/);
  assert.match(app, /interviewResponses: questions\.map[\s\S]*questionId:[\s\S]*question:[\s\S]*answer:/);
  assert.match(app, /practiceResponse: practiceResponse\.trim\(\)/);
  assert.match(flow, /gistQuestion: gistPrompt[\s\S]*freeRecallQuestion: recallPrompt/);
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
  assert.match(comprehensionFlow, /<SpeechAnswerInput id="gist-answer"/);
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
  assert.match(config, /STUDY_SCHEMA_VERSION = 6/);
  assert.match(types, /schemaVersion: 6/);
  assert.match(types, /interviewResponses: InterviewResponse\[\]/);
  assert.match(route, /interviewAnswerCount/);
  assert.match(exportSource, /exportInterviewCsv/);
  assert.match(exportSource, /exportInterviewCsv\(state\)/);
});

test("preference flow randomizes and records four conditions", async () => {
  const source = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  assert.match(source, /shuffle\(\["baseline", "spatial", "semantic", "spatial2d"\]\)/);
  assert.match(source, /randomizedOrder,/);
  assert.match(source, /preferredCondition:/);
  assert.match(source, /\["A", "B", "C", "D"\]/);
  assert.doesNotMatch(source, /Text of Description|description-text-block/);
});

test("exports include randomized order and verbal and internal Likert values", async () => {
  const source = await readFile(new URL("../lib/export.ts", import.meta.url), "utf8");
  assert.match(source, /randomizedOrderJson/);
  assert.match(source, /overallSceneClarityLabel/);
  assert.match(source, /overallSceneClarity\?\.value/);
  assert.match(source, /spatialAccuracyScore/);
  assert.match(source, /spatialEligibleQuestionCount/);
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
  assert.match(mock, /comprehensionStimuli\.map/);
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
