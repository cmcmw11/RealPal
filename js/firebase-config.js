// ตั้งค่า Firebase Realpal
const firebaseConfig = {
  apiKey: "AIzaSyD16O71K0Erz47p2bqj4bcR2CaffMcJ7KU",
  authDomain: "realpal-eadb5.firebaseapp.com",
  projectId: "realpal-eadb5",
  storageBucket: "realpal-eadb5.firebasestorage.app",
  messagingSenderId: "755055085773",
  appId: "1:755055085773:web:b980a014130aca8da2c184",
  measurementId: "G-CEWMNPW3DL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
