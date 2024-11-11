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

// Helper function to retrieve query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to display sponsor details and associated projects
async function displaySponsorDetails() {
    const sponsorKey = getQueryParam("sponsorKey");
    if (!sponsorKey) {
        document.getElementById("sponsorDetails").innerHTML = "<p>Sponsor not found.</p>";
        return;
    }

    // Reference to the sponsor in the database
    const dbRef = ref(database, `sponsors/${sponsorKey}`);
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Set sponsor title as org_name
            document.getElementById("sponsorTitle").textContent = data["org_name"];

            // Display additional sponsor details
            const sponsorDetailsContainer = document.getElementById("sponsorDetails");
            sponsorDetailsContainer.innerHTML = "";

            // Display About section if it exists
            if (data["org_background"]) {
                const paragraph = document.createElement("p");
                paragraph.innerHTML = `<span style="font-weight:bold; font-size: 1.3em;">About</span><br>&emsp;&emsp;<span>${data["org_background"]}</span>`;
                sponsorDetailsContainer.appendChild(paragraph);
            }

            // Create an unordered list for the project list
            const projectListContainer = document.createElement("div");
            projectListContainer.innerHTML = `<span style="font-weight:bold; font-size: 1.3em;">Project List</span><br>`;

            const ul = document.createElement("ul");
            ul.style.listStyleType = "none"; // Remove bullet points
            ul.style.paddingLeft = "0";  // Align list items to the left
            ul.style.marginLeft = "0";  // Align list items to the left

            // Iterate through all events and check if the organiser matches the sponsor's org_name
            const eventsRef = ref(database, "events");
            const eventsSnapshot = await get(eventsRef);
            if (eventsSnapshot.exists()) {
                const eventsData = eventsSnapshot.val();
                let hasProjects = false; // Flag to check if any projects match the sponsor's org_name

                // Loop through all events to check if organiser matches the sponsor's org_name
                for (const eventId in eventsData) {
                    const eventData = eventsData[eventId];
                    if (eventData.Organiser === data["org_name"]) {
                        const li = document.createElement("li");

                        // Create the link for each project
                        const projectLink = document.createElement("a");
                        projectLink.href = `../event-details/event-details.html?eventKey=${eventId}`;
                        projectLink.textContent = eventData["Project Name"] || "Unnamed Project"; // Display event's project name

                        // Append the link to the list item
                        li.appendChild(projectLink);
                        ul.appendChild(li); // Add the list item to the unordered list
                        hasProjects = true; // Set flag to true if a project is found
                    }
                }

                // If no projects are found, log and display a message to the user
                if (!hasProjects) {
                    console.log(`No projects found for sponsor: ${data["org_name"]}`);
                    const noProjectsMessage = document.createElement("p");
                    noProjectsMessage.textContent = `No projects found for ${data["org_name"]}.`;
                    sponsorDetailsContainer.appendChild(noProjectsMessage);
                }

                // Append the unordered list to the project list container
                projectListContainer.appendChild(ul);
                sponsorDetailsContainer.appendChild(projectListContainer);
            } else {
                console.error("No events found.");
            }
        } else {
            document.getElementById("sponsorDetails").innerHTML = "<p>Sponsor details not available.</p>";
        }
    } catch (error) {
        console.error("Error fetching sponsor details:", error);
        document.getElementById("sponsorDetails").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

window.onload = displaySponsorDetails;
