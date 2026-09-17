import rawStimuli from "@/data/stimuli.json";
import { LATIN_SQUARE } from "@/lib/config";
import { Condition, ImageSet, SequenceGroup, Stimulus } from "@/types/study";

export const stimuli = rawStimuli as Stimulus[];

export const mainComprehensionStimuli = stimuli
  .filter((stimulus) => stimulus.role === "comprehension")
  .sort((a, b) => a.rowIndex - b.rowIndex);

export const preferenceStimuli = stimuli
  .filter((stimulus) => stimulus.role === "preference" && stimulus.imageSet === "preference");

export function createStimulusTrialId(stimulus: Stimulus): string {
  const base = `${stimulus.role}:${stimulus.imageSet}:${stimulus.uuid}`;
  return stimulus.role === "pilot" ? `${base}:pilot-${stimulus.pilotIndex}` : base;
}

export function getComprehensionStimuli(): Stimulus[] {
  return mainComprehensionStimuli;
}

export function createRandomizedComprehensionOrder(): string[] {
  const order = getComprehensionStimuli().map(createStimulusTrialId);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }

  return order;
}

export function getComprehensionStimulus(
  order: string[],
  index: number
): Stimulus {
  const activeStimuli = getComprehensionStimuli();
  const trialId = order[index];
  return (
    activeStimuli.find((stimulus) => createStimulusTrialId(stimulus) === trialId) ??
    activeStimuli[index]
  );
}

export function getPreferenceConditions(stimulus: Stimulus, selectedConditions: Condition[]): Condition[] {
  const conditions = selectedConditions;

  if (
    stimulus.role !== "preference" ||
    stimulus.imageSet !== "preference" ||
    conditions.length !== 2 ||
    new Set(conditions).size !== 2 ||
    conditions.some((condition) => !(["baseline", "spatial", "semantic", "spatial2d"] as Condition[]).includes(condition))
  ) {
    throw new Error(`Preference stimulus ${createStimulusTrialId(stimulus)} has invalid preferenceConditions.`);
  }

  return [...conditions];
}

export function getConditionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus, selectedConditions: Condition[]): Condition {
  if (stimulus.imageSet === "preference") {
    throw new Error("Preference stimuli do not have an assigned comprehension condition.");
  }

  if (selectedConditions.length !== 2 || new Set(selectedConditions).size !== 2) {
    throw new Error("Exactly two distinct study conditions must be selected.");
  }
  return selectedConditions[LATIN_SQUARE[sequenceGroup][stimulus.imageSet as Exclude<ImageSet, "preference" | "pilot">]];
}

export function getDescriptionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus, selectedConditions: Condition[]): string {
  const condition = getConditionForStimulus(sequenceGroup, stimulus, selectedConditions);
  return stimulus.descriptions[condition];
}
