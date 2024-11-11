// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
const firestore = getFirestore(app);


// Replace the existing initMap function with the updated version
function initMap() {
  if (typeof google !== 'undefined' && google.maps) {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
    });

    const marker = new google.maps.Marker({
      map: map,
      draggable: true,
      visible: true, // Set visibility to true by default
    });

    const infowindow = new google.maps.InfoWindow();

    // Autocomplete for the 'placeInput'
    const inputElement = document.getElementById("placeInput");
    if (inputElement && inputElement instanceof HTMLInputElement) {
      const autocompletePlaceInput = new google.maps.places.Autocomplete(inputElement);
      autocompletePlaceInput.bindTo("bounds", map);

      // Listener for 'placeInput'
      autocompletePlaceInput.addListener("place_changed", () => {
        infowindow.close();
        const place = autocompletePlaceInput.getPlace();

        if (!place.geometry) {
          alert("No details available for input: '" + place.name + "'");
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        // Set marker position to the selected place
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        // Update the info window content
        infowindow.setContent(`<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`);
        infowindow.open(map, marker);

        // Update the coordinates field with the location
        document.getElementById("coordinates").value = `${place.geometry.location.lat().toFixed(6)}, ${place.geometry.location.lng().toFixed(6)}`;
      });
    } else {
      console.error("The input element for Autocomplete is missing or not an HTMLInputElement.");
    }

    // Autocomplete for the 'searchInput'
    const autocompleteSearch = new google.maps.places.Autocomplete(document.getElementById("searchInput"));
    autocompleteSearch.bindTo("bounds", map);

    // Listener for 'searchInput'
    autocompleteSearch.addListener("place_changed", () => {
      infowindow.close();
      const place = autocompleteSearch.getPlace();

      if (!place.geometry) {
        alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Set marker position to the selected place
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // Update the info window content
      infowindow.setContent(`<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`);
      infowindow.open(map, marker);

      // Update the coordinates field with the location
      document.getElementById("coordinates").value = `${place.geometry.location.lat().toFixed(6)}, ${place.geometry.location.lng().toFixed(6)}`;
    });

    // Listener for map clicks to update marker position, info window, and coordinates
    map.addListener("click", (event) => {
      const lat = event.latLng.lat().toFixed(6);
      const lng = event.latLng.lng().toFixed(6);

      marker.setPosition(event.latLng);
      marker.setVisible(true);

      // Update the info window content
      infowindow.setContent(`Selected coordinates: ${lat}, ${lng}`);
      infowindow.open(map, marker);

      // Update the coordinates field
      document.getElementById("coordinates").value = `${lat}, ${lng}`;
    });

    // Listener for dragging the marker to update position, info window, and coordinates
    marker.addListener("dragend", (event) => {
      const lat = event.latLng.lat().toFixed(6);
      const lng = event.latLng.lng().toFixed(6);

      // Update the info window content
      infowindow.setContent(`Selected coordinates: ${lat}, ${lng}`);
      infowindow.open(map, marker);

      // Update the coordinates field
      document.getElementById("coordinates").value = `${lat}, ${lng}`;
    });
  } else {
    console.error("Google Maps API not loaded.");
  }
}


// Attach initMap to the global window object
window.initMap = initMap;


// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to get the organization name from the database
async function getOrganizerName(uid) {
  const organizerRef = ref(database, `sponsors/${uid}`);
  const snapshot = await get(organizerRef);
  if (snapshot.exists()) {
    return snapshot.val().org_name; // Adjust the path according to your database structure
  } else {
    console.error("No data available for this uid");
    return null; // or handle accordingly
  }
}

// Function to format date as dd/mm/yy (date only, without time)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0'); // Day in dd format
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month in mm format
  const year = String(date.getFullYear()).slice(-2); // Year in yy format (last two digits)
  return `${day}/${month}/${year}`;
}


// Function to validate if start date is neither earlier nor later than current date
function validateStartDate(startDateInput) {
  // Get the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based index, January is 0
  const currentDay = currentDate.getDate();

  // Get the input start date
  const startDate = new Date(startDateInput.value);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-based index
  const startDay = startDate.getDate();

  // Reset any previous custom validity
  startDateInput.setCustomValidity("");

  // Compare by year, month, and day
  if (startYear < currentYear || (startYear === currentYear && startMonth < currentMonth) || (startYear === currentYear && startMonth === currentMonth && startDay < currentDay)) {
    // If the start date is earlier than the current date
    startDateInput.setCustomValidity("Start date cannot be earlier than the current date.");
    startDateInput.reportValidity();
    startDateInput.classList.add("error-highlight");
  }
  else {
    // If the start date is the same as the current date (year, month, and day are equal)
    startDateInput.classList.remove("error-highlight");
  }
}




// Function to validate a single field
function validateField(element, message) {
  element.addEventListener("input", function () {
    if (this.value.trim() === "" || (this.type === "number" && this.value < 1)) {
      this.setCustomValidity(message);
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });
}

// Function to validate all fields and return errors status
function validateAllFields(eventForm) {
  let hasErrors = false;
  Array.from(eventForm.elements).forEach((element) => {
    if (!element.checkValidity()) {
      element.classList.add("error-highlight");
      hasErrors = true;
    } else {
      element.classList.remove("error-highlight");
    }
  });
  return hasErrors;
}

// Function to validate date inputs
function validateDates(startDateInput, endDateInput) {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  return startDateInput.value && endDateInput.value && endDate > startDate;
}



// Main logic on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {

  initMap();


  const eventForm = document.getElementById("eventForm");
  const photoURLsContainer = document.getElementById("photoURLsContainer");



  // Extract uid from URL
  const uid = getUrlParameter('uid'); // Assuming you have this in your URL
  const orgName = await getOrganizerName(uid); // Get the organization name based on the uid

  // Preview photos when selected
  const photosInput = document.getElementById("photos");
  const photoPreview = document.getElementById("photoPreview");

  // Apply validation to fields
  validateField(document.getElementById("admissionsPeriod"), "Admissions Period cannot be empty.");
  validateField(document.getElementById("capacity"), "Capacity must be a number greater than or equal to 1.");
  validateField(document.getElementById("description"), "Description cannot be empty.");
  validateField(document.getElementById("location"), "Location cannot be empty.");
  validateField(document.getElementById("projectName"), "Project Name cannot be empty.");
  validateField(document.getElementById("projectRequirements"), "Project Requirements cannot be empty.");
  validateField(document.getElementById("sessions"), "Session details cannot be empty.");
  validateField(document.getElementById("totalCSPHours"), "Total CSP hours must be a number greater than or equal to 1.");
  validateField(document.getElementById("coordinates"), "Coordinates must be set and cannot be empty."); // Added validation for coordinates

  // Validate region selection
  document.getElementById("region").addEventListener("change", function () {
    if (this.value === "") {
      this.setCustomValidity("Please select a region.");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });

  const startDateInput = document.getElementById("volunteerPeriodStart");
  const endDateInput = document.getElementById("volunteerPeriodEnd");

  startDateInput.addEventListener("input", function () {
    // Check if start date is valid
    validateStartDate(startDateInput);

    // Check if end date is valid in relation to start date
    if (!validateDates(startDateInput, endDateInput)) {
      endDateInput.setCustomValidity("Volunteer period end date must be later than the start date.");
      endDateInput.reportValidity();
      endDateInput.classList.add("error-highlight");
    } else {
      endDateInput.setCustomValidity("");
      endDateInput.classList.remove("error-highlight");
    }
  });

  endDateInput.addEventListener("input", function () {
    // Check if end date is valid in relation to start date
    if (!validateDates(startDateInput, endDateInput)) {
      endDateInput.setCustomValidity("Volunteer period end date must be later than the start date.");
      endDateInput.reportValidity();
      endDateInput.classList.add("error-highlight");
    } else {
      endDateInput.setCustomValidity("");
      endDateInput.classList.remove("error-highlight");
    }
  });

  // Function to add a new photo URL input field
  document.getElementById("addPhotoButton").addEventListener("click", function () {
    // Create a new wrapper div for the input and remove button
    const photoWrapper = document.createElement("div");
    photoWrapper.classList.add("photoURL-wrapper");

    // Create the new input element
    const newInput = document.createElement("input");
    newInput.type = "url";
    newInput.className = "photoURL";
    newInput.placeholder = "Enter a photo URL";
    newInput.required = true;

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "removePhotoButton";
    removeButton.textContent = "Remove";

    // Append the input and remove button to the wrapper
    photoWrapper.appendChild(newInput);
    photoWrapper.appendChild(removeButton);

    // Append the wrapper to the container
    photoURLsContainer.appendChild(photoWrapper);

    // Add event listener to remove button
    removeButton.addEventListener("click", function () {
      photoWrapper.remove();
    });
  });

  // Add event listeners for existing remove buttons
  document.querySelectorAll(".removePhotoButton").forEach(button => {
    button.addEventListener("click", function () {
      button.parentElement.remove();
    });
  });




  // Form submission logic with validation checks
  eventForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validate all fields
    if (validateAllFields(eventForm)) {
      console.log("Form has errors, preventing submission.");
      return;
    }

    // Collect form data
    const formData = {
      "Admissions Period": document.getElementById("admissionsPeriod").value,
      "Capacity": document.getElementById("capacity").value,
      "Description": document.getElementById("description").value,
      "Location": document.getElementById("location").value,
      "Coordinates": document.getElementById("coordinates").value, // Coordinates field included
      "Status": "Not Approved",
      "Organiser": orgName || "Unknown", // Set the organizer name or "Unknown" if not found
      "Project Name": document.getElementById("projectName").value,
      "Project Requirements": document.getElementById("projectRequirements").value,
      "Region": document.getElementById("region").value,
      "Session(s)": document.getElementById("sessions").value,
      "Total CSP Hours": document.getElementById("totalCSPHours").value,
      "Volunteer Period": `${document.getElementById("volunteerPeriodStart").value} - ${document.getElementById("volunteerPeriodEnd").value}`, // Format as needed
    };

    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);
    const eventNumber = snapshot.exists() ? Object.keys(snapshot.val()).length + 1 : 1;
    const uniqueEventId = `event${eventNumber}`; // Generate the unique ID here

    try {
      // Write to Realtime Database
      await set(ref(database, `events/${uniqueEventId}`), formData);
      console.log("Event successfully written to Firebase:", uniqueEventId);

      // Collect photo URLs
      const photoURLs = Array.from(document.querySelectorAll('.photoURL'))
        .map(input => input.value.trim())
        .filter(url => url !== ""); // Filter out empty URLs

      // Prepare data for Firestore
      const eventWithPhotos = {
        "Project Name": formData["Project Name"],
        Photos: photoURLs, // Include photo URL array in Firestore
      };

      // Write to Firestore
      await setDoc(doc(firestore, "events", uniqueEventId), eventWithPhotos);
      console.log("Event successfully written to Firestore:", uniqueEventId);

      document.getElementById("formMessage").textContent = `${formData["Project Name"]} event successfully created!`;
      document.getElementById("formMessage").style.color = "#28a745"; // Green for success
      document.getElementById("eventForm").reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting the form data:", error);
      document.getElementById("formMessage").textContent = "Failed to create the event. Please try again.";
      document.getElementById("formMessage").style.color = "#d9534f"; // Red for error
    }
  });
});