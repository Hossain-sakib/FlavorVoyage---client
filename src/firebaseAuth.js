import { initializeApp } from "@firebase/app";
import {
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  initializeAuth,
  inMemoryPersistence,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
// Firebase web configuration is public. The server independently verifies ID tokens.
const app = initializeApp({
  apiKey: "AIzaSyAcXtiyt0UY4ih5BW0GZHleYvDyhSwV5KQ",
  authDomain: "flavour-voyage.firebaseapp.com",
  projectId: "flavour-voyage",
  appId: "1:849707833576:web:91bee47960e3d289aad15d",
});
const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const messages = {
  "auth/popup-closed-by-user":
    "Google sign-in was canceled. You can try again or use email and password.",
  "auth/cancelled-popup-request":
    "Another Google sign-in window is already open. Please finish it first.",
  "auth/popup-blocked":
    "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
  "auth/unauthorized-domain":
    "Google sign-in is not enabled for this website address yet. Please use email and password for now.",
  "auth/operation-not-allowed":
    "Google sign-in is not enabled yet. Please use email and password for now.",
  "auth/network-request-failed":
    "Could not connect to Google. Check your connection and try again.",
  "auth/account-exists-with-different-credential":
    "This email uses another sign-in method. Sign in with that method first.",
};
export async function getGoogleIdentityToken() {
  try {
    const result = await signInWithPopup(auth, provider);
    return await result.user.getIdToken();
  } catch (error) {
    throw new Error(
      messages[error.code] ||
        "Google sign-in could not be completed. Please try again.",
    );
  } finally {
    await signOut(auth).catch(() => {});
  }
}
