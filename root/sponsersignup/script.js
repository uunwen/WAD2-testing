// Firebase configuration (keep this as it is in your project)
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
const eventCapacityDisplay = document.getElementById('event-capacity');
const signupCapacityChart = document.getElementById('signupCapacityChart');

// Ensure the elements are properly loaded
if (!eventSelect || !studentTableBody || !studentCountDisplay || !signupCapacityChart) {
    console.error('One or more essential elements are missing in the HTML!');
}

// Function to get the UID from the URL
function getUIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid'); // Get the uid parameter from the URL
}

// Function to fetch project list for the sponsor and populate dropdown
async function fetchProjectListAndEvents(uid) {
    try {
        console.log(`Fetching project list for sponsor UID: ${uid}`); // Log the UID being used
        const snapshot = await database.ref(`sponsors/${uid}/project_list`).once('value');
        const projectList = snapshot.val();

        // Log the project list retrieved from Firebase
        console.log('Project List from Firebase:', projectList);

        if (!projectList) {
            console.log('No project list found for this sponsor.');
            return;
        }

        // Clear previous options in the dropdown
        eventSelect.innerHTML = '';

        // Add a default "Select Event" option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select an event --';
        eventSelect.appendChild(defaultOption);

        // Loop through each project and create options for the dropdown
        for (const projectKey of projectList) { // Iterate directly over the array
            const projectName = await fetchEventName(projectKey); // Fetch the event name
            const option = document.createElement('option');
            option.value = projectKey; // Use projectKey as the value
            option.textContent = projectName; // Display project name
            eventSelect.appendChild(option);
        }

    } catch (error) {
        console.error('Error fetching project list:', error);
    }
}

// Function to fetch event name for a given project key
async function fetchEventName(projectKey) {
    try {
        const eventSnapshot = await database.ref(`events/${projectKey}`).once('value');
        const eventData = eventSnapshot.val();

        // Return event name if exists
        if (eventData && eventData['Project Name']) {
            console.log(`Event Name for ${projectKey}: ${eventData['Project Name']}`);
            return eventData['Project Name'];
        } else {
            console.log(`No 'Project Name' found for event ${projectKey}`);
            return 'Unknown Event'; // Fallback if no project name found
        }

    } catch (error) {
        console.error(`Error fetching event name for ${projectKey}:`, error);
        return 'Error Fetching Event Name'; // Fallback in case of error
    }
}

// Fetch students based on the selected event
async function fetchAndDisplayStudents(eventKey) {
    if (!studentTableBody || !studentCountDisplay) {
        console.error('Essential elements are missing!');
        return;
    }

    studentTableBody.innerHTML = ''; // Clear previous table rows
    studentCountDisplay.textContent = '0'; // Reset count display

    try {
        // Log the eventKey to the console to show which event ID is being searched for
        console.log(`Searching for students in event with ID: ${eventKey}`);

        // Fetch the selected event data to get signups
        const eventSnapshot = await database.ref(`events/${eventKey}`).once('value');
        const eventData = eventSnapshot.val();

        console.log(`Event Data for ${eventKey}:`, eventData); // Log the event data to console

        if (!eventData || !eventData.signups) {
            console.log('No signups data found for this event.');
            studentCountDisplay.textContent = '0';
            return;
        }

        const signups = eventData.signups;
        const capacity = eventData.Capacity || 0;

        // Update the event capacity display
        eventCapacityDisplay.textContent = `Event Capacity: ${capacity}`;

        // Now, fetch and display the students who signed up for the event
        let studentCount = 0; // Counter for students signed up

        for (const studentKey in signups) {
            const studentData = signups[studentKey];

            // Add student data to the table
            addStudentRow(studentKey, studentData);
            studentCount++; // Increment the counter
        }

        // Update the total count display
        studentCountDisplay.textContent = studentCount;

        // Update the pie chart
        updatePieChart(studentCount, capacity);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Add a row for each student
function addStudentRow(studentID, studentData) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const emailCell = document.createElement('td');
    const telegramCell = document.createElement('td');
    
    const nameLink = document.createElement('a'); // Create a link element
    nameLink.textContent = studentData.name; // Set the text to the student's name
    nameLink.href = `studentDetails.html?userId=${studentID}`; // Set the href to the details page with studentID as a query parameter
    nameLink.style.color = 'inherit'; // Keep the link color the same as the text
    nameLink.style.textDecoration = 'none'; // Remove underline from the link

    nameCell.appendChild(nameLink); // Append the link to the cell
    emailCell.textContent = studentData.email; // Add student's email to email cell
    telegramCell.textContent = studentData.telegram; // Add student's telegram to telegram cell

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(telegramCell);
    studentTableBody.appendChild(row); // Append the row to the table body
}

// Update the pie chart
function updatePieChart(studentCount, capacity) {
    const chart = new Chart(signupCapacityChart, {
        type: 'pie',
        data: {
            labels: ['Signed Up', 'Remaining Capacity'],
            datasets: [{
                data: [studentCount, capacity - studentCount],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            // Customizing the tooltip based on the segment hovered
                            if (tooltipItem.raw === studentCount) {
                                return `Signed Up: ${studentCount} / Total Capacity: ${capacity}`;
                            } else {
                                return `Remaining Capacity: ${capacity - studentCount}`;
                            }
                        }
                    }
                }
            }
        }
    });
}

// Event listener for when the dropdown value changes
eventSelect.addEventListener('change', (event) => {
    const selectedEventKey = event.target.value;

    console.log(`Selected Event Key: ${selectedEventKey}`);

    if (selectedEventKey) {
        fetchAndDisplayStudents(selectedEventKey);
    }
});

// Initialize the page with the project list for the given sponsor UID
const sponsorUID = getUIDFromURL();
if (sponsorUID) {
    fetchProjectListAndEvents(sponsorUID);
} else {
    console.error('Sponsor UID not found in the URL!');
}
