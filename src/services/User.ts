import { ref, set, get, update } from "firebase/database";
import { db } from "./firebase";

export async function saveUserProfile(uid: string, profile: any) {
  await set(ref(db, `users/${uid}/profile`), profile);
}

export async function getUserProfile(uid: string) {
  const snapshot = await get(ref(db, `users/${uid}/profile`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function saveRecommendation(uid: string, recommendation: any) {
  const recRef = ref(db, `users/${uid}/recommendations/${Date.now()}`);
  await set(recRef, recommendation);
}
