import rawStimuli from "@/data/stimuli.json";
import { LATIN_SQUARE } from "@/lib/config";
import { Condition, SequenceGroup, Stimulus } from "@/types/study";

export const stimuli = rawStimuli as Stimulus[];

export const comprehensionStimuli = stimuli
  .filter((stimulus) => stimulus.role === "comprehension")
  .slice(0, 15);

export const preferenceStimuli = stimuli
  .filter((stimulus) => stimulus.role === "preference" || stimulus.role === "reserve")
  .slice(0, 3);

export function createRandomizedComprehensionOrder(): string[] {
  const order = comprehensionStimuli.map((stimulus) => stimulus.uuid);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }

  return order;
}

export function getComprehensionStimulus(order: string[], index: number): Stimulus {
  const uuid = order[index];
  return (
    comprehensionStimuli.find((stimulus) => stimulus.uuid === uuid) ??
    comprehensionStimuli[index]
  );
}

export function getConditionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): Condition {
  return LATIN_SQUARE[sequenceGroup][stimulus.imageSet];
}

export function getDescriptionForStimulus(sequenceGroup: SequenceGroup, stimulus: Stimulus): string {
  const condition = getConditionForStimulus(sequenceGroup, stimulus);
  return stimulus.descriptions[condition];
}
