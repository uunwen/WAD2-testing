// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Helper to retrieve query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load event name in form header
const eventName = getQueryParam("eventName");
document.getElementById("eventName").textContent = eventName || "the Event";

// Handle form submission
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get eventKey for specific event
    const eventKey = getQueryParam("eventKey");

    // Collect form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const telegram = document.getElementById("telegram").value;
    const age = document.getElementById("age").value;
    const school = document.getElementById("school").value;
    const contact = document.getElementById("contact").value;

    // Reference to the event's sign-ups in Firebase
    const signupsRef = ref(database, `events/${eventKey}/signups`);

    // Save data to Firebase
    push(signupsRef, {
        name,
        email,
        telegram,
        age,
        school,
        contact
    }).then(() => {
        alert("You have successfully signed up for the event!");
        document.getElementById("signupForm").reset(); // Clear form
    }).catch((error) => {
        console.error("Error submitting data:", error);
        alert("An error occurred while signing up. Please try again.");
    });
});
