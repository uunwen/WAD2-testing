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
    const dataDisplayDiv = document.getElementById("eventData"); // Div to display event data

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
        'Total CSP hours',
        'Project Requirements',
        'Region',
        'Admissions Period'
    ];

    // Iterate through the displayOrder array and display the corresponding data
    displayOrder.forEach(key => {
        const paragraph = document.createElement('p');

        // Special handling for the 'Organiser' field to add the link
        if (key === 'Organiser' && eventData[key]) {
            const organiserLink = document.createElement('a');
            organiserLink.href = './sponsor_pages/sponsor1/sponsor1.html';
            organiserLink.textContent = eventData[key];
            organiserLink.style.textDecoration = 'underline';
            organiserLink.style.color = 'blue';

            paragraph.innerHTML = `<strong>Organiser:</strong> `;
            paragraph.appendChild(organiserLink);
        }
        // Handle other fields, including Total CSP Hours, or if the field is empty or undefined
        else if (eventData[key] || eventData[key] === "") {
            paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key] || "N/A"}`;
        }

        dataDisplayDiv.appendChild(paragraph);
    });
}

// Function to fetch and display data for a specific event
function fetchEventData(eventNumber) {
    const eventRef = ref(database, `events/event${eventNumber}`); // Reference to event data in Firebase

    get(eventRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const eventData = snapshot.val();
                console.log("Event Data Fetched:", eventData);

                displayEventData(eventData); // Display the fetched event data
            } else {
                document.getElementById("eventData").innerHTML = '<p>No data available for this event.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("eventData").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}
