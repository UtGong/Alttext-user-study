import { Condition, ImageSet, SequenceGroup } from "@/types/study";

export const AUDIO_SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const CONDITION_LABELS: Record<Condition, string> = {
  baseline: "No order",
  spatial: "Spatial (Depth)"
};

export const LATIN_SQUARE: Record<SequenceGroup, Record<Exclude<ImageSet, "preference">, Condition>> = {
  A: { set1: "baseline", set2: "spatial", set3: "baseline", set4: "spatial" },
  B: { set1: "spatial", set2: "baseline", set3: "spatial", set4: "baseline" }
};

export const STUDY_CONDITIONS: Condition[] = ["baseline", "spatial"];

export const STORAGE_KEY = "blv-user-study-state-v1";
export const STUDY_SCHEMA_VERSION = 7 as const;
export const CONSENT_VERSION = "2026-08-12";
