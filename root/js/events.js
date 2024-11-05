// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

// Function to display each event as a card
function displayEventCard(parentElement, data, eventKey) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Project Name with clickable link
  if (data["Project Name"]) {
    const header = document.createElement("h1");
    const link = document.createElement("a");
    link.href = `event-details/event-details.html?eventKey=${eventKey}`;
    link.textContent = data["Project Name"];
    header.appendChild(link);
    cardElement.appendChild(header);
  }

  // Display selected fields
  ["Description", "Location", "Volunteer Period", "Organiser"].forEach((field) => {
    if (data[field]) {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = `<strong>${field}:</strong> ${data[field]}`;
      cardElement.appendChild(paragraph);
    }
  });


  // Append the card to the parent element
  parentElement.appendChild(cardElement);
}

// Function to fetch and display all events from Firebase
function fetchAndDisplayData() {
  const dbRef = ref(database, "events"); // Reference to the "events" node
  const dataDisplayDiv = document.getElementById("dataDisplay"); // Div to display the data

  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        dataDisplayDiv.innerHTML = ""; // Clear previous content

        // Loop through each event and display it as a card
        for (const eventKey in data) {
          if (data.hasOwnProperty(eventKey)) {
            displayEventCard(dataDisplayDiv, data[eventKey], eventKey); // Pass the eventKey to display each event card
          }
        }
      } else {
        dataDisplayDiv.innerHTML = "<p>No data available</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      dataDisplayDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

// Fetch and display data when the page loads
window.onload = fetchAndDisplayData;