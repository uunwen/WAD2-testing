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

// To pass uid into filepath for attendance QR quote
// (pls dont delete me ;- ;)
function getUserUid() {
  // Retrieve user info
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");
  // File path to attendance.html
  const filePath = "../attendance/attendance.html?uid=" + uid;
  window.location.href = filePath; // Navigate to the file path
}
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
  // mounted() {
  // },
  methods: {
    getUser() {
      return this.account;
    },
  }, // methods
});
const vm = app.mount("#app");
