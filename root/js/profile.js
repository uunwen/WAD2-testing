<<<<<<< HEAD
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
=======
// Firebase configuration
>>>>>>> 1efdec0a2ad288d5b70754baee489c012de2d55f
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

<<<<<<< HEAD
// Initialize Realtime Database and get a reference to the service
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
=======
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth(); // Initialize Firebase Auth
>>>>>>> 1efdec0a2ad288d5b70754baee489c012de2d55f

// Firebase authentication state change listener
auth.onAuthStateChanged(user => {
  if (user) {
      document.getElementById('user-email').innerText = `Email: ${user.email}`;
      const userId = user.uid;

      // Show loading text
      document.getElementById('user-name').innerText = "Loading...";

<<<<<<< HEAD
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
=======
      // Fetch user data from the database
      database.ref('students/' + userId).once('value')
          .then(snapshot => {
              if (snapshot.exists()) {
                  const studentData = snapshot.val();
                  
                  // Populate the profile information
                  document.getElementById('user-name').innerText = studentData.name || "User Name";
                  document.getElementById('user-username').innerText = '@' + userId; // Using UID as username
                  document.getElementById('user-bio').innerText = `Hours Left: ${studentData.hours_left || 0}`;
                  document.getElementById('profile-picture').src = "default-profile.jpg"; // Adjust for profile picture if you have one

                  // Display additional information
                  const hoursLeft = document.createElement('p');
                  hoursLeft.innerText = `Hours Left: ${studentData.hours_left}`;
                  document.querySelector('.profile-container').appendChild(hoursLeft);
                  
                  // Create social links (if you have them in your structure)
                  const socialLinks = studentData.socialLinks || {}; // Adjust as needed
                  const linksContainer = document.getElementById('social-links');
                  linksContainer.innerHTML = ''; // Clear existing links
                  for (const platform in socialLinks) {
                      if (socialLinks[platform]) {
                          const link = document.createElement('a');
                          link.href = socialLinks[platform];
                          link.innerText = platform.charAt(0).toUpperCase() + platform.slice(1);
                          link.target = "_blank"; // Open in a new tab
                          linksContainer.appendChild(link);
                      }
                  }
              } else {
                  console.error("No student data available.");
              }
          })
          .catch(error => {
              console.error("Error fetching student data:", error);
          });
  } else {
      window.location = 'login.html'; // Redirect to login page
>>>>>>> 1efdec0a2ad288d5b70754baee489c012de2d55f
  }
});
