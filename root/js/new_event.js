/**
 * @author Chan Yun Wen
 */

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

let search = "";

// Function to display each event as a card
function displayEventCard(parentElement, data, eventKey, searchTerm) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Project Name with clickable link
  if (
    data["Project Name"] &&
    data["Project Name"].toLowerCase().includes(searchTerm)
  ) {
    const header = document.createElement("h1");
    const link = document.createElement("a");
    link.href = `event-details/event-details.html?eventKey=${eventKey}`;
    link.textContent = data["Project Name"];
    header.appendChild(link);
    cardElement.appendChild(header);

    // Display selected fields
    ["Description", "Location", "Volunteer Period", "Organiser"].forEach(
      (field) => {
        if (data[field]) {
          const paragraph = document.createElement("p");
          paragraph.innerHTML = `<strong>${field}:</strong> ${data[field]}`;
          cardElement.appendChild(paragraph);
        }
      }
    );

    // Append the card to the parent element
    parentElement.appendChild(cardElement);
  }
}

// Function to fetch and display all events from Firebase
function fetchAndDisplayData(searchTerm) {
  const dbRef = ref(database, "events"); // Reference to the "events" node
  const dataDisplayDiv = document.getElementById("dataDisplay"); // Div to display the data

  dataDisplayDiv.innerHTML = "";

  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        dataDisplayDiv.innerHTML = ""; // Clear previous content

        // Loop through each event and display it as a card
        for (const eventKey in data) {
          if (data.hasOwnProperty(eventKey)) {
            displayEventCard(
              dataDisplayDiv,
              data[eventKey],
              eventKey,
              searchTerm
            ); // Pass the eventKey to display each event card
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

// Get search input
export async function initializeSearch(eleId) {
  const searchInput = document.getElementById(eleId);

  // Update the search variable when input changes but don't trigger search
  searchInput.addEventListener("input", (e) => {
    search = e.target.value.toLowerCase();
    console.log("Current search:", search);
  });

  // Trigger search when Enter key is pressed
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  });
}

function triggerSearch() {
  // Linking function
  fetchAndDisplayData(search);
}

// main
window.onload = () => {
  // Initial load
  fetchAndDisplayData("");

  // Initialize the search input field and event listeners
  initializeSearch("searchInput");
};
