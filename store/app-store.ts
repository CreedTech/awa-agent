"use client";

import { create } from "zustand";
import type { Inspection } from "@/lib/types";

interface AppState {
  inspections: Inspection[];
}

/** Transient cache of responses from the backend. */
export const useAppStore = create<AppState>()(() => ({
  inspections: [],
}));
