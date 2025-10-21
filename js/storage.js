// js/storage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

const storage = getStorage();

/**
 * อัปโหลดรูปโปรไฟล์
 * @param {string} uid 
 * @param {File} file 
 * @returns {Promise<string>} URL
 */
export async function uploadProfile(uid,file){
  const storageRef = ref(storage, `profiles/${uid}_${file.name}`);
  await uploadBytes(storageRef,file);
  return await getDownloadURL(storageRef);
}

/**
 * อัปโหลดรูปโพสต์
 * @param {string} uid 
 * @param {File} file 
 * @returns {Promise<string>} URL
 */
export async function uploadPostImage(uid,file){
  const storageRef = ref(storage, `posts/${uid}_${Date.now()}_${file.name}`);
  await uploadBytes(storageRef,file);
  return await getDownloadURL(storageRef);
}
