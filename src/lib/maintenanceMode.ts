import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const REF = doc(db, "settings", "maintenance")

export async function getMaintenanceMode(): Promise<boolean> {
  try {
    const snap = await getDoc(REF)
    if (!snap.exists()) return false
    return snap.data().enabled === true
  } catch {
    return false
  }
}

export async function setMaintenanceMode(enabled: boolean): Promise<void> {
  await setDoc(REF, { enabled }, { merge: true })
}