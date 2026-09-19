import { Condition, ImageSet, SequenceGroup } from "@/types/study";

export const AUDIO_SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const CONDITION_LABELS: Record<Condition, string> = {
  baseline: "No order",
  spatial: "Spatial (Depth)",
  semantic: "Semantic order",
  spatial2d: "Spatial (2D)"
};

type LegacyComprehensionSet = Exclude<ImageSet, "preference" | "pilot">;

export const LATIN_SQUARE: Record<SequenceGroup, Record<LegacyComprehensionSet, 0 | 1 | 2>> = {
  A: { set1: 0, set2: 1, set3: 2, set4: 0 },
  B: { set1: 1, set2: 2, set3: 0, set4: 1 },
  C: { set1: 2, set2: 0, set3: 1, set4: 2 }
};

export const STUDY_CONDITIONS: Condition[] = ["baseline", "spatial", "spatial2d"];

export const STORAGE_KEY = "blv-user-study-state-v2";
export const STUDY_SCHEMA_VERSION = 13 as const;
export const CONSENT_VERSION = "2026-08-12";
