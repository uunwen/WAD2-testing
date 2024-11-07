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
const urlParams = new URLSearchParams(window.location.search); //-- Commented by Jaxsen
const uid = urlParams.get("uid"); //-- Commented by Jaxsen
// const userData = JSON.parse(sessionStorage.getItem("user")); // Added by Jaxsen

// console.log(userData);


// Fetch and display sponsor data
export function fetchSponsorData() {
  const sponsorRef = ref(database, `sponsors/${uid}`);
  get(sponsorRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sponsorData = snapshot.val();
        displaySponsorDetails(sponsorData);
      } else {
        displayNoSponsorData();
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);
      displayErrorFetchingData(error.message);
    });
}

function displaySponsorDetails(sponsorData) {
  console.log("Sponsor Data:", sponsorData);

  const sponsorHeader = document.getElementById("sponsorHeader");
  const aboutContent = document.getElementById("aboutContent");
  const sponsorStats = document.getElementById("sponsorStats");

  if (sponsorHeader) sponsorHeader.textContent = sponsorData["org_name"] || "Sponsor Details";
  if (aboutContent) aboutContent.textContent = sponsorData["org_background"] || "N/A";
  if (sponsorStats) {
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
}

function displayNoSponsorData() {
  const sponsorDescription = document.getElementById("sponsorDescription");
  if (sponsorDescription) sponsorDescription.innerHTML = "<p>No sponsor data available.</p>";
}

function displayErrorFetchingData(message) {
  const sponsorDescription = document.getElementById("sponsorDescription");
  if (sponsorDescription) sponsorDescription.innerHTML = `<p>Error fetching data: ${message}</p>`;
}

// Define `initializeAboutSection`
function initializeAboutSection() {
  const editAboutBtn = document.getElementById("editAboutBtn");
  const saveAboutBtn = document.getElementById("saveAboutBtn");
  const cancelAboutBtn = document.getElementById("cancelAboutBtn");

  console.log("Edit button:", editAboutBtn); // Logs the edit button element

  if (editAboutBtn && saveAboutBtn && cancelAboutBtn) {
    editAboutBtn.addEventListener("click", () => {
      console.log("Edit button clicked"); // Add this log
      enterEditMode();
    });
    saveAboutBtn.addEventListener("click", saveAboutContent);
    cancelAboutBtn.addEventListener("click", cancelEditMode);
  } else {
    console.warn("One or more About section buttons not found.");
  }
}



// Enter edit mode for the About section
function enterEditMode() {
  console.log("Enter Edit Mode triggered"); // Check if this logs on click
  const aboutContent = document.getElementById("aboutContent");
  if (aboutContent) {
    const currentText = aboutContent.textContent.trim() || "Enter your background information here...";
    const textarea = document.createElement("textarea");
    textarea.id = "aboutTextarea";
    textarea.value = currentText;
    textarea.style.display = "block";
    textarea.style.width = "100%";
    textarea.style.height = "150px";
    aboutContent.parentNode.replaceChild(textarea, aboutContent);
    toggleAboutButtons("edit");
  } else {
    console.error("Element #aboutContent not found.");
  }
}


// Save About section content to Firebase
async function saveAboutContent() {
  const textarea = document.getElementById("aboutTextarea");
  if (textarea) {
    const updatedContent = textarea.value.trim();
    if (updatedContent) {
      try {
        const sponsorRef = ref(database, `sponsors/${uid}`);
        await update(sponsorRef, { org_background: updatedContent });
        displaySuccessMessage();
        const span = document.createElement("span");
        span.id = "aboutContent";
        span.innerHTML = updatedContent;
        textarea.replaceWith(span);
        toggleAboutButtons("save");
      } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes.");
      }
    } else {
      console.error("Updated content is empty.");
    }
  } else {
    console.error("Element #aboutTextarea not found.");
  }
}

// Cancel edit mode and restore original About content
function cancelEditMode() {
  const textarea = document.getElementById("aboutTextarea");
  if (textarea) {
    const span = document.createElement("span");
    span.id = "aboutContent";
    span.textContent = textarea.defaultValue || textarea.value.trim();
    textarea.replaceWith(span);
    toggleAboutButtons("cancel");
  } else {
    console.error("Element #aboutTextarea not found.");
  }
}

// Toggle visibility of About buttons based on action
function toggleAboutButtons(action) {
  console.log("Toggle buttons action:", action); // Log the action
  const editBtn = document.getElementById("editAboutBtn");
  const saveBtn = document.getElementById("saveAboutBtn");
  const cancelBtn = document.getElementById("cancelAboutBtn");

  if (action === "edit") {
    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
    cancelBtn.style.display = "inline";
  } else {
    editBtn.style.display = "inline";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  }
}


// Display success message for About section update
function displaySuccessMessage() {
  const successMessage = document.getElementById("successMessage");
  if (successMessage) {
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  fetchSponsorData();
  initializeAboutSection();
});


// Initialize the application on load
window.onload = () => {
  fetchSponsorData();
  initializeAboutSection();
};

// // Commented to prevent flooding on console  --------------------------------------------------------
// if (aboutContent) {
//   aboutContent.textContent = sponsorData["org_background"] || "N/A";
//   console.log("Displayed org_background:", sponsorData["org_background"]); // Log to check the content
// } --------------------------------------------------------

// // Commented out sponsor stats --------------------------------------------------------
// const sponsorStats = document.getElementById("sponsorStats");
// if (sponsorStats) {
//   sponsorStats.innerHTML = "";

//   const stats = [
//     { label: "Followers", value: sponsorData["followers_count"] || "N/A" },
//     { label: "Likes", value: sponsorData["likes_count"] || "N/A" },
//     { label: "Projects", value: sponsorData["project_count"] || "N/A" },
//   ];

//   stats.forEach((stat) => {
//     const statItem = document.createElement("div");
//     statItem.className = "stat-item";
//     statItem.innerHTML = `<p class="number">${stat.value}</p><p>${stat.label}</p>`;
//     sponsorStats.appendChild(statItem);
//   });
// } --------------------------------------------------------


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

        // Add a success message div after the buttons
        const eventSuccessMessage = document.createElement("div");
        eventSuccessMessage.id = `eventSuccessMessage-${eventKey}`; // Unique ID for each event
        eventSuccessMessage.style.display = "none";
        eventSuccessMessage.style.color = "green";
        eventSuccessMessage.style.marginTop = "10px";
        eventSuccessMessage.textContent = "Changes saved successfully.";
        eventBox.appendChild(eventSuccessMessage);

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

    // Log for debugging to confirm function is reached
    console.log("Event data updated successfully.");

    // Create or select the success message div for the specific event container
    let eventSuccessMessage = eventBox.querySelector(".event-success-message");
    if (!eventSuccessMessage) {
      eventSuccessMessage = document.createElement("div");
      eventSuccessMessage.className = "event-success-message";
      eventSuccessMessage.textContent = "Changes saved successfully.";
      eventBox.appendChild(eventSuccessMessage);
      console.log("Success message div created and appended.");
    } else {
      console.log("Success message div found.");
    }

    // Display the success message
    eventSuccessMessage.style.display = "block";
    console.log("Success message displayed.");
    setTimeout(() => {
      eventSuccessMessage.style.display = "none";
      console.log("Success message hidden after timeout.");
    }, 15000);

    // Delay refreshing the events to allow the success message to display
    setTimeout(async () => {
      const org_name = await getSponsorOrg_name();
      fetchAndDisplayEvents(org_name, search);
      console.log("Events refreshed after success message timeout.");
    }, 3100); // Slightly longer than the timeout for the success message
  } catch (error) {
    console.error("Error updating event:", error.message);
    alert("Failed to save changes.");
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
