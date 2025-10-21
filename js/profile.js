// js/profile.js
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { uploadProfile } from "./storage.js";

const db = getFirestore();
const currentUserId = localStorage.getItem("currentUserId");

/**
 * โหลดข้อมูลผู้ใช้
 */
export async function loadProfile(userId=currentUserId){
  const userDoc = await getDoc(doc(db,"users",userId));
  if(!userDoc.exists()) throw new Error("ไม่พบผู้ใช้");
  return userDoc.data();
}

/**
 * แก้ไขโปรไฟล์จริง / Avatar
 * @param {Object} updates {realName, avatarName, profileFile, avatar}
 */
export async function updateProfile(updates){
  const dataToUpdate = {};
  if(updates.realName) dataToUpdate.realName = updates.realName;
  if(updates.avatarName) dataToUpdate.avatarName = updates.avatarName;
  if(updates.avatar) dataToUpdate.avatar = updates.avatar;

  if(updates.profileFile){
    const profileURL = await uploadProfile(currentUserId, updates.profileFile);
    dataToUpdate.profile = profileURL;
  }

  await updateDoc(doc(db,"users",currentUserId), dataToUpdate);
}

/**
 * เพิ่มเพื่อนด้วยการตอบคำถาม
 * @param {string} friendId
 * @param {string} answer
 */
export async function addFriend(friendId, answer){
  const friendDoc = await getDoc(doc(db,"users",friendId));
  if(!friendDoc.exists()) throw new Error("ไม่พบผู้ใช้");

  const question = friendDoc.data().friendQuestion;
  if(answer !== question) throw new Error("คำตอบไม่ถูกต้อง");

  // เพิ่มเพื่อน
  await updateDoc(doc(db,"users",currentUserId), {
    friends: arrayUnion(friendId)
  });

  await updateDoc(doc(db,"users",friendId), {
    friends: arrayUnion(currentUserId)
  });
}

/**
 * โหลดเพื่อนของผู้ใช้
 */
export async function loadFriends(){
  const userDoc = await getDoc(doc(db,"users",currentUserId));
  const data = userDoc.data();
  return data.friends || [];
}
