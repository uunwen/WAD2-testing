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
const studentCountDisplay = document.getElementById('student-count');

// Function to get the UID from the URL
function getUIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid'); // Get the uid parameter from the URL
}

// Function to fetch project list for the sponsor and populate dropdown
async function fetchProjectListAndEvents(uid) {
    try {
        const snapshot = await database.ref(`sponsors/${uid}/project_list`).once('value');
        const projectList = snapshot.val();

        

        // Clear previous options
        eventSelect.innerHTML = '';

        // Loop through each project and create options for the dropdown
        for (const projectKey in projectList) {
            const projectName = projectList[projectKey]; // Assuming project name is stored directly
            const option = document.createElement('option');
            option.value = projectKey; // Use projectKey as the value
            option.textContent = projectName; // Display project name
            eventSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching project list:', error);
    }
}

// Fetch students based on the selected event
async function fetchAndDisplayStudents(eventField) {
    studentTableBody.innerHTML = ''; // Clear previous table rows
    studentCountDisplay.textContent = '0'; // Reset count display

    try {
        const snapshot = await database.ref('students').once('value');
        const students = snapshot.val();

        let studentCount = 0; // Counter for students signed up

        // Loop through the users and display those who signed up for the selected event
        for (const userKey in students) {
            const user = students[userKey];

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
        console.error('Error fetching data:', error);
    }
}

// Add a row for each student
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
    fetchAndDisplayStudents(selectedEvent);
});

// Call fetchEvents on page load
window.onload = () => {
    const uid = getUIDFromURL(); // Get the uid from URL
    if (uid) {
        fetchProjectListAndEvents(uid); // Fetch project list for the given uid
    } else {
        console.error('No UID found in URL.');
    }
};
