// Import required Firebase modules (Ensure you have installed firebase with `npm install firebase`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase settings
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
  databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad-proj-2b37f",
  storageBucket: "wad-proj-2b37f.appspot.com",
  messagingSenderId: "873354832788",
  appId: "1:873354832788:web:41105e10dd0f7651607d81",
  measurementId: "G-LFFLPT7G58",
};

// Initialize Realtime Database and get a reference to the service
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Firebase authentication state change listener
auth.onAuthStateChanged(user => {
  if (user) {
      document.getElementById('user-email').innerText = `Email: ${user.email}`;
      const userId = user.uid;

      // Show loading text
      document.getElementById('user-name').innerText = "Loading...";

    const studentRef = ref(database, 'students/' + userId);
    get(studentRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const studentData = snapshot.val();
          console.log(studentData);
          // Populate the profile information
          document.getElementById('user-name').innerText = studentData.name || "User Name";
          document.getElementById('profile-picture').src = "default-profile.jpg"; // Adjust for profile picture if you have one

          // You can also display hours left if needed
          const hoursLeft = document.createElement('p');
          hoursLeft.innerText = `Hours Left: ${studentData.hours_left}`;
          document.querySelector('.profile-container').appendChild(hoursLeft);
        } else {
          console.error("No student data available.");
        }
      })
      .catch(error => {
        console.error("Error fetching student data:", error);
      });
  } else {
    window.location = '../login/login2.html'; // Redirect to login page
  }
});
