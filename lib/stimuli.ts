import rawStimuli from "@/data/stimuli.json";
import { LATIN_SQUARE, STUDY_CONDITIONS } from "@/lib/config";
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

export function getPreferenceConditions(stimulus: Stimulus): Condition[] {
  if (
    stimulus.role !== "preference" ||
    stimulus.imageSet !== "preference"
  ) {
    throw new Error(`Preference stimulus ${createStimulusTrialId(stimulus)} has invalid preferenceConditions.`);
  }

  return [...STUDY_CONDITIONS];
}

export function getConditionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): Condition {
  if (stimulus.imageSet === "preference") {
    throw new Error("Preference stimuli do not have an assigned comprehension condition.");
  }

  return STUDY_CONDITIONS[LATIN_SQUARE[sequenceGroup][stimulus.imageSet as Exclude<ImageSet, "preference" | "pilot">]];
}

export function getDescriptionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): string {
  const condition = getConditionForStimulus(sequenceGroup, stimulus);
  return stimulus.descriptions[condition];
}
