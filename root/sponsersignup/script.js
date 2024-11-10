// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Realtime Database
const database = firebase.database();

// Get the sponsor UID from the URL
const urlParams = new URLSearchParams(window.location.search);
const sponsorUID = urlParams.get('uid');

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Elements from the DOM
    const eventSelect = document.getElementById('event-select');
    const studentTableBody = document.getElementById('student-table-body');
    const studentCounter = document.getElementById('student-counter'); // Element to display student count
    const eventCapacity = document.getElementById('event-capacity'); // Element to display event capacity

    // Function to fetch and display students for a specific event
    function fetchStudentsForEvent(eventKey) {
        studentTableBody.innerHTML = ''; // Clear previous data immediately
        studentCounter.textContent = '0'; // Reset the student counter
        eventCapacity.textContent = '';
        let studentCount = 0;
        let capacity = 0;

        // Fetch student sign-ups
        database.ref('events/' + eventKey + '/signups').once('value', function(snapshot) { 
            const signups = snapshot.val();
            if (!signups) {
                console.log('No students found for this event.');
                studentCounter.textContent = ` 0`;
                studentCount = 0;
            } else {
                studentTableBody.innerHTML = ''; // Clear previous data
                for (const studentKey in signups) {
                    const student = signups[studentKey];
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${student.name}</td><td>${student.email}</td><td>${student.telegram}</td>`;
                    studentTableBody.appendChild(row);
                    studentCount++;
                }
                studentCounter.textContent = ` ${studentCount}`;
            }

            // Check if capacity has been fetched before updating the chart
            if (capacity > 0) {
                console.log('Calling updatePieChart with:', { studentCount, capacity });
                updatePieChart(studentCount, capacity);
            }
        }, function(error) {
            console.error('Error fetching student data: ', error);
        });

        // Fetch event capacity
        database.ref('events/' + eventKey).once('value', function(snapshot) {
            const event = snapshot.val();
            if (event && event.Capacity) {
                capacity = event.Capacity;
                eventCapacity.textContent = ` ${capacity}`;
            } else {
                console.error('Capacity not found for event.');
                capacity = 0;
            }

            // Check if student count has been fetched before updating the chart
            if (studentCount >= 0) {
                console.log('Calling updatePieChart with:', { studentCount, capacity });
                updatePieChart(studentCount, capacity);
            }
        }, function(error) {
            console.error('Error fetching event capacity: ', error);
        });
    }

    // Function to fetch the sponsor org_name based on UID
    function fetchSponsorOrgName(uid) {
        database.ref('sponsors/' + uid).once('value', function(snapshot) {
            const sponsor = snapshot.val();
            if (sponsor) {
                const orgName = sponsor.org_name; // Get the org_name of the sponsor
                fetchEvents(orgName); // Fetch events based on org_name
            } else {
                console.error('Sponsor not found for UID: ' + uid);
            }
        }, function(error) {
            console.error('Error fetching sponsor data: ', error);
        });
    }

    // Function to fetch events and filter by Organiser
    function fetchEvents(orgName) {
        database.ref('events').once('value', function(snapshot) {
            const events = snapshot.val();
            if (!events) {
                console.log('No events found in the database.');
                return;
            }

            // Clear previous options in the dropdown
            eventSelect.innerHTML = `<option value="">-- Select an event --</option>`;

            // Iterate through events and check if Organiser matches the orgName
            for (const eventKey in events) {
                if (events.hasOwnProperty(eventKey)) {
                    const event = events[eventKey];
                    const organiser = event.Organiser;
                    
                    // If the event's Organiser matches the sponsor's org_name, add it to the dropdown
                    if (organiser === orgName) {
                        const option = document.createElement('option');
                        option.value = eventKey;
                        option.textContent = event["Project Name"];
                        eventSelect.appendChild(option);
                    }
                }
            }
        }, function(error) {
            console.error('Error fetching events data: ', error);
        });
    }

    // Event listener for dropdown selection change
    eventSelect.addEventListener('change', function() {
        const selectedEvent = eventSelect.value;
        if (selectedEvent) {
            fetchStudentsForEvent(selectedEvent); // Fetch and display students for the selected event
        } else {
            // Clear the student table if no event is selected
            studentTableBody.innerHTML = '';
            studentCounter.textContent = ''; // Clear the student counter
            eventCapacity.textContent = ''; // Clear the event capacity
        }
    });

    // Fetch the sponsor org_name and events when the page loads
    if (sponsorUID) {
        fetchSponsorOrgName(sponsorUID);
    } else {
        console.error('Sponsor UID not found in URL.');
    }
});

// Function to update the pie chart
function updatePieChart(studentCount, capacity) {
    console.log('updatePieChart received:', { studentCount, capacity }); // Log parameters
    capacity = parseInt(capacity); 

    if (isNaN(capacity)) {
        console.error("Capacity is not a valid number.");
        return; // Exit the function if capacity is invalid
    }

    const signupCapacityChart = document.getElementById('signup-capacity-chart').getContext('2d');
    
    if (window.myPieChart) {
        window.myPieChart.data.datasets[0].data = [studentCount, capacity - studentCount];
        window.myPieChart.update();
    } else {
        window.myPieChart = new Chart(signupCapacityChart, {
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
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const signedUp = studentCount;
                                const remaining = capacity - studentCount;
                                return tooltipItem.raw === signedUp ? 
                                    `Total Students Signed Up: ${signedUp} ` :
                                    `Remaining Capacity: ${remaining}`;
                            }
                        }
                    }
                }
            }
        });
    }
}
