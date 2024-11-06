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
        const sponsorDescription = document.getElementById("sponsorDescription");
        if (sponsorDescription) {
          sponsorDescription.innerHTML = "<p>No sponsor data available.</p>";
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);

      document.getElementById(
        "sponsorDescription"
      ).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    })
}

function displaySponsorDetails(sponsorData) {
  console.log("Sponsor data:", sponsorData); // Debug log to check the data structure

  const sponsorHeader = document.getElementById("sponsorHeader");
  const aboutContent = document.getElementById("aboutContent");

  if (sponsorHeader) {
    sponsorHeader.textContent = sponsorData["org_name"] || "Sponsor Details";
  }

  if (aboutContent) {
    aboutContent.textContent = sponsorData["org_background"] || "N/A";
    console.log("Displayed org_background:", sponsorData["org_background"]); // Log to check the content
  }

  const sponsorStats = document.getElementById("sponsorStats");
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



// Event listener for the edit button
document.getElementById("editAboutBtn").addEventListener("click", () => {
  const aboutContent = document.getElementById("aboutContent");
  if (aboutContent) {
    const currentText = aboutContent.textContent.trim() || "Enter your background information here...";

    const textarea = document.createElement("textarea");
    textarea.id = "aboutTextarea";
    textarea.value = currentText;
    textarea.style.display = "block"; // Ensure it displays when created
    textarea.style.width = "100%";
    textarea.style.height = "150px";

    aboutContent.parentNode.replaceChild(textarea, aboutContent);

    document.getElementById("editAboutBtn").style.display = "none";
    document.getElementById("saveAboutBtn").style.display = "inline";
    document.getElementById("cancelAboutBtn").style.display = "inline";
  } else {
    console.error("Element #aboutContent not found.");
  }
});



// Event listener for the save button for the About section
document.getElementById("saveAboutBtn").addEventListener("click", async () => {
  const textarea = document.getElementById("aboutTextarea");
  if (textarea) {
    const updatedContent = textarea.value.trim();

    if (updatedContent) {
      try {
        const sponsorRef = ref(database, `sponsors/${uid}`);
        await update(sponsorRef, { org_background: updatedContent });

        // Display success message for the About section
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 3000);

        // Replace the textarea with a span
        const span = document.createElement("span");
        span.id = "aboutContent";
        span.innerHTML = updatedContent;
        textarea.replaceWith(span);

        document.getElementById("editAboutBtn").style.display = "inline";
        document.getElementById("saveAboutBtn").style.display = "none";
        document.getElementById("cancelAboutBtn").style.display = "none";
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
});








// Event listener for the cancel button
document.getElementById("cancelAboutBtn").addEventListener("click", () => {
  const textarea = document.getElementById("aboutTextarea");
  if (textarea) {
    // Revert to the original text content before editing
    const span = document.createElement("span");
    span.id = "aboutContent";
    span.textContent = textarea.defaultValue || textarea.value.trim(); // Retain the original value

    textarea.replaceWith(span);

    document.getElementById("editAboutBtn").style.display = "inline";
    document.getElementById("saveAboutBtn").style.display = "none";
    document.getElementById("cancelAboutBtn").style.display = "none";
  } else {
    console.error("Element #aboutTextarea not found.");
  }
});


// Call this function after all your imports and initializations
window.onload = () => {
  fetchSponsorData();
};





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
    eventContainer.innerHTML = "<p>No events found for the specified organizer.</p>";
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

        // Display each detail of the event, excluding "signups"
        for (const [key, value] of Object.entries(eventData)) {
          if (key !== "signups") {
            const paragraph = document.createElement("p");
            paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
            paragraph.setAttribute("data-key", key);
            eventBox.appendChild(paragraph);
          }
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
    document.getElementById("eventContainer").innerHTML = `<p>Error displaying events: ${error.message}</p>`;
  }
}

// Create buttons for editing, saving, and canceling edits
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

    console.log("Event data updated successfully.");

    let eventSuccessMessage = eventBox.querySelector(".event-success-message");
    if (!eventSuccessMessage) {
      eventSuccessMessage = document.createElement("div");
      eventSuccessMessage.className = "event-success-message";
      eventSuccessMessage.textContent = "Changes saved successfully.";
      eventBox.appendChild(eventSuccessMessage);
    }

    eventSuccessMessage.style.display = "block";
    setTimeout(() => {
      eventSuccessMessage.style.display = "none";
    }, 15000);

    setTimeout(async () => {
      const org_name = await getSponsorOrg_name();
      fetchAndDisplayEvents(org_name, search);
    }, 3100);
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

// Function to get the organization name
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

// Function to get event data by UID
export async function getEventfromUid(eventUid) {
  try {
    const eventRef = ref(database, "events/" + eventUid);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const event = snapshot.val();
      return event;
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
  }
}

// Function to get duration from event session
export function getDurationFromEventSession(session) {
  const timeRange = session.split(", ")[1];
  const [startTime, endTime] = timeRange.split(" - ");

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

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const durationInMilliseconds = end - start;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

  return durationInHours;
}
