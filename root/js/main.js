// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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


// Get a reference to the database
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbRef = database.ref("events");

// Toggle selection of filter options
window.toggleSelect = function (element) {
  if (element.classList.contains("selected")) {
    // If already selected, deselect it
    element.classList.remove("selected");
    element.style.backgroundColor = ""; // Reset background color
    element.style.color = ""; // Reset text color
  } else {
    // If not selected, select it
    element.classList.add("selected");
    element.style.backgroundColor = "#007bff"; // Bootstrap primary blue color
    element.style.color = "#fff"; // White text color
  }
};


function displayEvents(events) {
  const dataDisplayDiv = document.getElementById("dataDisplay");
  dataDisplayDiv.innerHTML = "";

  if (events.length === 0) {
    dataDisplayDiv.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach(event => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "mb-3");
    cardElement.style.padding = "0"; // Set padding to 0

    cardElement.innerHTML = `
      <div class="card-body p-0">
        <!-- Event Title -->
        <h2 class="card-title" style="color: #007bff; font-size: 42px; text-decoration: underline; margin: 16px;">
          ${event["Project Name"] || "Unnamed Event"}
        </h2>

        <!-- Event Description -->
        <p style="margin: 16px;"><strong>Description:</strong> ${event.Description || "No description available."}</p>

        <!-- Event Location -->
        <p style="margin: 16px;"><strong>Location:</strong> ${event.Location || "Not specified"}</p>

        <!-- Volunteer Period -->
        <p style="margin: 16px;"><strong>Volunteer Period:</strong> ${event["Volunteer Period"] || "Not specified"}</p>

        <!-- Organiser -->
        <p style="margin: 16px;"><strong>Organiser:</strong> ${event.Organiser || "Not specified"}</p>

        <!-- Sign-Up Button -->
        <div class="text-center" style="border: 2px solid #ccc;">
          <button class="btn btn-light w-70" style="padding: 0px; color: #cccccc; border: none; ">
            Sign Up
          </button>
        </div>
      </div>
    `;

    dataDisplayDiv.appendChild(cardElement);
  });
}



// Define global variables for selected filters
const selectedFilters = {
  time: [],
  day: [],
  region: [],
  commitment: [],
};

// Fetch data from Firebase and display filtered events
async function fetchData() {
  const database = firebase.database();
  const dbRef = database.ref("events");

  try {
    const snapshot = await dbRef.once("value");
    if (snapshot.exists()) {
      eventsData = snapshot.val(); // Store globally
      allEvents = Object.keys(eventsData).map((key) => ({
        ...eventsData[key],
        eventId: key,
      }));

      // Apply filters to the retrieved data
      const filteredEvents = filterEvents(allEvents);
      displayEvents(filteredEvents);
    } else {
      console.error("No events data found.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// Function to filter events based on selected filters
function filterEvents(events) {
  return events.filter((event) => {
    const matchesTime = selectedFilters.time.length === 0 || selectedFilters.time.includes(event["Session(s)"]);
    const matchesDay = selectedFilters.day.length === 0 || selectedFilters.day.some((day) => event["Session(s)"].includes(day));
    const matchesRegion = selectedFilters.region.length === 0 || selectedFilters.region.includes(event["Region"]);
    const matchesCommitment = selectedFilters.commitment.length === 0 || selectedFilters.commitment.includes(event["Project Requirements"]);

    return matchesTime && matchesDay && matchesRegion && matchesCommitment;
  });
}

// Toggle filter selection and update selected filters
window.toggleSelect = function (element) {
  element.classList.toggle("selected");
  const filterGroup = element.closest(".filter-group").querySelector(".filter-label").textContent.trim();
  const filterValue = element.textContent.trim();

  switch (filterGroup) {
    case "Time:":
      updateFilterArray(selectedFilters.time, filterValue);
      break;
    case "Day:":
      updateFilterArray(selectedFilters.day, filterValue);
      break;
    case "Region:":
      updateFilterArray(selectedFilters.region, filterValue);
      break;
    case "Commitment Level:":
      updateFilterArray(selectedFilters.commitment, filterValue);
      break;
  }

  console.log("Updated filters:", selectedFilters);
};

// Helper function to update filter arrays
function updateFilterArray(filterArray, value) {
  const index = filterArray.indexOf(value);
  if (index === -1) {
    filterArray.push(value);
  } else {
    filterArray.splice(index, 1);
  }
}

// Event listener for the submit button
document.getElementById("submit-btn").addEventListener("click", () => {
  fetchData();
});


// Display a message if no data is found
function displayNoDataMessage() {
  const dataDisplayDiv = document.getElementById("dataDisplay");
  dataDisplayDiv.innerHTML = "<p>No events found.</p>";
}

// Declare allEvents as a global variable
// Declare global variables
let eventsData = {};
let allEvents = [];

// Inside fetchData
allEvents = Object.keys(eventsData).map((key) => ({
  ...eventsData[key],
  eventId: key,
}));

// Function to filter events based on search bar input
function filterBySearch() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();

  // Filter events based on the search input matching the title or project name
  const filteredEvents = allEvents.filter((event) => {
    const eventTitle = (event["Project Name"] || "").toLowerCase();
    return eventTitle.includes(searchInput);
  });

  // Display the filtered events
  displayEvents(filteredEvents);
}

// To pass uid into filepath for attendance QR quote -- yunwen
window.getUserUid = function () {
  // Retrieve user info
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");
  // File path to attendance.html
  const filePath = "../attendance/attendance.html?uid=" + uid;
  window.location.href = filePath; // Navigate to the file path
};
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    this.document.querySelector(".sidebar").style.display = "block";
  } else {
    var sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
  }
});

// collapse sidebar 
window.sidebarIconSelect = function sidebarIconSelect() {
  var sidebar = document.querySelector(".sidebar");
  if (window.getComputedStyle(sidebar, null).display == "none") {
    sidebar.style.display = "block";
  }
  else {
    sidebar.style.display = "none";
  }
}

// <div id='app'></div>
const app = Vue.createApp({
  data() {
    return {
      account: "student",
      hoursLeft: 80,
      tasklist: ["You Are Up To Task!"],
    };
  }, // data
  // computed: {
  //     derivedProperty() {
  //         return false;
  //     }
  // }, // computed
  // created() {
  // },
  mounted() {
    this.getHours();
  },
  methods: {
    getUser() {
      return this.account;
    },
    getHours() {
      // To pass hours left --- yunwen
      const userData = JSON.parse(sessionStorage.getItem("user"));
      get(child(ref(database), `students/${userData.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentInfo = snapshot.val();
            this.hoursLeft = studentInfo["hours_left"];
            this.tasklist = studentInfo["tasklist"]
            console.log(this.hoursLeft);
            console.log(this.tasklist);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleTaskToggle(eventData) {
      const task = eventData.task;
      const isChecked = eventData.isChecked;

      // If the task is checked, remove it from the task list
      if (isChecked) {
        // Remove the task from the list in Vue
        this.tasklist = this.tasklist.filter(item => item !== task);

        // Also remove the task from Firebase
        const userData = JSON.parse(sessionStorage.getItem("user"));
        const userRef = database.ref(`students/${userData.uid}/tasklist`);
        userRef.set(this.tasklist); // Update the task list in Firebase
      }
    },
  }, // methods
});

app.component('tasklist', {
  props: ['task'],  // Only need 'task' prop
  emits: ['task-toggled'],  // Emit event when checkbox is clicked
  template: `
    <label>
      <input type="checkbox" v-model="isChecked" @change="onTaskToggle">
      {{ task }}  <!-- Render the task text -->
    </label>
  `,
  data() {
    return {
      isChecked: false,  // Local state for checkbox
    };
  },
  methods: {
    onTaskToggle() {
      // Emit the task-toggled event with task and checkbox status
      this.$emit('task-toggled', { task: this.task, isChecked: this.isChecked });
    },
  },
});
const vm = app.mount("#app");

// Event listener for the search icon click
document.querySelector(".search-icon").addEventListener("click", filterBySearch);

// Fetch data on page load
document.addEventListener("DOMContentLoaded", fetchData);



