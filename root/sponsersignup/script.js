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
const eventInput = document.getElementById('event-input'); // Search bar for event name
const studentTableBody = document.getElementById('student-table-body');
const studentCountDisplay = document.getElementById('student-count'); // Reference to the count display
const searchButton = document.getElementById('search-button'); // Search button

// Function to fetch and display students based on the event name
async function fetchAndDisplayStudents(eventName) {
    studentTableBody.innerHTML = ''; // Clear previous table rows
    studentCountDisplay.textContent = '0'; // Reset count display
    console.log('Fetching data for event name:', eventName);

    try {
        const snapshot = await database.ref('students').once('value');
        const students = snapshot.val();
        console.log('Fetched students data:', students); // Log the entire student data

        let studentCount = 0; // Counter for students signed up

        // Loop through the users and display those who signed up for the entered event name
        for (const userKey in students) {
            const user = students[userKey];
            console.log('User:', user); // Log each user

            // Check if the user has signed up for the event by looking for the event name in the signup_list
            if (user.signup_list && user.signup_list.includes(eventName)) {
                console.log(`User signed up: ${user.name}`); // Log student name
                addStudentRow(userKey, user); // Pass both the key and data to add row
                studentCount++; // Increment the counter
            }
        }

        // Update the total count display
        studentCountDisplay.textContent = studentCount;

        if (studentCount === 0) {
            console.log(`No students signed up for ${eventName}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to add a row to the student table
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

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const eventName = eventInput.value.trim(); // Get the trimmed value from the input
    console.log(`Searching for event: ${eventName}`); // Log the event name
    if (eventName) {
        fetchAndDisplayStudents(eventName); // Fetch and display students for the entered event name
    } else {
        console.log('Please enter an event name.'); // Log if no event name is provided
    }
});

// Call fetchEvents on page load (if needed, depending on your logic)
// window.onload = () => {
//     fetchEvents(); // Fetch events when the page loads (uncomment if you want this)
// };
