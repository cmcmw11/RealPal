// js/chat.js
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const currentUserId = localStorage.getItem("currentUserId");
const avatar = localStorage.getItem("avatar");

/**
 * ส่งข้อความใน chat
 * @param {string} chatId - ID ของห้องแชท
 * @param {string} text - ข้อความ
 */
export async function sendMessage(chatId, text){
  await addDoc(collection(db,"chats",chatId,"messages"),{
    senderId: currentUserId,
    avatar,
    text,
    createdAt: Timestamp.now()
  });
}

/**
 * ฟังข้อความใหม่แบบ real-time
 * @param {string} chatId
 * @param {function} callback(data)
 */
export function listenMessages(chatId, callback){
  const q = query(collection(db,"chats",chatId,"messages"), orderBy("createdAt","asc"));
  onSnapshot(q, snapshot=>{
    const messages = snapshot.docs.map(d=>d.data());
    callback(messages);
  });
}

/**
 * เริ่ม call (voice/video) – ใช้ WebRTC / External API ต่อได้
 * @param {string} peerId
 * @param {string} type "voice"|"video"
 */
export function startCall(peerId,type="voice"){
  console.log(`เริ่ม${type} call กับ ${peerId}`);
  // TODO: เชื่อม WebRTC หรือ API โทร
}

/**
 * รับสาย call – placeholder
 */
export function receiveCall(callback){
  // TODO: ฟังสัญญาณ incoming call แล้ว callback
}
