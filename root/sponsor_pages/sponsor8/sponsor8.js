// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

// Function to display sponsor data on the HTML page
function displaySponsorData(sponsorData) {
    const sponsorNameElement = document.getElementById("sponsorHeader"); // h1 element for the Sponsor Name
    const dataDisplayDiv = document.getElementById("sponsorData"); // Div to display sponsor8 data

    // Clear previous content
    dataDisplayDiv.innerHTML = '';

    // Set the Sponsor Name as the header
    if (sponsorData['Organizer Name']) {
        sponsorNameElement.textContent = sponsorData['Organizer Name'];
        delete sponsorData['Organizer Name']; // Remove Sponsor Name to avoid displaying it twice
    }

    // Display all the sponsor information in a key-value format
    for (const key in sponsorData) {
        if (sponsorData.hasOwnProperty(key)) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = `<strong>${key}:</strong> ${sponsorData[key]}`;
            dataDisplayDiv.appendChild(paragraph);
        }
    }
}

// Function to fetch and display data for sponsor8
function fetchSponsor8Data() {
    const sponsor8Ref = ref(database, 'sponsors/sponsor8'); // Reference to 'sponsor8' data in Firebase

    get(sponsor8Ref)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const sponsorData = snapshot.val();
                displaySponsorData(sponsorData); // Display the fetched sponsor8 data
            } else {
                document.getElementById("sponsorData").innerHTML = '<p>No data available for this sponsor.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("sponsorData").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Fetch and display data when the page loads
window.onload = fetchSponsor8Data;
