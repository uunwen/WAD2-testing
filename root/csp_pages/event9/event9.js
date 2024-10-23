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
    const dataDisplayDiv = document.getElementById("event9Data"); // Div to display event9 data

    // Clear previous content
    dataDisplayDiv.innerHTML = '';

    // Set the Project Name as the header
    if (eventData['Project Name']) {
        headerElement.textContent = eventData['Project Name'];
    }

    // Display the data in the desired order
    const displayOrder = [
        'Description',
        'Organiser',
        'Location',
        'Session(s)',
        'Volunteer Period',
        'Capacity',
        'Total CSP hours', // Check if this matches exactly with Firebase key
        'Project Requirements',
        'Region',
        'Admissions Period'
    ];

    // Iterate through the displayOrder array and display the corresponding data
    displayOrder.forEach(key => {
        const paragraph = document.createElement('p');

        // Debugging log to check key and value
        console.log(`Key: ${key}, Value: ${eventData[key]}`);

        // Special handling for the 'Organiser' field to add the link
        if (key === 'Organiser' && eventData[key]) {
            const organiserLink = document.createElement('a');

            // Change the link to a relative path to navigate correctly
            organiserLink.href = '../../sponsor_pages/sponsor9/sponsor9.html'; // Correct relative path
            organiserLink.textContent = eventData[key];

            // Style the link to make it clickable
            organiserLink.style.textDecoration = 'underline';
            organiserLink.style.color = 'blue'; // Blue color for the link

            paragraph.innerHTML = `<strong>Organiser:</strong> `;
            paragraph.appendChild(organiserLink); // Add the link to the paragraph
        }
        // Handle other fields, including Total CSP Hours, or if the field is empty or undefined
        else if (eventData[key] || eventData[key] === "") {
            paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key] || "N/A"}`; // Display "N/A" if the value is empty
        } else {
            // Log if the field does not exist or is empty
            console.log(`No data available for key: ${key}`);
        }

        // Append the paragraph to the display div
        dataDisplayDiv.appendChild(paragraph);
    });
}

// Function to fetch and display data for event9
function fetchEvent9Data() {
    const event9Ref = ref(database, 'events/event9'); // Reference to 'event9' data in Firebase

    get(event9Ref)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const eventData = snapshot.val();
                console.log("Event Data Fetched:", eventData); // Log entire data object for debugging

                // Log the specific 'Total CSP hours' key to check if it exists
                console.log("Total CSP hours:", eventData['Total CSP hours']);

                displayEventData(eventData); // Display the fetched event9 data
            } else {
                document.getElementById("event9Data").innerHTML = '<p>No data available for event9.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("event9Data").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Fetch and display data when the page loads
window.onload = fetchEvent9Data;
