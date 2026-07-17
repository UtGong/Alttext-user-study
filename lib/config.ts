import { Condition, ImageSet, SequenceGroup } from "@/types/study";

export const AUDIO_SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const CONDITION_LABELS: Record<Condition, string> = {
  baseline: "Baseline",
  spatial: "Spatial ordering",
  semantic: "Semantic ordering"
};

export const LATIN_SQUARE: Record<SequenceGroup, Record<ImageSet, Condition>> = {
  A: { set1: "baseline", set2: "spatial", set3: "semantic" },
  B: { set1: "spatial", set2: "semantic", set3: "baseline" },
  C: { set1: "semantic", set2: "baseline", set3: "spatial" }
};

export const STORAGE_KEY = "blv-user-study-state-v1";
export const STUDY_SCHEMA_VERSION = 2 as const;
