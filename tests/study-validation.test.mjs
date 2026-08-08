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
  assert.ok(comprehension.some((item) => !item.spatialQuestions?.length));
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

test("participant-facing Likert labels contain no numeric prefixes", async () => {
  const source = await readFile(new URL("../components/LikertScale.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\{score\}\s*\.|`\$\{score\}/);
  assert.match(source, /Neither agree nor disagree/);
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
