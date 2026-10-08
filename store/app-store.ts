"use client";

import { create } from "zustand";
import type { Inspection, Property } from "@/lib/types";

interface AppState {
  properties: Property[];
  inspections: Inspection[];
}

/** Transient cache of responses from the backend. */
export const useAppStore = create<AppState>()(() => ({
  properties: [],
  inspections: [],
}));
