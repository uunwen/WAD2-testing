// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
    authDomain: "wad-proj-2b37f.firebaseapp.com",
    databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad-proj-2b37f",
    storageBucket: "wad-proj-2b37f.appspot.com",
    messagingSenderId: "873354832788",
    appId: "1:873354832788:web:41105e10dd0f7651607d81",
    measurementId: "G-LFFLPT7G58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Helper to retrieve query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Display event details
function displayEventDetails() {
    const eventKey = getQueryParam("eventKey");
    if (!eventKey) {
        document.getElementById("eventDetails").innerHTML = "<p>Event not found.</p>";
        return;
    }

    const dbRef = ref(database, `events/${eventKey}`);
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById("eventTitle").textContent = data["Project Name"];
                const eventDetailsContainer = document.getElementById("eventDetails");
                eventDetailsContainer.innerHTML = "";

                for (const key in data) {
                    if (data.hasOwnProperty(key) && key !== "Project Name") {
                        const paragraph = document.createElement("p");

                        // If the key is 'Organiser', create a link
                        if (key === 'Organiser') {
                            const organiserName = data[key];
                            paragraph.innerHTML = `<strong>Organiser:</strong> `;
                            const organiserLink = document.createElement('a');
                            organiserLink.textContent = organiserName;
                            organiserLink.style.textDecoration = 'underline';
                            organiserLink.style.color = 'blue';

                            // Find sponsorKey based on organiser name
                            findSponsorKey(organiserName).then(sponsorKey => {
                                organiserLink.href = sponsorKey
                                    ? `http://localhost/WAD2-testing/root/student/sponsor-details/sponsor-details.html?sponsorKey=${sponsorKey}`
                                    : "#"; // Set a fallback if no sponsorKey found
                            });

                            paragraph.appendChild(organiserLink);
                        } else {
                            paragraph.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
                        }
                        eventDetailsContainer.appendChild(paragraph);
                    }
                }

                // Add a "Sign Up" button with a dynamic link
                const signupButton = document.createElement("button");
                signupButton.textContent = "Sign Up";
                signupButton.className = "signup-button"; // Add the styling class

                // Link to a signup form page for this specific event
                const signupLink = `http://localhost/WAD2-testing/root/student/event-signup/signup-form.html?eventKey=${eventKey}&eventName=${encodeURIComponent(data["Project Name"])}`;
                signupButton.onclick = () => {
                    window.location.href = signupLink;
                };

                // Append the Sign Up button to the event details container
                document.querySelector('.button-container').appendChild(signupButton);
            } else {
                document.getElementById("eventDetails").innerHTML = "<p>Event details not available.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching event details:", error);
            document.getElementById("eventDetails").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Updated findSponsorKey function using 'org_name'
function findSponsorKey(organiserName) {
    const sponsorsRef = ref(database, 'sponsors');
    return get(sponsorsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const sponsors = snapshot.val();
                for (const sponsorKey in sponsors) {
                    if (sponsors[sponsorKey].org_name === organiserName) {
                        return sponsorKey;
                    }
                }
            }
            return null;
        })
        .catch((error) => {
            console.error("Error fetching sponsor details:", error);
            return null;
        });
}

window.onload = displayEventDetails;
