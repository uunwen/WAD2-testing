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

// Google login
document.getElementById("googleSignIn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      // Save user info to Realtime Database
      set(ref(database, "students/" + user.uid), {
        name: user.displayName,
        email: user.email,
        hours_left: 80, // default 80hrs
      });

      // Redirect to Student.html after
      window.location.href = `../root/events.html?uid=${
        user.uid
      }&name=${encodeURIComponent(user.displayName)}`;
    })

    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
});

// Function to show/hide forms
window.showForm = function (formId) {
  const forms = [
    "loginOptions",
    "communityServiceForm",
    "userForm",
    "adminForm",
  ];
  forms.forEach((form) => {
    document.getElementById(form).style.display =
      form === formId ? "block" : "none";
  });
};
