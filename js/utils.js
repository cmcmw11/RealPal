// js/utils.js

/**
 * แปลง Timestamp เป็นเวลาอ่านง่าย
 */
export function formatDate(timestamp){
  const d = timestamp.toDate();
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

/**
 * ตรวจสอบสิทธิ์โพสต์รูป
 */
export function checkImageLimit(posts,todayCount=2){
  return posts.filter(p=>p.imageUrl).length < todayCount;
}
