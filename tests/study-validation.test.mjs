import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stimuli = JSON.parse(await readFile(new URL("../data/stimuli.json", import.meta.url), "utf8"));
const stimulusReview = JSON.parse(await readFile(new URL("../data/stimulusReview.json", import.meta.url), "utf8"));
const comprehension = stimuli.filter((item) => item.role === "comprehension");
const preference = stimuli.filter((item) => item.role === "preference");
const activeConditions = ["baseline", "spatial", "semantic", "spatial2d"];
const excludedUuids = new Set([
  "046abaf4-34ce-435d-baa3-a064e826ea63",
  "0dde1c3c-6c08-431d-85e2-7288c2c93f26",
  "73069488-cbc0-412b-a9fd-8094e24e2915",
  "1bfc4f01-042a-4ece-8e47-134a96e99fac",
  "243000de-3236-4cca-b4d5-6f4fe08b5ad7",
  "1740093e-a916-4cd2-b8ab-0b1d2fc1c9f4",
  "80b8e427-1f2c-4614-8fab-dce270763fc8",
  "7583412c-fee6-496a-b316-467f8a495a40",
  "8175e345-711c-463c-9192-9814abaac5b6",
  "bf9843af-1922-483f-8b6b-ccfa852de356",
  "08ce53a5-b87a-42e8-b7c2-c3dd21d05845",
  "25c98bc8-af28-4194-a056-daeae1f0a001"
]);

test("the study inventory contains 20 comprehension and 4 preference records", () => {
  assert.equal(stimuli.length, 24);
  assert.equal(comprehension.length, 20);
  assert.equal(preference.length, 4);
  assert.equal(new Set(stimuli.map((item) => item.uuid)).size, 24);
  assert.ok(stimuli.every((item) => !excludedUuids.has(item.uuid)));
  assert.ok(stimulusReview.rejected.every((item) => !stimuli.some((stimulus) => stimulus.uuid === item.uuid)));
});

test("all selected stimuli satisfy the description metrics and item-set rules", () => {
  const normalize = (word) => word.toLowerCase().replace(/[^a-z]/g, "").replace(/ies$/, "y").replace(/s$/, "");
  for (const item of stimuli) {
    const canonicalIds = [...item.generationMetadata.baseline.orderedIds].sort();
    for (const condition of activeConditions) {
      assert.ok(item.descriptions[condition]?.trim(), `${item.uuid} lacks ${condition}`);
      const metric = item.descriptionMetrics[condition];
      assert.ok(metric.spatialExpressionCount >= 3 && metric.spatialExpressionCount <= 7, `${item.uuid} ${condition} expression count`);
      if (condition !== "baseline") assert.ok(metric.kendallTau > 0.3, `${item.uuid} ${condition} tau`);
      assert.deepEqual([...item.generationMetadata[condition].orderedIds].sort(), canonicalIds, `${item.uuid} ${condition} item set`);
      const descriptionWords = new Set(item.descriptions[condition].split(/\s+/).map(normalize));
      for (const orderedItem of item.generationMetadata[condition].orderedItems) {
        const head = normalize(orderedItem.trim().split(/\s+/).at(-1));
        if (head !== "another") assert.ok(descriptionWords.has(head), `${item.uuid} ${condition} omits ${orderedItem}`);
      }
    }
  }
});

test("preference records expose all four conditions for session-level pairing", () => {
  for (const item of preference) {
    assert.equal(item.imageSet, "preference");
    assert.deepEqual(item.preferenceConditions, activeConditions);
  }
});

test("the researcher catalog shows every stimulus and spreadsheet-backed complexity", async () => {
  const catalog = await readFile(new URL("../app/stimuli/page.tsx", import.meta.url), "utf8");
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  assert.ok(stimuli.every((item) => item.complexitySource?.spreadsheetId === "1_OxnFR1GNHQGsg-k4A-Rgt4rKc-Vljjay0wFSStx2Dk"));
  assert.deepEqual(Object.fromEntries(["low", "medium", "high"].map((level) => [level, stimuli.filter((item) => item.complexityLevel === level).length])), { low: 9, medium: 7, high: 8 });
  assert.match(catalog, /Study Stimulus Catalog/);
  assert.match(catalog, /STUDY_CONDITIONS\.map/);
  assert.match(catalog, /Kendall&apost;s τ|Kendall&apos;s τ/);
  assert.match(catalog, /Rejected images/);
  assert.match(catalog, /Potential replacement images/);
  assert.equal(stimulusReview.rejected.length, 5);
  assert.ok(stimulusReview.potential.length >= 3);
  assert.match(app, /href="\/stimuli"/);
});

test("drafted spatial questions remain verbatim and new stimuli keep questions blank", () => {
  const newlySelected = new Set([
    "bfd3764c-8711-4b04-9f02-ed6b07995d40",
    "c5f5cfa6-6150-435a-bf5d-a0a7a55c52f7",
    "c986c2b3-cb9f-4c57-a888-217eedc8330a",
    "ce4d7f93-8bcf-4f88-a9c1-bea5c5a9b425",
    "1a761edd-c52e-47c0-b422-df074e14c803"
  ]);
  for (const item of comprehension) {
    const questions = item.spatialQuestions ?? [];
    if (newlySelected.has(item.uuid)) {
      assert.deepEqual(questions, [], item.uuid);
      continue;
    }
    assert.equal(questions.length, 4, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "intrinsic").length, 2, item.uuid);
    assert.equal(questions.filter((q) => q.frameOfReference === "absolute").length, 2, item.uuid);
    assert.ok(questions.every((q) => JSON.stringify(q.options) === JSON.stringify(["Yes", "No"])), item.uuid);
    assert.ok(questions.every((q) => q.correctAnswer === "Yes" || q.correctAnswer === "No"), item.uuid);
  }
  const byUuid = Object.fromEntries(comprehension.map((item) => [item.uuid, item]));
  assert.equal(byUuid["03da43fa-743f-49d5-92ad-d521accc5759"].spatialQuestions[0].question, "Was the nude woman positioned to the right of the standing man? ");
  assert.equal(byUuid["d24bdec0-5069-4768-96bd-583ca9629c0f"].spatialQuestions[0].question, "Were the dark green trees positioned to the left of the ruined building?");
  assert.equal(byUuid["17b4aa42-79e9-4356-8231-9299f1c3a279"].spatialQuestions[1].question, "Was the young man holding a fish in his right hand?");
});

test("comprehension and preference images are disjoint", async () => {
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  assert.equal(new Set(stimuli.map((item) => item.imageFilename)).size, stimuli.length);
  assert.match(source, /`\$\{stimulus\.role\}:\$\{stimulus\.imageSet\}:\$\{stimulus\.uuid\}`/);
  assert.match(source, /map\(createStimulusTrialId\)/);
  assert.doesNotMatch(source, /find\(\(stimulus\) => stimulus\.uuid ===/);
});

test("description metrics are available for every presented condition", async () => {
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  assert.ok(stimuli.every((item) => activeConditions.every((condition) => item.descriptionMetrics?.[condition])));
  assert.match(flow, /stimulus\.descriptionMetrics\?\.baseline\?\.spatialExpressionCount \?\? null/);
  assert.match(flow, /const spatialExpressionCount = stimulus\.descriptionMetrics\?\.\[condition\]\?\.spatialExpressionCount \?\? null/);
});

test("preference stimuli do not require comprehension questions", () => {
  assert.ok(preference.every((item) => Array.isArray(item.spatialQuestions)));
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
  assert.match(config, /STUDY_SCHEMA_VERSION = 13/);
  assert.match(types, /schemaVersion: 13/);
  assert.match(types, /interviewResponses: InterviewResponse\[\]/);
  assert.match(route, /interviewAnswerCount/);
  assert.match(exportSource, /exportInterviewCsv/);
  assert.match(exportSource, /exportInterviewCsv\(state\)/);
});

test("three fixed conditions are counterbalanced across sequence groups", async () => {
  const config = await readFile(new URL("../lib/config.ts", import.meta.url), "utf8");
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");

  assert.match(config, /A: \{ set1: 0, set2: 1, set3: 2, set4: 0 \}/);
  assert.match(config, /B: \{ set1: 1, set2: 2, set3: 0, set4: 1 \}/);
  assert.match(config, /C: \{ set1: 2, set2: 0, set3: 1, set4: 2 \}/);
  assert.match(config, /STUDY_CONDITIONS(?:: Condition\[\])? = \["baseline", "spatial", "spatial2d"\]/);
  assert.match(source, /STUDY_CONDITIONS\[LATIN_SQUARE/);
  assert.deepEqual(Object.fromEntries(["set1", "set2", "set3", "set4"].map((set) => [set, comprehension.filter((item) => item.imageSet === set).length])), { set1: 5, set2: 5, set3: 5, set4: 5 });
});

test("preference flow uses all fixed conditions and logs randomized mappings", async () => {
  const source = await readFile(new URL("../components/study/PreferenceFlow.tsx", import.meta.url), "utf8");
  const stimuliSource = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  assert.match(source, /shuffle\(getPreferenceConditions\(stimulus\)\)/);
  assert.match(stimuliSource, /return \[\.\.\.STUDY_CONDITIONS\]/);
  assert.match(source, /randomizedOrder,/);
  assert.match(source, /condition: item\.condition/);
  assert.match(source, /preferredCondition/);
  assert.match(source, /\["A", "B", "C"\]/);
  assert.doesNotMatch(source, /"D"/);
  assert.doesNotMatch(source, /spatialQuestions/);
  assert.match(source, /stimulus\.descriptions\[condition\]/);
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

test("the study runs every active comprehension trial followed by 4 preference trials", async () => {
  const app = await readFile(new URL("../components/study/StudyApp.tsx", import.meta.url), "utf8");
  const flow = await readFile(new URL("../components/study/ComprehensionFlow.tsx", import.meta.url), "utf8");
  const source = await readFile(new URL("../lib/stimuli.ts", import.meta.url), "utf8");
  const types = await readFile(new URL("../types/study.ts", import.meta.url), "utf8");

  assert.match(types, /StudyMode = "full-study"/);
  assert.match(app, /studyMode: "full-study"/);
  assert.doesNotMatch(app, /Conditions for this session/);
  assert.match(app, /\["A", "B", "C"\]/);
  assert.match(source, /stimulus\.role === "comprehension"/);
  assert.match(source, /getComprehensionStimuli\(\): Stimulus\[\] \{[\s\S]*return mainComprehensionStimuli/);
  assert.match(flow, /preferenceStimuli\.length \? "preference" : "interview"/);
  assert.match(app, /Study task: \{mainComprehensionStimuli\.length\} comprehension trials and \{preferenceStimuli\.length\} preference trials/);
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
  assert.match(source, /descriptionCCondition/);
  assert.match(source, /rankingThird/);
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
  assert.match(analysis, /current-schema-v13-three-condition-within-session/);
  assert.match(dashboard, /Description metrics by condition/);
  assert.match(dashboard, /Baseline spatial expressions/);
  assert.match(dashboard, /Spatial-order Kendall’s τ/);
  assert.match(dashboard, /Trial-level description metrics/);
  assert.match(dashboard, /Mean spatial expressions/);
  assert.match(analysis, /bySpatialExpressionCount/);
  assert.match(dashboard, /Relationship analysis/);
  assert.match(dashboard, /Spatial expressions and accuracy/);
  assert.match(dashboard, /Spatial expressions and experience ratings/);
  assert.match(dashboard, /Spatial expressions and workload/);
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
  assert.match(flow, /step === "audio" && <>[\s\S]*<AudioDescriptionPlayer/);
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
