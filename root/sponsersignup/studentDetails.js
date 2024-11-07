// Firebase configuration (ensure you replace these with your actual details)
const firebaseConfig = {
    apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
    authDomain: "wad-proj-2b37f.firebaseapp.com",
    databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad-proj-2b37f",
    storageBucket: "wad-proj-2b37f.appspot.com",
    messagingSenderId: "873354832788",
    appId: "1:873354832788:web:41105e10dd0f7651607d81",
    measurementId: "G-LFFLPT7G58"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get the userId and eventId from the URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const eventId = urlParams.get('eventId');

if (!userId || !eventId) {
    console.error("Missing event ID or student ID in the URL.");
    alert("Error: Missing event ID or student ID in the URL.");
} else {
    // Function to fetch student details from the Realtime Database
    async function fetchStudentDetails() {
        try {
            // Reference to the student's data within the specified event
            const studentRef = ref(database, `events/${eventId}/signups/${userId}`);
            const snapshot = await get(studentRef);

            if (!snapshot.exists()) {
                console.error("No student found for this ID in the event.");
                alert("No data available for this student.");
            } else {
                // Get student data from snapshot
                const studentData = snapshot.val();
                console.log("Fetched student data:", studentData);

                // Display the student details on the HTML page
                document.getElementById("studentName").innerText = "Name: " + (studentData.name || "N/A");
                document.getElementById("studentEmail").innerText = "Email: " + (studentData.email || "N/A");
                document.getElementById("studentTelegram").innerText = "Telegram: " + (studentData.telegram || "N/A");
                document.getElementById("studentContact").innerText = "Contact: " + (studentData.contact || "N/A");
            }
        } catch (error) {
            console.error("Error fetching student details:", error);
            alert("Error fetching student details.");
        }
    }

    // Fetch and display student details
    fetchStudentDetails();
}
console.log("User ID:", userId);
console.log("Event ID:", eventId);
