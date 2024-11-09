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

import {
  getFirestore,
  doc,
  deleteDoc,
  getDoc, // Ensure this line is included
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



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


// Initialize Firestore
const firestore = getFirestore(app);

export async function initMap(coordinates = "-34.397, 150.644") {
  const mapContainer = document.getElementById("mapContainer");
  if (mapContainer) {
    mapContainer.style.display = "block"; // Ensure the map container is visible

    // Adding passive listeners to prevent warnings
    mapContainer.addEventListener('touchmove', (e) => {
      // Custom code if needed
    }, { passive: true });

    mapContainer.addEventListener('touchstart', (e) => {
      // Custom code if needed
    }, { passive: true });

    const [lat, lng] = coordinates.split(", ").map(Number);
    const initialPosition = { lat, lng };

    const map = new google.maps.Map(mapContainer, {
      zoom: 14,
      center: initialPosition,
    });

    const marker = new google.maps.Marker({
      position: initialPosition,
      map: map,
      draggable: true,
    });

    // Update coordinates input field when marker is dragged
    google.maps.event.addListener(marker, 'dragend', function (event) {
      const newLat = event.latLng.lat().toFixed(6);
      const newLng = event.latLng.lng().toFixed(6);
      document.getElementById("coordinatesInput").value = `${newLat}, ${newLng}`;
    });

    return marker;
  }
}


// Function to create the "View on Map" button for each event
export function createViewOnMapButton(coordinates) {
  const viewMapBtn = document.createElement("button");
  viewMapBtn.textContent = "View on Map";
  viewMapBtn.className = "btn btn-primary btn-sm";
  viewMapBtn.style.marginTop = "10px";

  // Add event listener to open Google Maps when clicked
  viewMapBtn.onclick = () => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(", ").map(Number);
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      alert("Coordinates are not available.");
    }
  };

  return viewMapBtn;
}


// Function to create and return the "Edit Map Location" button
function createEditMapLocationButton(coordinates) {
  const editMapBtn = document.createElement("button");
  editMapBtn.textContent = "Edit Map Location";
  editMapBtn.className = "btn btn-secondary btn-sm";
  editMapBtn.style.marginLeft = "10px"; // Add some spacing between buttons

  // Add event listener to display and initialize the map when clicked
  editMapBtn.onclick = () => {
    const mapContainer = document.getElementById("mapContainer");
    if (mapContainer) {
      mapContainer.style.display = "block";
      initMap(coordinates);
    }
  };

  return editMapBtn;
}






// Function to fetch only the Photos array for an event from Firestore
async function getEventPhotos(eventKey) {
  try {
    const eventDocRef = doc(firestore, "events", eventKey);
    const eventDoc = await getDoc(eventDocRef);

    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      return eventData.Photos || []; // Return the Photos array or an empty array if not found
    } else {
      console.log(`No event found with ID ${eventKey} in Firestore.`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching event photos for ${eventKey}:`, error.message);
    return [];
  }
}


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


// Function to display event photos with delete buttons
async function displayEventPhotosWithDeleteButtons(eventKey, photoContainer, isEditable) {
  try {
    const photoUrls = await getEventPhotos(eventKey);
    photoContainer.innerHTML = ""; // Clear existing photos before displaying new ones

    if (photoUrls.length > 0) {
      photoUrls.forEach((url, index) => {
        const photoWrapper = document.createElement("div");
        photoWrapper.className = "photo-wrapper";

        const img = document.createElement("img");
        img.src = url;
        img.alt = `Photo ${index + 1} for event ${eventKey}`;
        img.className = "event-photo";
        img.loading = "lazy";

        if (isEditable) {
          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = '<i class="fas fa-times"></i>'; // FontAwesome "X" icon
          deleteBtn.className = "delete-btn";

          deleteBtn.onclick = async () => {
            const confirmDelete = confirm(`Are you sure you want to delete this photo?`);
            if (confirmDelete) {
              await deleteSinglePhoto(eventKey, url);
              photoWrapper.remove();
            }
          };

          photoWrapper.appendChild(deleteBtn);
        }

        photoWrapper.appendChild(img);
        photoContainer.appendChild(photoWrapper);
      });
    } else {
      console.log(`No photos available for event ${eventKey}`);
    }
  } catch (error) {
    console.error(`Error displaying photos for event ${eventKey}:`, error.message);
  }
}


// Function to add the photo feature and return the button
function addPhotoFeature(eventBox, eventKey, photoContainer) {
  const addPhotoBtn = document.createElement("button");
  addPhotoBtn.textContent = "Add Photo";
  addPhotoBtn.className = "btn btn-success btn-sm";
  addPhotoBtn.style.display = "none"; // Initially hidden

  const photoInputContainer = document.createElement("div");
  photoInputContainer.style.display = "none";
  photoInputContainer.style.marginTop = "10px";

  const photoInput = document.createElement("input");
  photoInput.type = "text";
  photoInput.placeholder = "Enter photo URL";
  photoInput.className = "form-control mb-2";

  const photoPreview = document.createElement("img");
  photoPreview.style.display = "none";
  photoPreview.style.maxWidth = "150px";
  photoPreview.style.marginTop = "5px";

  const uploadBtn = document.createElement("button");
  uploadBtn.textContent = "Upload Photo";
  uploadBtn.className = "btn btn-success";
  uploadBtn.style.display = "none";

  // Add event handlers for photo input and upload
  addPhotoBtn.onclick = () => {
    photoInputContainer.style.display = "block";
    photoInput.focus();
  };


  photoInput.oninput = () => {
    if (photoInput.value) {
      photoPreview.src = photoInput.value;
      photoPreview.style.display = "block";
      uploadBtn.style.display = "inline-block";
    } else {
      photoPreview.style.display = "none";
      uploadBtn.style.display = "none";
    }
  };

  uploadBtn.onclick = async () => {
    if (photoInput.value) {
      try {
        const eventDocRef = doc(firestore, "events", eventKey);
        const eventDoc = await getDoc(eventDocRef);
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          const updatedPhotos = eventData.Photos ? [...eventData.Photos, photoInput.value] : [photoInput.value];

          // Update Firestore with the new photo URL
          await updateDoc(eventDocRef, { Photos: updatedPhotos });
          alert("Photo added successfully!");

          // Refresh the photo display and clear input
          await displayEventPhotosWithDeleteButtons(eventKey, photoContainer, true);
          photoInput.value = "";
          photoPreview.style.display = "none";
          uploadBtn.style.display = "none";
        } else {
          console.error(`No event found with ID ${eventKey}`);
        }
      } catch (error) {
        console.error(`Error uploading photo for event ${eventKey}:`, error.message);
        alert("Failed to upload photo.");
      }
    }
  };

  // Append input, preview, and upload button
  photoInputContainer.appendChild(photoInput);
  photoInputContainer.appendChild(photoPreview);
  photoInputContainer.appendChild(uploadBtn);
  eventBox.appendChild(addPhotoBtn);
  eventBox.appendChild(photoInputContainer);

  return addPhotoBtn; // Ensure the button is returned for use elsewhere
}

// Function to display filtered events with edit functionality
// Function to display filtered events with edit functionality
async function displayFilteredEvents(events, search) {
  const eventContainer = document.getElementById("eventContainer");
  eventContainer.innerHTML = "";

  if (events.length === 0) {
    eventContainer.innerHTML = "<p>No events found for the specified organizer.</p>";
    return;
  }

  try {
    for (const [eventKey, eventData] of events) {
      if (eventData["Project Name"] && eventData["Project Name"].toLowerCase().includes(search)) {
        const eventBox = document.createElement("div");
        eventBox.className = "event-box";

        // Create event header
        const header = document.createElement("h3");
        header.textContent = eventData["Project Name"] || "Unnamed Project";
        eventBox.appendChild(header);

        // Display event details
        for (const [key, value] of Object.entries(eventData)) {
          if (key !== "signups" && key !== "Status") {
            const paragraph = document.createElement("p");
            paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
            paragraph.setAttribute("data-key", key);
            eventBox.appendChild(paragraph);
          }
        }

        // Add the "View on Map" and "Edit Map Location" buttons if coordinates are available
        if (eventData["Coordinates"]) {
          const viewMapBtn = createViewOnMapButton(eventData["Coordinates"]);
          const editMapBtn = createEditMapLocationButton(eventData["Coordinates"]);

          const buttonContainer = document.createElement("div");
          buttonContainer.appendChild(viewMapBtn);
          buttonContainer.appendChild(editMapBtn);
          eventBox.appendChild(buttonContainer);
        }

        // Display event photos
        const photoContainer = document.createElement("div");
        photoContainer.className = "photo-container";
        await displayEventPhotosWithDeleteButtons(eventKey, photoContainer, false);
        eventBox.appendChild(photoContainer);

        // Add "Add Photo" feature and get addPhotoBtn
        const addPhotoBtn = addPhotoFeature(eventBox, eventKey, photoContainer);

        // Add edit, save, and cancel buttons
        createEditButtons(eventBox, eventKey, photoContainer, addPhotoBtn);

        // Append the event box to the event container
        eventContainer.appendChild(eventBox);
      }
    }
  } catch (error) {
    eventContainer.innerHTML = `<p>Error displaying events: ${error.message}</p>`;
  }
}

// Function to create edit buttons and ensure addPhotoBtn is defined
async function createEditButtons(eventBox, eventKey, photoContainer, addPhotoBtn) {
  const editBtn = createButton("Edit", "edit-btn");
  const saveBtn = createButton("Save", "save-btn", "none");
  const cancelBtn = createButton("Cancel", "cancel-btn", "none");
  const deleteBtn = createButton("Delete", "delete-btn");

  // Check if addPhotoBtn is defined before accessing its properties
  if (addPhotoBtn) {
    addPhotoBtn.style.display = "none"; // Initially hidden
  } else {
    console.warn("addPhotoBtn is undefined, proceeding without it.");
  }

  // Apply margin for spacing
  saveBtn.style.marginRight = "10px";
  cancelBtn.style.marginRight = "10px";
  if (addPhotoBtn) addPhotoBtn.style.marginRight = "10px";

  // Append buttons to the event box
  eventBox.appendChild(editBtn);
  eventBox.appendChild(saveBtn);
  eventBox.appendChild(cancelBtn);
  eventBox.appendChild(deleteBtn);
  if (addPhotoBtn) eventBox.appendChild(addPhotoBtn);

  // Add event listeners
  editBtn.addEventListener("click", async () => {
    enableEditEvent(eventBox, saveBtn, cancelBtn);
    await displayEventPhotosWithDeleteButtons(eventKey, photoContainer, true);
    if (addPhotoBtn) addPhotoBtn.style.display = "inline-block"; // Show add photo button in edit mode
    isEditing = false; // Pause search updates during editing
  });

  cancelBtn.addEventListener("click", () => {
    cancelEditEvent(eventKey, eventBox);
    resetButtons(editBtn, saveBtn, cancelBtn);
    if (addPhotoBtn) addPhotoBtn.style.display = "none"; // Hide add photo button in view mode
    isEditing = true; // Enable search updates
  });

  saveBtn.addEventListener("click", async () => {
    await saveEventData(eventKey, eventBox);
    resetButtons(editBtn, saveBtn, cancelBtn);
    if (addPhotoBtn) addPhotoBtn.style.display = "none"; // Hide add photo button in view mode
    await displayEventPhotosWithDeleteButtons(eventKey, photoContainer, false);
    isEditing = true; // Enable search updates
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete this event? This action cannot be undone.");
    if (confirmDelete) {
      await deleteEvent(eventKey, eventBox);
    }
  });
}


// Update the deleteEvent function to delete from Firestore as well
async function deleteEvent(eventKey, eventBox) {
  // Reference to the event in the Realtime Database
  const eventRef = ref(database, `events/${eventKey}`);

  try {
    // Delete event from the Realtime Database
    await set(eventRef, null);
    console.log("Event deleted successfully from Realtime Database.");

    // Delete event from Cloud Firestore
    const firestoreEventRef = doc(firestore, "events", eventKey);
    await deleteDoc(firestoreEventRef);
    console.log("Event deleted successfully from Cloud Firestore.");

    // Remove the event box from the DOM
    eventBox.remove();

    // Refresh the events list
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
  button.className = className; // Check if button is created successfully
  button.style.display = display;
  return button;
}


// Enable editing for an event and display Google Maps only when required
function enableEditEvent(eventBox, saveBtn, cancelBtn) {
  eventBox.querySelectorAll("p").forEach((paragraph) => {
    const key = paragraph.getAttribute("data-key");
    const value = paragraph.textContent.split(": ")[1];

    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.setAttribute("data-key", key);

    // Only initialize the map when editing coordinates
    if (key === "Coordinates") {
      input.id = "coordinatesInput"; // ID to access input for updated coordinates
      const mapContainer = document.getElementById("mapContainer");
      mapContainer.style.display = "none"; // Ensure map is initially hidden

      // Add a button to show and initialize the map
      const showMapButton = document.createElement("button");
      showMapButton.textContent = "Edit Map Location";
      showMapButton.onclick = () => {
        mapContainer.style.display = "block";
        initMap(value); // Call `initMap` only when the button is clicked
      };
      paragraph.appendChild(showMapButton); // Append the button to the paragraph
    }

    // Replace the paragraph content with the input element
    paragraph.innerHTML = `<strong>${key}:</strong> `;
    paragraph.appendChild(input);
  });

  // Show save and cancel buttons, hide the edit button
  saveBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
  eventBox.querySelector(".edit-btn").style.display = "none";
}




// Save the edited event data to Firebase, including updated coordinates
async function saveEventData(eventKey, eventBox) {
  const updatedData = {};
  eventBox.querySelectorAll("input").forEach((input) => {
    const key = input.getAttribute("data-key");
    const value = input.value.trim(); // Trim to avoid spaces being stored as valid data

    // Only include non-empty values in the update
    if (value !== "") {
      updatedData[key] = value;
    }
  });

  const eventRef = ref(database, `events/${eventKey}`);
  try {
    if (Object.keys(updatedData).length > 0) {
      await update(eventRef, updatedData);

      // Hide map after saving, if applicable
      const mapContainer = document.getElementById("mapContainer");
      if (mapContainer) {
        mapContainer.style.display = "none";
      }

      console.log("Event data updated successfully:", updatedData);

      // Create or select the success message div for the specific event container
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
      }, 3000);

      // Optionally refresh the event list after saving
      setTimeout(async () => {
        const org_name = await getSponsorOrg_name();
        fetchAndDisplayEvents(org_name, search);
      }, 3100); // Adjust delay as needed
    } else {
      console.warn("No valid data to update.");
    }
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