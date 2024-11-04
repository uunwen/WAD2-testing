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

const eventsRef = database.ref('events');

// Function to fetch events and their student sign-ups
async function fetchEventSignUps() {
    try {
        const snapshot = await eventsRef.once('value');
        const events = snapshot.val();
        const eventNames = [];
        const signUpCounts = [];
        const eventKeys = []; // Store the event keys for linking

        for (const eventKey in events) {
            const signUps = await database.ref(`students`).once('value');
            const students = signUps.val();
            let count = 0;

            // Count the number of students signed up for the current event
            for (const userKey in students) {
                if (students[userKey].signup_list && students[userKey].signup_list.includes(events[eventKey]["Project Name"])) {
                    count++;
                }
            }

            eventNames.push(events[eventKey]["Project Name"]); // Get the project name
            signUpCounts.push(count); // Add count to the array
            eventKeys.push(eventKey); // Store the event key
        }

        createChart(eventNames, signUpCounts, eventKeys);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to create the pie chart
function createChart(eventNames, signUpCounts, eventKeys) {
    const ctx = document.getElementById('signupChart').getContext('2d');
    const colors = [
        'rgba(255, 99, 132, 0.6)', // Red
        'rgba(54, 162, 235, 0.6)', // Blue
        'rgba(255, 206, 86, 0.6)', // Yellow
        'rgba(75, 192, 192, 0.6)', // Teal
        'rgba(153, 102, 255, 0.6)', // Purple
        'rgba(255, 159, 64, 0.6)', // Orange
        'rgba(201, 203, 207, 0.6)', // Grey
        'rgba(255, 99, 71, 0.6)', // Tomato
        'rgba(0, 128, 0, 0.6)', // Green
        'rgba(100, 149, 237, 0.6)', // Cornflower Blue
        'rgba(255, 20, 147, 0.6)', // Deep Pink
        'rgba(255, 105, 180, 0.6)', // Hot Pink
        'rgba(210, 180, 140, 0.6)', // Tan
        'rgba(0, 0, 255, 0.6)', // Blue
        'rgba(255, 0, 255, 0.6)', // Magenta
    ];

    // Ensure the number of colors is equal to the number of events
    const datasetColors = colors.slice(0, eventNames.length);

    const signupChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: eventNames,
            datasets: [{
                label: 'Number of Students Signed Up',
                data: signUpCounts,
                backgroundColor: datasetColors,
                borderColor: datasetColors.map(color => color.replace('0.6', '1')), // Make border color fully opaque
                borderWidth: 1
            }]
        },
        options: {
            onClick: (evt) => {
                const activePoints = signupChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
                if (activePoints.length) {
                    const firstPoint = activePoints[0];
                    const eventName = eventNames[firstPoint.index]; // Get the corresponding event name
                    const eventKey = eventKeys[firstPoint.index]; // Get the corresponding event key

                    // Pass the event name into the URL and redirect
                    window.location.href = `index.html?eventKey=${eventKey}&eventName=${encodeURIComponent(eventName)}`; // Navigate to index.html with eventKey and eventName
                }
            }
        }
    });
}

// Call fetchEventSignUps on page load
window.onload = () => {
    fetchEventSignUps(); // Fetch event sign-ups when the page loads
};
