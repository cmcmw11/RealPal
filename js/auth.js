// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { uploadProfile } from "./storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD16O71K0Erz47p2bqj4bcR2CaffMcJ7KU",
  authDomain: "realpal-eadb5.firebaseapp.com",
  projectId: "realpal-eadb5",
  storageBucket: "realpal-eadb5.firebasestorage.app",
  messagingSenderId: "755055085773",
  appId: "1:755055085773:web:b980a014130aca8da2c184",
  measurementId: "G-CEWMNPW3DL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Signup user
 * @param {Object} userData {realName,birthday,email,password,avatar,avatarName,friendQuestion,profileFile}
 */
export async function signupUser(userData){
  try {
    const {realName,birthday,email,password,avatar,avatarName,friendQuestion,profileFile} = userData;

    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    const uid = userCredential.user.uid;

    // อัปโหลดรูปโปรไฟล์จริง
    const profileURL = await uploadProfile(uid, profileFile);

    await setDoc(doc(db,"users",uid),{
      realName,birthday,email,
      avatar, avatarName,
      profile: profileURL,
      friendQuestion,
      createdAt: new Date()
    });
    return uid;
  } catch(err){
    throw err;
  }
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 */
export async function loginUser(email,password){
  const userCredential = await signInWithEmailAndPassword(auth,email,password);
  const uid = userCredential.user.uid;

  const userDoc = await getDoc(doc(db,"users",uid));
  if(!userDoc.exists()) throw new Error("ไม่พบข้อมูลผู้ใช้");

  const data = userDoc.data();
  // เก็บ session
  localStorage.setItem("currentUserId", uid);
  localStorage.setItem("realName", data.realName);
  localStorage.setItem("avatar", data.avatar);
  localStorage.setItem("friendQuestion", data.friendQuestion);

  return uid;
}

/**
 * Logout user
 */
export async function logoutUser(){
  await signOut(auth);
  localStorage.clear();
}

/**
 * Reset password
 * @param {string} email 
 */
export async function resetPassword(email){
  await sendPasswordResetEmail(auth,email);
}
