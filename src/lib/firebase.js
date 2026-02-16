// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // เพิ่มการนำเข้า Firestore
import { getAuth } from "firebase/auth";           // (เผื่อไว้) สำหรับระบบ Login

const firebaseConfig = {
    apiKey: "AIzaSyDy14mCKPq_cXmiAzB1B5_0irqOMA2DFrk",
    authDomain: "tun-37-memory.firebaseapp.com",
    projectId: "tun-37-memory",
    storageBucket: "tun-37-memory.firebasestorage.app",
    messagingSenderId: "1004858800553",
    appId: "1:1004858800553:web:68667c2b83895eae896cb8",
    measurementId: "G-SM91LPCF53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// สร้าง Instance สำหรับใช้งานในโปรเจกต์
export const db = getFirestore(app); // ตัวแปรนี้ใช้จัดการ Database ในรูปที่คุณแคปมา
export const auth = getAuth(app);    // ตัวแปรนี้ใช้จัดการเรื่อง User