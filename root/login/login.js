// Import required Firebase modules (Ensure you have installed firebase with `npm install firebase`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

// Function to log the entire database content
function logEntireDatabase() {
  const dbRef = ref(database);

  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Database content:", snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Call the function to log the database
// To test that firebase is working
logEntireDatabase();

// Google sign in handler
window.googleSignIn = async function googleSignIn(userType) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    const userRef = ref(database, `${userType}s/${user.uid}`);

    // Check if the user is already registered
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      // Only set data if user is not already registered
      const userData = {
        name: user.displayName,
        email: user.email,
      };
      
      if (userType == "student") {
        userData.hours_left = 80; // default 80hrs

        // Get the current year
        const currentYear = new Date().getFullYear();
        // Generate a random number between 1 and 4
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        // Calculate graduation year
        const graduationYear = currentYear + randomNumber;
        userData.graduation_year = graduationYear;
      }

      await set(userRef, userData);
      console.log("User data set successfully.");
    } else {
      console.log("User already registered.");
    }
    sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      userType: userType,
    }));

    // Redirect based on user type
    if (userType == "student") {
      window.location.href = `../student/main.html?uid=${user.uid}&name=${encodeURIComponent(user.displayName)}`;
    } else if (userType == "admin") {
      window.location.href = `../admin.html?uid=${user.uid}&name=${encodeURIComponent(user.displayName)}`;
    }
    
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    alert("There was an error during sign-in. Please try again.");
  }
};

// no validation just for show login for sponsor
window.sponsorLogin = async function sponsorLogin() {
  let sponsorId = document.getElementById("sponsorId").value;
  let sponsorPwd = document.getElementById("sponsorPwd").value;

  // Hardcoded sponsor's pwd
  const HARDCODED_PWD = "ilovewad2";
  console.log(sponsorId);

  try {
    let sponsorRef = ref(database, "sponsors/" + sponsorId);
    const snapshot = await get(sponsorRef);

    if (snapshot.exists() && sponsorPwd === HARDCODED_PWD) {
      // Get the service user's name from the database
      const sponsoreData = snapshot.val();

      // Redirect to corrosponding sponsor page with sponsor uid
      window.location.href = `../sponsor/sponsor1.html?uid=${sponsorId}`;
    } else {
      console.log("WRONG PWD");
      document.getElementById("errorMessage").innerText =
        "Invalid username or password!";
      document.getElementById("errorMessage").style.display = "block"; // Show error message
    }
  } catch (error) {
    console.error("Error during community service login:", error);
  }
};

// Function to show the modal form
window.showForm = function (formId) {
  const modal = document.getElementById(formId + "Modal");
  if (modal) {
      modal.style.display = "flex"; // Show the modal as a flex container
  }
};

// Function to hide the modal form
window.hideModal = function (formId) {
  const modal = document.getElementById(formId);
  if (modal) {
      modal.style.display = "none"; // Hide the modal
  }
};
