// Import required Firebase modules (Ensure you have installed firebase with `npm install firebase`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase setting
const appSettings = {
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Realtime Database and get a reference to the service
const app = initializeApp(appSettings);
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
logEntireDatabase();
