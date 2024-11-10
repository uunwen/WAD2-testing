// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
    authDomain: "wad-proj-2b37f.firebaseapp.com",
    databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app", // Full URL here
    projectId: "wad-proj-2b37f",
    storageBucket: "wad-proj-2b37f.appspot.com",
    messagingSenderId: "873354832788",
    appId: "1:873354832788:web:41105e10dd0f7651607d81",
    measurementId: "G-LFFLPT7G58"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const eventsRef = database.ref('events');

// Function to fetch events and their student sign-ups
async function fetchEventSignUps() {
    try {
        const snapshot = await eventsRef.once('value');
        const events = snapshot.val();
        const eventNames = [];
        const signUpCounts = [];
        const eventKeys = []; // Store the event keys for linking

        // Iterate through each event
        for (const eventKey in events) {
            const event = events[eventKey];
            const signUps = event.signups || {}; // Get the sign-ups for this event (empty object if no signups)
            
            const count = Object.keys(signUps).length; // Count the number of students who signed up
            eventNames.push(event["Project Name"]); // Get the project name
            signUpCounts.push(count); // Add count to the array
            eventKeys.push(eventKey); // Store the event key
        }
        
        createChart(eventNames, signUpCounts, eventKeys);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Generate dynamic colors based on the number of events
function generateColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
}

// Function to create the bar chart
function createChart(eventNames, signUpCounts, eventKeys) {
    const ctx = document.getElementById('signupChart').getContext('2d');
    const colors = generateColors(eventNames.length); // Generate colors based on the number of events

    const signupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventNames,
            datasets: [{
                label: 'Number of Students Signed Up',
                data: signUpCounts,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.6', '1')), // Make border color fully opaque
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Enable responsiveness
            maintainAspectRatio: false, // Allow chart to adjust to canvas size
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            },
            onClick: (evt) => {
                const activePoints = signupChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
                if (activePoints.length) {
                    const firstPoint = activePoints[0];
                    const eventKey = eventKeys[firstPoint.index]; // Get the corresponding event key
                    // Pass the event key into the URL and redirect to indexadmin.html
                    window.location.href = `indexadmin.html?eventKey=${eventKey}`; // Navigate to indexadmin.html with eventKey
                }
            }
        }
    });
}

// Call fetchEventSignUps on page load
window.onload = () => {
    fetchEventSignUps(); // Fetch event sign-ups when the page loads
};
