// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
    authDomain: "wad-proj-2b37f.firebaseapp.com",
    databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad-proj-2b37f",
    storageBucket: "wad-proj-2b37f.firebasestorage.app",
    messagingSenderId: "873354832788",
    appId: "1:873354832788:web:41105e10dd0f7651607d81",
    measurementId: "G-LFFLPT7G58"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to fetch events based on sponsor UID
async function fetchEventsByOrganizer(uid) {
    console.log("Fetching events for UID:", uid); // Log the UID

    const sponsorRef = db.collection('sponsors').doc(uid);
    const sponsorDoc = await sponsorRef.get();

    if (!sponsorDoc.exists) {
        console.error("No such sponsor!");
        return [];
    }

    // Get project list and log it
    const projectList = sponsorDoc.data().project_list || [];
    console.log("Project List:", projectList); // Log the entire project list

    // If you want to see the detailed information of each project
    projectList.forEach(project => {
        console.log("Project Name:", project);
    });

    const events = []; // This will hold the event details

    // You can further fetch event details if needed
    // Loop through the project list to fetch event details
    for (const projectName of projectList) {
        // Assuming events are also stored in the 'events' collection
        const eventRef = db.collection('events').where('name', '==', projectName);
        const eventSnapshot = await eventRef.get();

        eventSnapshot.forEach((eventDoc) => {
            if (eventDoc.exists) {
                events.push({
                    id: eventDoc.id,
                    name: eventDoc.data().name // Adjust based on your event data structure
                });
            }
        });
    }

    return events;
}

// Use this function when the page loads
window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');

    if (!uid) {
        console.error("No sponsor UID found in the URL");
        return;
    }

    console.log("Sponsor UID from URL:", uid); // Log the UID from the URL

    const events = await fetchEventsByOrganizer(uid);
    if (events.length === 0) {
        console.log("No events found for this sponsor.");
        document.getElementById("eventContainer").innerText = "No events found for this sponsor.";
        return;
    }

    // Populate the dropdown with events
    const dropdown = document.getElementById("event-select");
    events.forEach(event => {
        const option = document.createElement("option");
        option.value = event.id; // Event ID as the value
        option.textContent = event.name; // Event name as the display text
        dropdown.appendChild(option);
    });
};
