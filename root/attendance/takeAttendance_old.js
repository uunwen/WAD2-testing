// Import required Firebase modules (Ensure you have installed firebase with `npm install firebase`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase settings
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad-proj-2b37f",
  storageBucket: "wad-proj-2b37f.appspot.com",
  messagingSenderId: "873354832788",
  appId: "1:873354832788:web:41105e10dd0f7651607d81",
  measurementId: "G-LFFLPT7G58",
};

// Initialize Realtime Database and get a reference to the service
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize the Html5QrcodeScanner
let scanner;

function initializeScanner() {
  scanner = new Html5QrcodeScanner("reader", {
    qrbox: { width: 250, height: 250 },
    fps: 10,
  });
  scanner.render(onScanSuccess, onScanError);
}

// Success callback when QR code is scanned
function onScanSuccess(result) {
  getUserDataByUid(result)
    .then((userData) => {
      if (userData) {
        console.log("User's name:", userData.name);
      }
    })
    .catch((error) => {
      console.error("Failed to get user data:", error);
    });
}

// Error callback for scan failures
function onScanError(err) {
  console.error(err);
}

// Get corresponding user's uid to get other info from db
function getUserDataByUid(uid) {
  const userRef = ref(database, "students/" + uid);

  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("User data:", userData);
        return { ...userData, uid };
      } else {
        console.log("No data available for this user");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error getting user data:", error);
      throw error;
    });
}

// Start attendance taking
function startAttendance() {
  initializeScanner();
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("stopBtn").style.display = "block";
}

// Stop attendance taking
function stopAttendance() {
  if (scanner) {
    scanner.clear();
  }
  document.getElementById("startBtn").style.display = "block";
  document.getElementById("stopBtn").style.display = "none";
}

// Vue.js component
const { createApp } = Vue;

createApp({
  data() {
    return {
      attendanceList: [],
    };
  },
  mounted() {
    const attendanceRef = ref(database, "attendance");
    onChildAdded(attendanceRef, (snapshot) => {
      const newAttendance = snapshot.val();
      this.attendanceList.push(newAttendance);
    });
  },
  methods: {
    startAttendance() {
      startAttendance();
    },
    stopAttendance() {
      stopAttendance();
    },
  },
}).mount("#app");

