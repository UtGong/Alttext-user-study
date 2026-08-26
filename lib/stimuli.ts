import rawStimuli from "@/data/stimuli.json";
import { LATIN_SQUARE, PILOT_LATIN_SQUARE } from "@/lib/config";
import { Condition, SequenceGroup, Stimulus } from "@/types/study";

export const stimuli = rawStimuli as Stimulus[];

export const mainComprehensionStimuli = stimuli
  .filter((stimulus) => stimulus.role === "comprehension")
  .sort((a, b) => a.rowIndex - b.rowIndex);

export const pilotComprehensionStimuli = stimuli
  .filter((stimulus) => stimulus.role === "pilot" && stimulus.imageSet === "pilot")
  .sort((a, b) => (a.pilotIndex ?? Number.MAX_SAFE_INTEGER) - (b.pilotIndex ?? Number.MAX_SAFE_INTEGER));

export const preferenceStimuli = stimuli
  .filter((stimulus) => stimulus.role === "preference" && stimulus.imageSet === "preference");

export function createStimulusTrialId(stimulus: Stimulus): string {
  const base = `${stimulus.role}:${stimulus.imageSet}:${stimulus.uuid}`;
  return stimulus.role === "pilot" ? `${base}:pilot-${stimulus.pilotIndex}` : base;
}

export function getComprehensionStimuli(): Stimulus[] {
  return pilotComprehensionStimuli;
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
  const conditions = stimulus.preferenceConditions ?? [];

  if (
    stimulus.role !== "preference" ||
    stimulus.imageSet !== "preference" ||
    conditions.length !== 2 ||
    new Set(conditions).size !== 2 ||
    conditions.some((condition) => condition !== "baseline" && condition !== "spatial")
  ) {
    throw new Error(`Preference stimulus ${createStimulusTrialId(stimulus)} has invalid preferenceConditions.`);
  }

  return [...conditions];
}

export function getConditionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): Condition {
  if (stimulus.imageSet === "preference") {
    throw new Error("Preference stimuli do not have an assigned comprehension condition.");
  }

  if (stimulus.imageSet === "pilot") {
    if (!Number.isInteger(stimulus.pilotIndex)) {
      throw new Error(`Pilot stimulus ${stimulus.uuid} is missing a valid pilotIndex.`);
    }

    const parity = stimulus.pilotIndex! % 2 === 1 ? "odd" : "even";
    return PILOT_LATIN_SQUARE[sequenceGroup][parity];
  }

  return LATIN_SQUARE[sequenceGroup][stimulus.imageSet];
}

export function getDescriptionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): string {
  const condition = getConditionForStimulus(sequenceGroup, stimulus);
  return stimulus.descriptions[condition];
}
