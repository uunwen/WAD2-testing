// Import filtered event from sponsor1.js
import {
  getSponsorOrg_name,
  getFilteredEventsByOrganizer,
} from "../sponsor/script/sponsor1.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
<<<<<<< HEAD
  databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
=======
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e
  projectId: "wad-proj-2b37f",
  storageBucket: "wad-proj-2b37f.appspot.com",
  messagingSenderId: "873354832788",
  appId: "1:873354832788:web:41105e10dd0f7651607d81",
<<<<<<< HEAD
  measurementId: "G-LFFLPT7G58"
=======
  measurementId: "G-LFFLPT7G58",
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to HTML elements
<<<<<<< HEAD
const eventSelect = document.getElementById('event-select');
const studentTableBody = document.getElementById('student-table-body');
const studentCountDisplay = document.getElementById('student-count'); // Reference to the count display

// Function to get URL parameters
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to fetch events and populate dropdown
async function fetchEvents() {
  try {
      const snapshot = await database.ref('events').once('value');
      const events = snapshot.val();

      // Clear previous options
      eventSelect.innerHTML = '';

      for (const eventKey in events) {
          const eventName = events[eventKey]["Project Name"]; // Get the project name
          const option = document.createElement('option');
          option.value = eventKey; // Value will be used to identify the event
          option.textContent = eventName; // Display the project name
          eventSelect.appendChild(option);
      }
  } catch (error) {
      console.error('Error fetching events:', error);
  }
}
=======
const eventSelect = document.getElementById("event-select");
const studentTableBody = document.getElementById("student-table-body");
const studentCountDisplay = document.getElementById("student-count");

// Function to get the UID from the URL
function getUIDFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uid"); // Get the uid parameter from the URL
}

// // Function to fetch project list for the sponsor and populate dropdown
// async function fetchProjectListAndEvents(uid) {
//   try {
//     const snapshot = await database
//       .ref(`sponsors/${uid}/project_list`)
//       .once("value");
//     const projectList = snapshot.val();

//     // Clear previous options
//     eventSelect.innerHTML = "";

//     // Loop through each project and create options for the dropdown
//     for (const projectKey in projectList) {
//       const projectName = projectList[projectKey]; // Assuming project name is stored directly
//       const option = document.createElement("option");
//       option.value = projectKey; // Use projectKey as the value
//       option.textContent = projectName; // Display project name
//       eventSelect.appendChild(option);
//     }
//   } catch (error) {
//     console.error("Error fetching project list:", error);
//   }
// }
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e

// Function to fetch and display students for the selected event
async function fetchAndDisplayStudents(eventField) {
<<<<<<< HEAD
  studentTableBody.innerHTML = ''; // Clear previous table rows
  studentCountDisplay.textContent = '0'; // Reset count display
  console.log('Fetching data for event field:', eventField);

  try {
      const snapshot = await database.ref('students').once('value');
      const students = snapshot.val();
      console.log('Students data:', students);

      let studentCount = 0; // Counter for students signed up

      // Loop through the users and display those who signed up for the selected event
      for (const userKey in students) {
          const user = students[userKey];
          console.log('User:', user);

          // Check if the user has signed up for the selected event
          if (user[eventField] === true) {
              console.log(`User signed up: ${user.name}`); // Log student name
              addStudentRow(userKey, user); // Pass both the key and data to add row
              studentCount++; // Increment the counter
          }
      }

      // Update the total count display
      studentCountDisplay.textContent = studentCount;

      if (studentCount === 0) {
          console.log(`No students signed up for ${eventField}`);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
=======
  studentTableBody.innerHTML = ""; // Clear previous table rows
  studentCountDisplay.textContent = "0"; // Reset count display

  try {
    const snapshot = await database.ref("students").once("value");
    const students = snapshot.val();

    let studentCount = 0; // Counter for students signed up

    // Loop through the users and display those who signed up for the selected event
    for (const userKey in students) {
      const user = students[userKey];

      console.log(user);
      console.log(eventField);

      // Check if the user has signed up for the selected event
      if (user[eventField] === true) {
        addStudentRow(userKey, user); // Pass both the key and data to add row
        studentCount++; // Increment the counter
      }
    }

    // Update the total count display
    studentCountDisplay.textContent = studentCount;

    if (studentCount === 0) {
      console.log(`No students signed up for ${eventField}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e
  }
}

// Function to add a student row in the table
function addStudentRow(userKey, user) {
<<<<<<< HEAD
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  const link = document.createElement('a'); // Create a link element

  link.textContent = user.name; // Set the text to the student's name
  link.href = `studentDetails.html?userId=${userKey}`; // Set the href to the details page with userKey as a query parameter
  link.style.color = 'inherit'; // Keep the link color the same as the text
  link.style.textDecoration = 'none'; // Remove underline from the link
=======
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  const link = document.createElement("a"); // Create a link element

  link.textContent = user.name; // Set the text to the student's name
  link.href = `studentDetails.html?userId=${userKey}`; // Set the href to the details page with userKey as a query parameter
  link.style.color = "inherit"; // Keep the link color the same as the text
  link.style.textDecoration = "none"; // Remove underline from the link
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e

  cell.appendChild(link); // Append the link to the cell
  row.appendChild(cell); // Append the cell to the row
  studentTableBody.appendChild(row); // Append the row to the table body
}

// Event listener for when the dropdown value changes
<<<<<<< HEAD
eventSelect.addEventListener('change', (event) => {
  const selectedEvent = event.target.value;
  console.log(`Selected event: ${selectedEvent}`); // Check if event is correct
  fetchAndDisplayStudents(selectedEvent);
});

// Call fetchEvents on page load
window.onload = () => {
  fetchEvents(); // Fetch events when the page loads

  // Check if there is an eventKey in the URL parameters
  const eventKey = getQueryParameter('eventKey');
  if (eventKey) {
      eventSelect.value = eventKey; // Set the select box to the corresponding event
      fetchAndDisplayStudents(eventKey); // Fetch and display students for that event
  }
};
=======
eventSelect.addEventListener("change", (event) => {
  const selectedEvent = event.target.value;
  console.log(selectedEvent);
  fetchAndDisplayStudents(selectedEvent);
});

// // Call fetchEvents on page load
// window.onload = () => {
//   const uid = getUIDFromURL(); // Get the uid from URL
//   if (uid) {
//     fetchProjectListAndEvents(uid); // Fetch project list for the given uid
//   } else {
//     console.error("No UID found in URL.");
//   }
// };

export async function updateOptions() {
  const org_name = await getSponsorOrg_name();
  let filteredEvent = await getFilteredEventsByOrganizer(org_name);

  const eventsSelect = document.getElementById("events");

  // Clear existing options
  eventsSelect.innerHTML = "";

  // Add default empty option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select an event";
  defaultOption.value = "";
  eventsSelect.add(defaultOption);

  // Populate with new options
  for (let i = 0; i < filteredEvent.length; i++) {
    let event = await filteredEvent[i][1]["Project Name"];
    const option = document.createElement("option");
    option.text = event;
    option.value = filteredEvent[i][0];
    eventsSelect.add(option);
  }
}

updateOptions();
>>>>>>> 956a60ddf8f18006a9de033991e03b02e5df9e1e
