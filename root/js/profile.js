// Import required Firebase modules (Ensure you have installed firebase with `npm install firebase`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Yun wen: Added to import functions from sponsor.js
import { getEventfromUid } from "../sponsor/script/sponsor1.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// Firebase authentication state change listener
auth.onAuthStateChanged((user) => {
  if (user) {
    // Check if the profile picture is already stored in sessionStorage
    const cachedProfilePicture = sessionStorage.getItem("profilePicture");
    if (cachedProfilePicture) {
      // Use cached picture if available
      document.getElementById("profile-picture").src = cachedProfilePicture;
    } else {
      // Otherwise, use the photo URL from Firebase and store it in sessionStorage
      const photoURL = user.photoURL || "../img/user.png"; // Default profile image if no photoURL
      sessionStorage.setItem("profilePicture", photoURL);
      document.getElementById("profile-picture").src = photoURL;
    }

    document.getElementById("user-email").innerText = `Email: ${user.email}`;
    const userId = user.uid;

    // Show loading text
    document.getElementById("user-name").innerText = "Loading...";

    const studentRef = ref(database, "students/" + userId);
    get(studentRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const studentData = snapshot.val();
          console.log(studentData);
          // Populate the profile information
          document.getElementById("user-name").innerText =
            studentData.name || "User Name";

          // Display the graduation year
          document.getElementById(
            "graduation-year"
          ).innerText = `Expected Graduation Year: ${studentData.graduation_year}`;

          // // You can also display hours left if needed
          // const hoursLeft = document.createElement("p");
          // hoursLeft.innerText = `Hours Left: ${studentData.hours_left}`;
          // document.querySelector(".profile-container").appendChild(hoursLeft);

          // Add "Back to Home" button below "Hours Left"
          const backButton = document.createElement("button");
          backButton.className = "back-button";
          backButton.innerText = "Back to Home";
          backButton.onclick = goBackToHome;
          document.querySelector(".profile-container").appendChild(backButton);

          // Yun Wen: Added to display past event
          let pastEvent;
          const historicalEvent = getAttendedEvent(studentData);
          if (historicalEvent.length === 0) {
            // Display "No events yet!" if there are no events
            document.getElementById("displayEvent").textContent = "No events yet!";
          } else {
            // Remove "No events yet!" and display events
            document.getElementById("displayEvent").textContent = ""; // Clear placeholder text
            historicalEvent.forEach((eventUid) => {
              getPastEvent(eventUid).then((projectName) => {
                displayEvent(projectName);
              });
            });
          }
          // Yun Wen: Added to display past event
        } else {
          console.error("No student data available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  } else {
    window.location = "../login/login.html"; // Redirect to login page
  }
});

// Yun Wen: Added to display past event by getting uid of historical event from user
function getAttendedEvent(obj) {
  const eventNumbers = [];
  // Iterate over object keys and filter those that start with "event"
  Object.keys(obj).forEach((eventUid) => {
    if (eventUid.startsWith("event") && obj[eventUid] === true) {
      eventNumbers.push(eventUid);
    }
  });
  return eventNumbers;
}

// Yun Wen: Added to display past event with imported functions from sponsor.js
function getPastEvent(eventUid) {
  return getEventfromUid(eventUid).then(
    (eventData) => eventData["Project Name"]
  );
}

function displayEvent(eventName) {
  const displayDiv = document.getElementById("displayEvent");
  const eventElement = document.createElement("p");
  eventElement.textContent = eventName;
  displayDiv.appendChild(eventElement);
}

window.goBackToHome = function goBackToHome() {
  window.location.href = '../student/main.html';
}
