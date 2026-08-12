import { Condition, ImageSet, SequenceGroup } from "@/types/study";

export const AUDIO_SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const CONDITION_LABELS: Record<Condition, string> = {
  baseline: "Baseline",
  spatial: "Spatial ordering",
  semantic: "Semantic ordering",
  spatial2d: "Spatial 2D ordering"
};

export const LATIN_SQUARE: Record<SequenceGroup, Record<Exclude<ImageSet, "preference">, Condition>> = {
  A: { set1: "baseline", set2: "spatial", set3: "semantic", set4: "spatial2d" },
  B: { set1: "spatial", set2: "spatial2d", set3: "baseline", set4: "semantic" },
  C: { set1: "semantic", set2: "baseline", set3: "spatial2d", set4: "spatial" },
  D: { set1: "spatial2d", set2: "semantic", set3: "spatial", set4: "baseline" }
};

export const STORAGE_KEY = "blv-user-study-state-v1";
export const STUDY_SCHEMA_VERSION = 6 as const;
export const CONSENT_VERSION = "2026-08-12";
