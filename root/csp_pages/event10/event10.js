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

// Function to display event data on the HTML page in a specific order
function displayEventData(eventData) {
    const headerElement = document.getElementById("eventHeader"); // h1 element for the Project Name
    const dataDisplayDiv = document.getElementById("event10Data"); // Div to display event10 data

    // Clear previous content
    dataDisplayDiv.innerHTML = '';

    // Set the Project Name as the header
    if (eventData['Project Name']) {
        headerElement.textContent = eventData['Project Name'];
        delete eventData['Project Name']; // Remove Project Name from being displayed twice
    }

    // Display the data in the desired order
    const displayOrder = [
        'Description',
        'Organiser',
        'Location',
        'Session(s)',
        'Volunteer Hours per Session',
        'Volunteer Period',
        'Capacity',
        'Estimated Total Volunteer Hours',
        'Project Requirements',
        'Admissions Period'
    ];

    // Iterate through the displayOrder array and display the corresponding data
    displayOrder.forEach(key => {
        const paragraph = document.createElement('p');

        // Special handling for the 'Organiser' field to add the link
        if (key === 'Organiser' && eventData[key]) {
            const organiserLink = document.createElement('a');

            // Change the link to a relative path to navigate correctly
            organiserLink.href = 'http://localhost/WAD2-testing/root/sponsor_pages/sponsor10/sponsor10.html';
            organiserLink.textContent = eventData[key];

            // Style the link to make it clickable
            organiserLink.style.textDecoration = 'underline';
            organiserLink.style.color = 'blue'; // Blue color for the link

            paragraph.innerHTML = `<strong>Organiser:</strong> `;
            paragraph.appendChild(organiserLink); // Add the link to the paragraph
        }
        // This should be part of the same structure, handling all other fields
        else if (eventData[key]) {
            paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key]}`;
        }

        // Append the paragraph to the display div
        dataDisplayDiv.appendChild(paragraph);
    });
}


// Function to fetch and display data for event10
function fetchEvent10Data() {
    const event10Ref = ref(database, 'events/event10'); // Reference to 'event10' data in Firebase

    get(event10Ref)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const eventData = snapshot.val();
                displayEventData(eventData); // Display the fetched event10 data
            } else {
                document.getElementById("event10Data").innerHTML = '<p>No data available for event10.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("event10Data").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Fetch and display data when the page loads
window.onload = fetchEvent10Data;
