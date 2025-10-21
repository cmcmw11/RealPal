// js/feed.js
import { getFirestore, collection, addDoc, query, orderBy, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { uploadPostImage } from "./storage.js";

const db = getFirestore();

const currentUserId = localStorage.getItem("currentUserId");
const avatar = localStorage.getItem("avatar");
const realName = localStorage.getItem("realName");

/**
 * ตรวจสอบว่าผู้ใช้โพสต์รูปครบ 2 ครั้งแล้ววันนี้หรือยัง
 * @param {Array} posts
 * @returns {boolean}
 */
export function canPostImage(posts){
  const today = new Date().toISOString().slice(0,10);
  const count = posts.filter(p => p.userId===currentUserId && p.imageUrl && p.createdAt.toDate().toISOString().slice(0,10)===today).length;
  return count < 2;
}

/**
 * สร้างโพสต์ใหม่
 * @param {string} content 
 * @param {File|null} imageFile 
 * @param {string} visibility "public"|"friends"
 */
export async function createPost(content,imageFile,visibility){
  let imageUrl = null;

  // ตรวจสอบ limit 2 รูปต่อวัน
  if(imageFile){
    const postsSnapshot = await getDocs(collection(db,"posts"));
    const posts = postsSnapshot.docs.map(d => ({...d.data(), id:d.id}));
    if(!canPostImage(posts)) throw new Error("โพสต์รูปวันนี้ครบ 2 ครั้งแล้ว");
    imageUrl = await uploadPostImage(currentUserId,imageFile);
  }

  await addDoc(collection(db,"posts"),{
    userId: currentUserId,
    content,
    imageUrl,
    visibility,
    createdAt: Timestamp.now(),
    likes: [],
    comments: []
  });
}

/**
 * โหลด feed
 */
export async function loadFeed(){
  const feedDiv = document.getElementById("feed");
  feedDiv.innerHTML="";

  const q = query(collection(db,"posts"), orderBy("createdAt","desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap=>{
    const data = docSnap.data();
    // แสดงเฉพาะโพสต์ public หรือโพสต์ของตัวเอง
    if(data.visibility==="public" || data.userId===currentUserId){
      const postEl = document.createElement("div");
      postEl.className="feed-card";
      postEl.innerHTML=`
        <div><img class="avatar" src="${data.avatar||avatar}" alt="avatar">
        <span class="author">${realName}</span></div>
        <p>${data.content||""}</p>
        ${data.imageUrl?`<img class="post-img" src="${data.imageUrl}"/>`:''}
        <div class="comment-box">
          ${data.comments.map(c=>`<div class="comment">${c.avatar}: ${c.text}</div>`).join("")}
        </div>
      `;
      feedDiv.appendChild(postEl);
    }
  });
}
