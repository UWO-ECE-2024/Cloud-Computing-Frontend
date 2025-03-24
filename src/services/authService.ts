import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { fetcher } from "@/utils/fetcher";

export interface UserRegistrationData {
  username: string;
  displayName: string;
  bio?: string;
}

// Firebase authentication functions
export const registerWithFirebase = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const loginWithEmailPassword = async (
  email: string,
  password: string,
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

export const logoutFirebase = async () => {
  await signOut(auth);
};

// Backend registration
export const registerWithBackend = async (
  idToken: string,
  userData: UserRegistrationData,
) => {
  return await fetcher({
    method: "POST",
    path: "/api/v1/auth/register",
    token: idToken,
    data: userData,
  });
};

// Check if user exists in backend
export const getUserProfile = async (idToken: string) => {
  try {
    const response = await fetcher({
      method: "GET",
      path: "/api/v1/users/me",
      token: idToken,
    });
    return { exists: true, user: response };
  } catch (error) {
    if (
      (error as any).status === 403 &&
      (error as any).info?.error === "registration_required"
    ) {
      return { exists: false, error: "registration_required" };
    }
    throw error;
  }
};
