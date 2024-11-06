// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
    authDomain: "wad-proj-2b37f.firebaseapp.com",
    databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad-proj-2b37f",
    storageBucket: "wad-proj-2b37f.appspot.com",
    messagingSenderId: "873354832788",
    appId: "1:873354832788:web:41105e10dd0f7651607d81",
    measurementId: "G-LFFLPT7G58"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to HTML elements
const eventSelect = document.getElementById('event-select');
const studentTableBody = document.getElementById('student-table-body');
const studentCountDisplay = document.getElementById('student-count'); // Reference to the count display

// Function to fetch events and populate dropdown
async function fetchEvents() {
    try {
        const snapshot = await database.ref('events').once('value');
        const events = snapshot.val();

        // Clear previous options
        eventSelect.innerHTML = ''; // Clear previous options

        // Add a default "Please select an event" option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an event';
        eventSelect.appendChild(defaultOption);

        // Populate dropdown with event options
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

// Function to fetch and display students signed up for the selected event
async function fetchAndDisplayStudents(eventField) {
    studentTableBody.innerHTML = ''; // Clear previous table rows
    studentCountDisplay.textContent = '0'; // Reset count display

    // If no event is selected, return early
    if (!eventField) {
        return;
    }

    try {
        // Fetch the specific event data to get the capacity
        const eventSnapshot = await database.ref(`events/${eventField}`).once('value');
        const eventData = eventSnapshot.val();

        if (eventData) {
            const capacity = eventData.capacity; // Get the event capacity
            console.log(`Event Capacity for ${eventField}:`, capacity); // Log capacity
        } else {
            console.log(`No event data found for ${eventField}`);
            return; // Exit if no event data
        }

        const snapshot = await database.ref('students').once('value');
        const students = snapshot.val();
        let studentCount = 0; // Counter for students signed up

        // Loop through the users and display those who signed up for the selected event
        for (const userKey in students) {
            const user = students[userKey];

            // Check if the user has a signup_list and if it contains the selected event
            // Now checking if the event exists as a key in the signup_list object
            if (user.signup_list && user.signup_list.hasOwnProperty('0') && user.signup_list['0'] === eventField) {
                addStudentRow(userKey, user); // Add the user to the table if signed up
                studentCount++; // Increment the counter
            }
        }

        // Update the total count display
        studentCountDisplay.textContent = `${studentCount}`; // Update to show total signed up
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to add a row for each signed-up student in the table
function addStudentRow(userKey, user) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    const link = document.createElement('a'); // Create a link element

    link.textContent = user.name; // Set the text to the student's name
    link.href = `studentDetails.html?userId=${userKey}`; // Set the href to the details page with userKey as a query parameter
    link.style.color = 'inherit'; // Keep the link color the same as the text
    link.style.textDecoration = 'none'; // Remove underline from the link

    cell.appendChild(link); // Append the link to the cell
    row.appendChild(cell); // Append the cell to the row
    studentTableBody.appendChild(row); // Append the row to the table body
}

// Event listener for when the dropdown value changes
eventSelect.addEventListener('change', (event) => {
    const selectedEvent = event.target.value;
    fetchAndDisplayStudents(selectedEvent); // Fetch and display students for the selected event
});

// Call fetchEvents on page load
window.onload = () => {
    fetchEvents(); // Fetch events when the page loads
    const urlParams = new URLSearchParams(window.location.search);
    const eventFromUrl = urlParams.get('event'); // Get the event parameter from the URL

    if (eventFromUrl) {
        eventSelect.value = eventFromUrl; // Set the dropdown to the specific event
        fetchAndDisplayStudents(eventFromUrl); // Fetch students for that event
    }
};
