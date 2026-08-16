import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, initializeFirestore } from "firebase-admin/firestore";

function getFirebasePrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY.");
  }

  return privateKey.replace(/\\n/g, "\n");
}

export function getFirebaseDatabase() {
  const existingApp = getApps()[0];

  if (existingApp) {
    return getFirestore(existingApp);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID.");
  }

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL.");
  }

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: getFirebasePrivateKey()
    })
  });

  initializeFirestore(app, { preferRest: true });

  return getFirestore(app);
}

export function getStudyResultsCollectionName() {
  return process.env.FIRESTORE_COLLECTION || "studyResults";
}
