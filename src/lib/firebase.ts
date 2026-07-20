import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let auth: any = null;
let db: any = null;
let isFirebaseAvailable = false;

export function disableFirebase() {
  if (isFirebaseAvailable) {
    isFirebaseAvailable = false;
    console.warn("Firebase services disabled. Falling back to LocalStorage simulation.");
  }
}

try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn("Client is offline (navigator.onLine is false). Initializing directly in LocalStorage simulation mode.");
    } else {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = (firebaseConfig as any).firestoreDatabaseId 
        ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
        : getFirestore(app);
      isFirebaseAvailable = true;
      console.log("Firebase initialized successfully with project ID:", firebaseConfig.projectId);
    }
  } else {
    console.warn("Firebase configuration values are missing in firebase-applet-config.json. Fallback to LocalStorage simulation active.");
  }
} catch (error) {
  console.warn("Firebase initialization error, entering offline/localStorage simulation mode.", error);
}

export { auth, db, isFirebaseAvailable };

// Global listener to suppress and handle Firestore offline unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || '';
    if (msg.includes('offline') || msg.includes('Failed to get document') || msg.includes('Firestore') || msg.includes('FIRESTORE')) {
      isFirebaseAvailable = false;
      console.warn("Caught and suppressed Firestore connection/offline unhandled rejection:", msg);
      event.preventDefault();
    }
  });
}

// Validate connection to Firestore
if (isFirebaseAvailable && db) {
  getDocFromServer(doc(db, 'test', 'connection')).then(() => {
    console.log("Firestore validation ping completed. Ready for operations.");
  }).catch((error) => {
    isFirebaseAvailable = false;
    console.warn("Please check your Firebase configuration. The client appears to be offline or unreachable. Fallback to LocalStorage simulation active.", error?.message || error);
  });
}
