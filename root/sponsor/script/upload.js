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
    const newInput = document.createElement("input");
    newInput.type = "url";
    newInput.className = "photoURL";
    newInput.placeholder = "Enter a photo URL";
    photoURLsContainer.appendChild(newInput);
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

<<<<<<< HEAD
      // Format the Volunteer Period as "dd/mm/yy - dd/mm/yy"
      const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
      const formattedStart = startDate.toLocaleDateString("en-GB", options);
      const formattedEnd = endDate.toLocaleDateString("en-GB", options);
      const volunteerPeriod = `${formattedStart} - ${formattedEnd}`;

      // Create the event object without photo URL for Realtime Database
      // TODO: auto populate the organiser...  ---- yunwen 
      const newEvent = {
        "Admissions Period": admissionsPeriod,
        Capacity: capacity,
        Description: description,
        Location: location,
        "Project Name": projectName,
        "Project Requirements": projectRequirements,
        Region: region,
        "Session(s)": sessions,
        Status: "Not Approved",
        "Total CSP hours": totalCSPHours,
        "Volunteer Period": volunteerPeriod,
=======
      // Prepare data for Firestore
      const eventWithPhotos = {
        "Project Name": formData["Project Name"],
        Photos: photoURLs, // Include photo URL array in Firestore
>>>>>>> 83b4971637a079196fea71f12813c3571b7c6aae
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