
import { GameConfig, GameState } from '../types';

const DRAFT_KEY = 'impostor_setup_draft';
const SAVED_GAME_KEY = 'impostor_saved_game_v1';
const LAST_IMPOSTOR_KEY = 'impostor_last_meta';

export interface SetupDraft {
  config: GameConfig;
  updatedAt: number;
}

export const getStorage = (isLocal: boolean): Storage => {
  return isLocal ? window.localStorage : window.sessionStorage;
};

export const writeDraft = (config: GameConfig) => {
  try {
    const draft: SetupDraft = { config, updatedAt: Date.now() };
    const storage = getStorage(config.rememberSettings);
    storage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {}
};

export const readDraft = (): SetupDraft | null => {
  try {
    const local = window.localStorage.getItem(DRAFT_KEY);
    if (local) return JSON.parse(local);
    const session = window.sessionStorage.getItem(DRAFT_KEY);
    if (session) return JSON.parse(session);
    return null;
  } catch (e) { return null; }
};

export const saveActiveGame = (state: GameState) => {
  try {
    const payload = {
      ...state,
      lastSavedAt: Date.now()
    };
    localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(payload));
  } catch (e) {}
};

export const loadActiveGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem(SAVED_GAME_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.isCompleted && (Date.now() - parsed.lastSavedAt > 1000 * 60 * 60)) {
       // Si terminó hace más de una hora, no la ofrecemos como reanudable
       return null;
    }
    return parsed;
  } catch (e) { return null; }
};

export const clearActiveGame = () => {
  localStorage.removeItem(SAVED_GAME_KEY);
};

export const clearDraft = () => {
  window.localStorage.removeItem(DRAFT_KEY);
  window.sessionStorage.removeItem(DRAFT_KEY);
};

export interface LastImpostorMeta {
  impostorNames: string[];
  playersSignature: string;
  impostorCount: number;
  updatedAt: number;
}

export const writeLastImpostors = (meta: LastImpostorMeta, isLocal: boolean) => {
  try {
    const storage = getStorage(isLocal);
    storage.setItem(LAST_IMPOSTOR_KEY, JSON.stringify(meta));
  } catch (e) {}
};

export const readLastImpostors = (): LastImpostorMeta | null => {
  try {
    const local = window.localStorage.getItem(LAST_IMPOSTOR_KEY);
    if (local) return JSON.parse(local);
    const session = window.sessionStorage.getItem(LAST_IMPOSTOR_KEY);
    if (session) return JSON.parse(session);
    return null;
  } catch (e) { return null; }
};
