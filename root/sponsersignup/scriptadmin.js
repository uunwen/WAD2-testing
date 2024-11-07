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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to display list of students with links to the details page
async function displayStudentList(eventId) {
    try {
        const eventRef = database.ref('events/' + eventId + '/signups');
        const snapshot = await eventRef.once('value');
        const students = snapshot.val();

        const studentListDiv = document.getElementById('student-list');
        studentListDiv.innerHTML = '';

        // Loop through each student and create a clickable link
        for (const userId in students) {
            const student = students[userId];
            const studentLink = document.createElement('a');
            studentLink.href = `studentDetails.html?userId=${userId}&eventId=${eventId}`; // Pass userId and eventId
            studentLink.innerText = student.name;
            studentLink.classList.add('student-link'); // Optional styling
            studentListDiv.appendChild(studentLink);
            studentListDiv.appendChild(document.createElement('br'));
        }
    } catch (error) {
        console.error("Error displaying student list:", error);
    }
}

// Example call to displayStudentList with a specific eventId
// Replace `eventId` with the actual event ID you want to use
const exampleEventId = "your-event-id"; // Replace with actual event ID
displayStudentList(exampleEventId);
