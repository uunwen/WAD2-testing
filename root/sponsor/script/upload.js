// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  get,
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
// Initialize Realtime Database
const database = getDatabase(app);
// Initialize Firestore
const firestore = getFirestore(app);

document
  .getElementById("submitEvent")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from being submitted immediately
    let hasErrors = false;

    // Clear existing error messages
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll(".error-highlight")
      .forEach((el) => el.classList.remove("error-highlight"));

    // Check for validation errors on all input fields
    const requiredFields = [
      { id: "admissionsPeriod", message: "Admissions Period cannot be empty." },
      {
        id: "capacity",
        message: "Capacity must be a number greater than or equal to 1.",
        isNumber: true,
      },
      { id: "description", message: "Description cannot be empty." },
      { id: "location", message: "Location cannot be empty." },
      { id: "projectName", message: "Project Name cannot be empty." },
      {
        id: "projectRequirements",
        message: "Project Requirements cannot be empty.",
      },
      { id: "region", message: "Please select a region." },
      { id: "sessions", message: "Session details cannot be empty." },
      {
        id: "totalCSPHours",
        message: "Total CSP hours must be a number greater than or equal to 1.",
        isNumber: true,
      },
      {
        id: "volunteerPeriodStart",
        message: "Volunteer Period Start cannot be empty.",
      },
      {
        id: "volunteerPeriodEnd",
        message: "Volunteer Period End cannot be empty.",
      },
      { id: "photoURL", message: "Photo URL cannot be empty." },
    ];

    requiredFields.forEach((field) => {
      const element = document.getElementById(field.id);
      if (element) {
        const value = element.value.trim();
        if (!value || (field.isNumber && (isNaN(value) || Number(value) < 1))) {
          element.classList.add("error-highlight");
          let errorElement = element.nextElementSibling;
          if (
            !errorElement ||
            !errorElement.classList.contains("error-message")
          ) {
            errorElement = document.createElement("div");
            errorElement.className = "error-message";
            errorElement.textContent = field.message;
            element.after(errorElement);
          }
          hasErrors = true;
        }
      }
    });

    // Validate volunteer period start and end dates
    const startDateInput = document.getElementById("volunteerPeriodStart");
    const endDateInput = document.getElementById("volunteerPeriodEnd");
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDateInput.value && endDateInput.value) {
      if (endDate <= startDate) {
        endDateInput.classList.add("error-highlight");
        let errorElement = endDateInput.nextElementSibling;
        if (
          !errorElement ||
          !errorElement.classList.contains("error-message")
        ) {
          errorElement = document.createElement("div");
          errorElement.className = "error-message";
          errorElement.textContent =
            "Volunteer period end date must be later than the start date.";
          endDateInput.after(errorElement);
        }
        hasErrors = true;
      }
    }

    // If errors exist, stop form submission and focus on the first error field
    if (hasErrors) {
      console.log("Form has errors, preventing submission.");
      const firstErrorField = document.querySelector(".error-highlight");
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Proceed with form submission if no errors
    try {
      // Get input values
      const admissionsPeriod =
        document.getElementById("admissionsPeriod").value;
      const capacity = document.getElementById("capacity").value;
      const description = document.getElementById("description").value;
      const location = document.getElementById("location").value;
      const projectName = document.getElementById("projectName").value;
      const projectRequirements = document.getElementById(
        "projectRequirements"
      ).value;
      const region = document.getElementById("region").value;
      const sessions = document.getElementById("sessions").value;
      const totalCSPHours = document.getElementById("totalCSPHours").value;
      const photoURL = document.getElementById("photoURL").value; // Collect photo URL

      // Validate CSP hours to ensure they are not negative or less than 1
      if (isNaN(totalCSPHours) || totalCSPHours < 1) {
        alert("Total CSP hours must be at least 1 and cannot be negative.");
        document.getElementById("totalCSPHours").focus(); // Focus on the field for correction
        return; // Stop the form submission
      }

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
      };

      // Write the new event data to Realtime Database
      const eventsRef = ref(database, "events");
      const snapshot = await get(eventsRef);
      const eventNumber = snapshot.exists()
        ? Object.keys(snapshot.val()).length + 1
        : 1;
      const eventId = `event${eventNumber}`;
      await set(ref(database, `events/${eventId}`), newEvent);

      // Prepare data for Firestore with photo URL
      const eventSummary = {
        "Project Name": projectName,
        Photos: [photoURL], // Include photo URL only in Firestore
      };

      // Log data for debugging
      console.log(
        "Writing to Firestore with eventId:",
        eventId,
        "Data:",
        eventSummary
      );

      // Write the data to Firestore under the "events" collection using the same eventId
      await setDoc(doc(firestore, "events", eventId), eventSummary);
      console.log("Data written to Firestore successfully");

      document.getElementById(
        "formMessage"
      ).textContent = `${eventId} created successfully!`;
      document.getElementById("formMessage").classList.remove("error");
      document.getElementById("formMessage").style.color = "#28a745"; // Green color for success
      document.getElementById("eventForm").reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error creating event:", error);
      document.getElementById(
        "formMessage"
      ).textContent = `Error creating event: ${error.message}`;
      document.getElementById("formMessage").classList.add("error");
      document.getElementById("formMessage").style.color = "#d9534f"; // Red color for error
    }
  });
