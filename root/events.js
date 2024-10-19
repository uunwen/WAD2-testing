// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to display each event as a card
function displayEventCard(parentElement, data, eventKey) {
  // Create a card container
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Create the Project Name as the header (h1) with a link
  if (data["Project Name"]) {
    const header = document.createElement("h1");
    const link = document.createElement("a");
    // Modify the href to point to the new directory structure
    link.href = `csp_pages/${eventKey}/${eventKey}.html`;
    link.textContent = data["Project Name"];
    header.appendChild(link);
    cardElement.appendChild(header); // Add the project name (with link) to the card
  }

  // Display Description, Location, Volunteer Period, and Organiser
  const fieldsToDisplay = [
    "Description",
    "Location",
    "Volunteer Period",
    "Organiser",
  ];

  fieldsToDisplay.forEach((field) => {
    if (data[field]) {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = `<strong>${field}:</strong> ${data[field]}`;
      cardElement.appendChild(paragraph);
    }
  });

  // Add the signup button (static and disabled)
  const signupButton = document.createElement("button");
  signupButton.textContent = "Sign Up";
  signupButton.classList.add("signup-btn");
  signupButton.disabled = true; // Disable the button

  // Append the signup button to the card
  cardElement.appendChild(signupButton);

  // Append the card to the parent element
  parentElement.appendChild(cardElement);
}

// Function to fetch and display all Firebase data
function fetchAndDisplayData() {
  const dbRef = ref(database); // Reference to the root of the database
  const dataDisplayDiv = document.getElementById("dataDisplay"); // Div to show data

  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        dataDisplayDiv.innerHTML = ""; // Clear previous content

        // Assuming 'events' is the parent node of all event data
        for (const eventKey in data.events) {
          if (data.events.hasOwnProperty(eventKey)) {
            displayEventCard(dataDisplayDiv, data.events[eventKey], eventKey); // Pass the eventKey
          }
        }
      } else {
        dataDisplayDiv.innerHTML = "<p>No data available</p>"; // Show message if no data is found
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      dataDisplayDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

// Fetch and display data when the page loads
window.onload = fetchAndDisplayData;
