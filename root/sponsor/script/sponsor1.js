// import from navbar.js and get search bar value
import { search, initializeSearch } from "./navbar.js";
export let isEditing = true; // Flag to pause update from searchbar during editing
export let filteredEventsArr;

// Initialize the search bar
initializeSearch();

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  set,
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

// Retrieve user info
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Fetch and display sponsor data
export function fetchSponsorData() {
  const sponsorRef = ref(database, `sponsors/${uid}`);
  get(sponsorRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sponsorData = snapshot.val();
        displaySponsorDetails(sponsorData);
      } else {
        document.getElementById("sponsorDescription").innerHTML =
          "<p>No sponsor data available.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);
      document.getElementById(
        "sponsorDescription"
      ).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

function displaySponsorDetails(sponsorData) {
  // Display sponsor name and background
  document.getElementById("sponsorHeader").textContent =
    sponsorData["org_name"] || "Sponsor Details";
  document.getElementById("aboutContent").textContent =
    sponsorData["org_background"] || "N/A";

  // Display sponsor statistics
  const sponsorStats = document.getElementById("sponsorStats");
  sponsorStats.innerHTML = "";

  const stats = [
    { label: "Followers", value: sponsorData["followers_count"] || "N/A" },
    { label: "Likes", value: sponsorData["likes_count"] || "N/A" },
    { label: "Projects", value: sponsorData["project_count"] || "N/A" },
  ];

  stats.forEach((stat) => {
    const statItem = document.createElement("div");
    statItem.className = "stat-item";
    statItem.innerHTML = `<p class="number">${stat.value}</p><p>${stat.label}</p>`;
    sponsorStats.appendChild(statItem);
  });
}

// Fetch and display events by organizer
export async function fetchAndDisplayEvents(organizerName, search) {
  try {
    const filteredEvents = await getFilteredEventsByOrganizer(organizerName);
    displayFilteredEvents(filteredEvents, search);
  } catch (error) {
    document.getElementById(
      "eventContainer"
    ).innerHTML = `<p>Error fetching events: ${error.message}</p>`;
  }
}

// Fetch events from organizer
export async function getFilteredEventsByOrganizer(organizerName) {
  try {
    const eventsRef = ref(database, "events");
    const snapshot = await get(eventsRef);

    if (snapshot.exists()) {
      const allEvents = snapshot.val();
      const filteredEvents = Object.entries(allEvents).filter(
        ([, eventData]) => eventData["Organiser"] === organizerName
      );
      return filteredEvents;
    }
    return [];
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error;
  }
}

// Display filtered events with edit functionality
function displayFilteredEvents(events, search) {
  const eventContainer = document.getElementById("eventContainer");
  eventContainer.innerHTML = "";

  if (events.length === 0) {
    eventContainer.innerHTML =
      "<p>No events found for the specified organizer.</p>";
    return;
  }

  try {
    events.forEach(([eventKey, eventData]) => {
      if (eventData["Project Name"].toLowerCase().includes(search)) {
        const eventBox = document.createElement("div");
        eventBox.className = "event-box";

        // Create event header
        const header = document.createElement("h3");
        header.textContent = eventData["Project Name"] || "Unnamed Project";
        eventBox.appendChild(header);

        // Display each detail of the event
        for (const [key, value] of Object.entries(eventData)) {
          const paragraph = document.createElement("p");
          paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
          paragraph.setAttribute("data-key", key);
          eventBox.appendChild(paragraph);
        }

        // Add edit, save, and cancel buttons
        createEditButtons(eventBox, eventKey);
        eventContainer.appendChild(eventBox);
      }
    });
  } catch (error) {
    document.getElementById(
      "eventContainer"
    ).innerHTML = `<p>Error displaying events: ${error.message}</p>`;
  }
}

async function createEditButtons(eventBox, eventKey) {
  const editBtn = createButton("Edit", "edit-btn");
  const saveBtn = createButton("Save", "save-btn", "none");
  const cancelBtn = createButton("Cancel", "cancel-btn", "none");
  const deleteBtn = createButton("Delete", "delete-btn");

  // Append buttons to the event box
  eventBox.appendChild(editBtn);
  eventBox.appendChild(saveBtn);
  eventBox.appendChild(cancelBtn);
  eventBox.appendChild(deleteBtn);

  // Event listeners for buttons
  editBtn.addEventListener("click", () => {
    enableEditEvent(eventBox, saveBtn, cancelBtn);
    isEditing = false; // Pause search updates during editing
  });

  cancelBtn.addEventListener("click", () => {
    cancelEditEvent(eventKey, eventBox);
    resetButtons(editBtn, saveBtn, cancelBtn);
    isEditing = true; // Enable search updates
  });

  saveBtn.addEventListener("click", async () => {
    await saveEventData(eventKey, eventBox);
    resetButtons(editBtn, saveBtn, cancelBtn);
    isEditing = true; // Enable search updates
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (confirmDelete) {
      await deleteEvent(eventKey, eventBox);
    }
  });
}

// Delete event function
async function deleteEvent(eventKey, eventBox) {
  const eventRef = ref(database, `events/${eventKey}`);
  try {
    await set(eventRef, null);
    console.log("Event deleted successfully.");
    eventBox.remove();

    const org_name = await getSponsorOrg_name();
    fetchAndDisplayEvents(org_name, search);
  } catch (error) {
    console.error("Error deleting event:", error.message);
    alert("Failed to delete event: " + error.message);
  }
}

// Reset button visibility after save/cancel actions
function resetButtons(editBtn, saveBtn, cancelBtn) {
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
}

function createButton(text, className, display = "inline-block") {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.style.display = display;
  return button;
}

// Enable editing for an event
function enableEditEvent(eventBox, saveBtn, cancelBtn) {
  eventBox.querySelectorAll("p").forEach((paragraph) => {
    const key = paragraph.getAttribute("data-key");
    const value = paragraph.textContent.split(": ")[1];

    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.setAttribute("data-key", key);

    paragraph.innerHTML = `<strong>${key}:</strong> `;
    paragraph.appendChild(input);
  });

  saveBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
  eventBox.querySelector(".edit-btn").style.display = "none";
}

// Save the edited event data to Firebase
async function saveEventData(eventKey, eventBox) {
  const updatedData = {};
  eventBox.querySelectorAll("input").forEach((input) => {
    const key = input.getAttribute("data-key");
    updatedData[key] = input.value;
  });

  const eventRef = ref(database, `events/${eventKey}`);
  try {
    await update(eventRef, updatedData);
    console.log("Event updated successfully.");

    const org_name = await getSponsorOrg_name();
    fetchAndDisplayEvents(org_name, search);
  } catch (error) {
    console.error("Error updating event:", error.message);
  }
}

// Cancel editing and restore original content
function cancelEditEvent(eventKey, eventBox) {
  const eventRef = ref(database, `events/${eventKey}`);
  get(eventRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const eventData = snapshot.val();
        displayEventData(eventData, eventBox);
      }
    })
    .catch((error) => {
      console.error("Error restoring event data:", error.message);
    });
}

// Display event data in the specified event box
function displayEventData(eventData, eventBox) {
  eventBox.innerHTML = "";

  const header = document.createElement("h3");
  header.textContent = eventData["Project Name"] || "Unnamed Project";
  eventBox.appendChild(header);

  for (const [key, value] of Object.entries(eventData)) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
    paragraph.setAttribute("data-key", key);
    eventBox.appendChild(paragraph);
  }

  createEditButtons(eventBox, eventData.eventKey);
}

export async function getSponsorOrg_name() {
  try {
    const sponsorRef = ref(database, `sponsors/${uid}`);
    const snapshot = await get(sponsorRef);
    if (snapshot.exists()) {
      const sponsorData = snapshot.val();
      return sponsorData.org_name;
    }
  } catch (error) {
    console.error("Error in getSponsorOrg_name function:", error.message);
  }
}

export async function getEventfromUid(eventUid) {
  try {
    // Get event data based of event uid
    const eventRef = ref(database, "events/" + eventUid);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const event = snapshot.val();
      return event;
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
  }

  onValue(eventRef, (snapshot) => {
    const data = snapshot.val();
    updateStarCount(postElement, data);
  });
}

export function getDurationFromEventSession(session) {
  // Extract the time part of the string
  const timeRange = session.split(", ")[1];
  const [startTime, endTime] = timeRange.split(" - ");

  // Helper function to convert time to a Date object
  function parseTime(time) {
    const [timePart, meridian] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(1970, 0, 1, hours, minutes);
  }

  // Calculate the duration
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const durationInMilliseconds = end - start;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

  return durationInHours;
}
