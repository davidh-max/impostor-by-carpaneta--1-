import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type GameWritePayload = {
  players: string[];
  playersNormalized: string[];
  secretWord: string;
  impostorIds: string[];
  impostorCount: number;
  category: string;
  discussionMinutes: number;
  impostorHintEnabled: boolean;
  hintWord?: string;
  appVersion?: string;
  userAgent?: string;
};

export function normalizePlayerName(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "anon";
}

export async function registerPlayersOnce(names: string[]): Promise<void> {
  const uniqueNormalized = new Map<string, string>();
  for (const name of names) {
    const norm = normalizePlayerName(name);
    if (!uniqueNormalized.has(norm)) uniqueNormalized.set(norm, name);
  }

  await Promise.all(
    Array.from(uniqueNormalized.entries()).map(async ([normalized, original]) => {
      try {
        await setDoc(
          doc(db, "jugadores", normalized),
          {
            nameOriginal: original,
            nameNormalized: normalized,
            createdAt: serverTimestamp(),
          },
          { merge: false }
        );
      } catch (error: any) {
        const code = error?.code || "";
        if (code === "permission-denied" || code === "already-exists") return;
        console.warn("registerPlayersOnce error (ignorado):", error);
      }
    })
  );
}

export async function writeGameToFirestore(payload: GameWritePayload): Promise<void> {
  try {
    await addDoc(collection(db, "partidas"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("writeGameToFirestore error (ignorado):", error);
  }
}

