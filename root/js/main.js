// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase settings
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

// Initialize Realtime Database and get a reference to the service
const dbapp = initializeApp(firebaseConfig);
const database = getDatabase(dbapp);

// Function to toggle 'selected' class on filter options when clicked
function toggleSelect(element) {
  // Toggle the 'selected' class
  element.classList.toggle("selected");
}

// Optional: Handle the submit button click event
document.getElementById("submit-btn").addEventListener("click", function () {
  // Gather all selected filters
  let selectedFilters = [];

  // Loop through all elements with the 'selected' class
  document.querySelectorAll(".selected").forEach(function (filter) {
    selectedFilters.push(filter.innerText);
  });

  // Get the minimum hours needed value
  const minHoursInput = document.querySelector(
    'input[placeholder="Min (hours)"]'
  );
  const minHoursValue = minHoursInput.value;

  // Check if the minHoursValue is valid and not empty
  if (minHoursValue) {
    selectedFilters.push("Min Hours Needed: " + minHoursValue + " hours");
  }

  // Debug: Display selected filters in the console
  console.log("Selected filters: ", selectedFilters);

  // Here, you could send the selected filters to your server or do further processing
  alert("Selected Filters: " + selectedFilters.join(", "));
});

function sidebarIconSelect() {
  var sidebar = document.querySelector(".sidebar");
  if (window.getComputedStyle(sidebar, null).display == "none") {
    sidebar.style.display = "block";
  } else {
    sidebar.style.display = "none";
  }
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
  }
});

// <div id='app'></div>
const app = Vue.createApp({
  data() {
    return {
      sidebar: "False",
      account: "student",
      hoursLeft: 80,
      toDoList: ["Task 1", "Task 2", "Task 3", "Task 4"],
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
            console.log(this.hoursLeft);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  }, // methods
});
const vm = app.mount("#app");
