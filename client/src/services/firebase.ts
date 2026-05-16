import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInAnonymously,
  type User 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we have real credentials
const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key-here";

let auth: any;
let googleProvider: any;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase init failed, falling back to mock");
  }
}

// Fallback Mock Auth for development without keys
if (!auth) {
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
      // Simulate no user by default
      setTimeout(() => cb(null), 100);
      return () => {};
    },
    signOut: async () => {
      window.location.reload();
    }
  };
}

export { 
  auth, 
  googleProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInAnonymously
};
export type { User };
