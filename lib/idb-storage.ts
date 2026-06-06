/* ============================================================
   AwaAgent — IndexedDB storage adapter for Zustand `persist`.
   Keeps all mutable app state across reloads (real-life behaviour),
   not just an in-memory demo. Safe on the server (no IndexedDB):
   reads return null so SSR falls back to the seeded state.
   ============================================================ */

import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

const hasIDB = () => typeof indexedDB !== "undefined";

export const idbStorage: StateStorage = {
  getItem: async (name) => {
    if (!hasIDB()) return null;
    return (await idbGet<string>(name)) ?? null;
  },
  setItem: async (name, value) => {
    if (!hasIDB()) return;
    await idbSet(name, value);
  },
  removeItem: async (name) => {
    if (!hasIDB()) return;
    await idbDel(name);
  },
};
