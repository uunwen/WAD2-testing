// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

import { getSponsorOrg_name } from "./sponsor1.js";

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

// Retrive user info
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Function to get the next event ID
async function getNextEventId() {
  try {
    const eventsRef = ref(database, "events/");
    const snapshot = await get(eventsRef);
    const events = snapshot.val();

    if (!events) return "event1";

    const eventIds = Object.keys(events)
      .filter((key) => key.startsWith("event"))
      .map((key) => parseInt(key.replace("event", "")))
      .filter((num) => !isNaN(num));

    const maxEventId = Math.max(...eventIds);
    return `event${maxEventId + 1}`;
  } catch (error) {
    console.error("Error getting next event ID:", error);
    throw error;
  }
}

// Function to write event data to Firebase
async function writeEventData(eventData) {
  try {
    const eventId = await getNextEventId();
    await set(ref(database, `events/${eventId}`), eventData);
    return eventId;
  } catch (error) {
    console.error("Error writing event data:", error);
    throw error;
  }
}

// Handle form submission
document
  .getElementById("submitEvent")
  .addEventListener("click", async function () {
    try {
      // Get input values
      const admissionsPeriod =
        document.getElementById("admissionsPeriod").value;
      const capacity = document.getElementById("capacity").value;
      const description = document.getElementById("description").value;
      const location = document.getElementById("location").value;
      // const organiser = document.getElementById("organiser").value;
      const projectName = document.getElementById("projectName").value;
      const projectRequirements = document.getElementById(
        "projectRequirements"
      ).value;
      const region = document.getElementById("region").value;
      const sessions = document.getElementById("sessions").value;
      const totalCSPHours = document.getElementById("totalCSPHours").value;
      const volunteerPeriodStart = new Date(
        document.getElementById("volunteerPeriodStart").value
      );
      const volunteerPeriodEnd = new Date(
        document.getElementById("volunteerPeriodEnd").value
      );

      // Format the Volunteer Period as "dd/mm/yy - dd/mm/yy"
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      };
      const formattedStart = volunteerPeriodStart.toLocaleDateString(
        "en-GB",
        options
      );
      const formattedEnd = volunteerPeriodEnd.toLocaleDateString(
        "en-GB",
        options
      );
      const volunteerPeriod = `${formattedStart} - ${formattedEnd}`;

      // Get the organization name first
      const org_name = await getSponsorOrg_name();

      if (!org_name) {
        throw new Error("Could not retrieve organization name");
      }

      // Create the event object
      const newEvent = {
        "Admissions Period": admissionsPeriod,
        Capacity: capacity,
        Description: description,
        Location: location,
        Organiser: org_name,
        "Project Name": projectName,
        "Project Requirements": projectRequirements,
        Region: region,
        "Session(s)": sessions,
        Status: "Not Approved",
        "Total CSP hours": totalCSPHours,
        "Volunteer Period": volunteerPeriod,
      };

      // Write the new event data to Firebase
      const eventId = await writeEventData(newEvent);

      document.getElementById(
        "formMessage"
      ).textContent = `${eventId} created successfully!`;
      document.getElementById("formMessage").classList.remove("error");
      document.getElementById("eventForm").reset();
    } catch (error) {
      document.getElementById(
        "formMessage"
      ).textContent = `Error creating event: ${error.message}`;
      document.getElementById("formMessage").classList.add("error");
    }
  });
