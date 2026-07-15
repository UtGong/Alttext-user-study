"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
import { AUDIO_SPEED_OPTIONS, STORAGE_KEY } from "@/lib/config";
import {