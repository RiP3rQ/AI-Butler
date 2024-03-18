// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ai-butler-d8f86.firebaseapp.com",
  projectId: "ai-butler-d8f86",
  storageBucket: "ai-butler-d8f86.appspot.com",
  messagingSenderId: "219472343675",
  appId: "1:219472343675:web:d5acab56c9d392a4b0e8de",
  measurementId: "G-9EZ6GLXLRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase storage
export const storage = getStorage(app);

export async function uploadFileToFirebase(image_url: string, name: string) {
  try {
    const response = await fetch(image_url);
    const buffer = await response.arrayBuffer();
    const file_name = name.replace(" ", "") + Date.now + ".jpeg";
    const storageRef = ref(storage, file_name);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg"
    });
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(error);
  }
}