// Initialize Firebase (Make sure to replace with your actual config)
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
const db = firebase.firestore();

// Function to fetch event data from Firestore
async function fetchEventData() {
    const eventsSnapshot = await db.collection('events').get();
    const eventData = {};
    
    eventsSnapshot.forEach(doc => {
        const data = doc.data();
        eventData[doc.id] = {
            projectName: data.projectName,
            signups: data.signups || {}
        };
    });

    return eventData;
}

// Create the bar chart
async function createBarChart() {
    const events = await fetchEventData();
    
    // Prepare data for the chart
    const labels = Object.values(events).map(event => event.projectName); // Project names
    const dataValues = labels.map(label => Object.keys(events[label]).length); // Count signups

    const ctx = document.getElementById('signupChart').getContext('2d');
    const signupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Sign-Ups',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Sign-Ups'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Project Names'
                    }
                }
            }
        }
    });
}

// Call the function to create the chart
createBarChart();
