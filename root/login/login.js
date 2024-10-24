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
    signInWithPopup(auth, provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      if (userType == "student") {
        set(ref(database, "students/" + user.uid), {
          name: user.displayName,
          email: user.email,
          hours_left: 80, // default 80hrs
        });

        // Redirect to Student.html after
        window.location.href = `../student/main.html?uid=${
          user.uid
        }&name=${encodeURIComponent(user.displayName)}`;
      }
      if (userType == "admin") {
        set(ref(database, "admins/" + user.uid), {
          name: user.displayName,
          email: user.email,
        });

        // Redirect to Student.html after
        window.location.href = `../admin.html?uid=${
          user.uid
        }&name=${encodeURIComponent(user.displayName)}`;
      }
    });
  } catch (error) {
    alert("Wrong username/password");
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
      window.location.href = `../sponsor_edit/${sponsorId}/${sponsorId}.html?uid=${sponsorId}`;
    } else {
      console.log("WRONG PWD");
      document.getElementById("errorMessage").innerHTML =
        "Invalid username or password!";
      document.getElementById("errorMessage").style.display = "block"; // Show error message
    }
  } catch (error) {
    console.error("Error during community service login:", error);
  }
};

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
