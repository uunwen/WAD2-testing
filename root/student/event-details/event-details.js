/// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Firestore separately
const database = getDatabase(app);
const db = getFirestore(app);

// Helper to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Call this function to load event details and other data when needed
window.onload = () => {
    const eventKey = getQueryParam("eventKey"); // Dynamically get the eventKey from the URL
    if (eventKey) {
        displayEventDetails();  // Load event details
    } else {
        console.warn("Event key not found in URL.");
    }

    // Load default tab (details)
    showTab('details');
};

// Function to load event details into the details tab
function displayEventDetails() {
    const eventKey = getQueryParam("eventKey");
    if (!eventKey) {
        document.getElementById("eventDetailsContainer").innerHTML = "<p>Event not found.</p>";
        return;
    }

    const dbRef = ref(database, `events/${eventKey}`);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Set Project Name above the navbar
            document.getElementById("eventTitle").textContent = data["Project Name"];

            const eventContent = document.getElementById("eventContent");
            eventContent.innerHTML = "";  // Clear previous content

            for (const key in data) {
                // Ensure key is valid and exclude specific keys, including Photos
                if (data.hasOwnProperty(key) && key !== "signups" && key !== "Project Name" && key !== "Photos") {
                    const card = document.createElement("div");
                    card.className = "card";

                    // Set dynamic link for the 'Organiser' section
                    if (key === 'Organiser') {
                        const organiserName = data[key];
                        card.innerHTML = `<strong>Organiser:</strong> <a href="#">${organiserName}</a>`;
                        const organiserLink = card.querySelector('a');

                        // Get the sponsorKey for dynamic linking
                        findSponsorKey(organiserName).then(sponsorKey => {
                            organiserLink.href = sponsorKey ? `../sponsor-details/sponsor-details.html?sponsorKey=${sponsorKey}` : "#";
                        });
                    } else {
                        card.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
                    }
                    eventContent.appendChild(card);
                }
            }

            // Add buttons to switch tabs
            const buttonContainer = document.querySelector('.button-container');
            buttonContainer.innerHTML = "";

            const signupButton = document.createElement("button");
            signupButton.textContent = "Sign Up";
            signupButton.className = "signup-button";
            const signupLink = `../event-signup/signup-form.html?eventKey=${eventKey}&eventName=${encodeURIComponent(data["Project Name"])}`;

            signupButton.onclick = () => {
                window.location.href = signupLink;
            };
            buttonContainer.appendChild(signupButton);
        } else {
            document.getElementById("eventDetailsContainer").innerHTML = "<p>Event details not available.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching event details:", error);
        document.getElementById("eventDetailsContainer").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}


// Helper function to find sponsor key
function findSponsorKey(organiserName) {
    const sponsorsRef = ref(database, 'sponsors');
    return get(sponsorsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const sponsors = snapshot.val();
            for (const sponsorKey in sponsors) {
                if (sponsors[sponsorKey].org_name === organiserName) {
                    return sponsorKey;
                }
            }
        }
        return null;
    }).catch((error) => {
        console.error("Error fetching sponsor details:", error);
        return null;
    });
}


// Function to load and display event photos from Realtime Database
async function displayEventPhotos() {
    const eventKey = getQueryParam("eventKey");
    if (!eventKey) {
        console.error('Event key is missing in the URL.');
        document.getElementById("photo-gallery").innerHTML = "<p>No event specified.</p>";
        return;
    }

    try {
        console.log("Fetching photos for event:", eventKey); // Debug log
        const photoRef = ref(database, `events/${eventKey}/Photos`);
        const snapshot = await get(photoRef);

        if (snapshot.exists()) {
            const photos = snapshot.val();
            console.log("Photos fetched:", photos); // Log to inspect photo data structure

            const photoGallery = document.getElementById('photo-gallery');
            photoGallery.innerHTML = ''; // Clear existing content

            // Access each individual photo URL
            Object.keys(photos).forEach(photoIndex => {
                const photoUrl = photos[photoIndex]; // Access each photo by its index
                const imgElement = document.createElement('img');
                imgElement.src = photoUrl;
                imgElement.alt = `Event Photo ${photoIndex}`;

                // Style the image element
                imgElement.style.width = '100%';
                imgElement.style.height = '300px';
                imgElement.style.objectFit = 'cover';
                imgElement.style.borderRadius = '8px';
                imgElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

                photoGallery.appendChild(imgElement);
            });
        } else {
            document.getElementById('photo-gallery').innerHTML = '<p>No photos available for this event.</p>';
        }
    } catch (error) {
        console.error('Error fetching photos:', error);
        document.getElementById('photo-gallery').innerHTML = `<p>Error fetching photos: ${error.message}</p>`;
    }
}




// Load the photos tab when the Photos section is activated
document.getElementById('photosTab').addEventListener('click', () => {
    showTab('photos');
    displayEventPhotos();
});

// Event listener setup
document.addEventListener("DOMContentLoaded", () => {
    const detailsTab = document.getElementById("detailsTab");
    const photosTab = document.getElementById("photosTab");

    detailsTab.addEventListener("click", () => {
        showTab("details");
        // Add active class to detailsTab and remove from others
        detailsTab.classList.add("active");
        photosTab.classList.remove("active");
    });

    photosTab.addEventListener("click", () => {
        showTab("photos");
        // Add active class to photosTab and remove from others
        photosTab.classList.add("active");
        detailsTab.classList.remove("active");
    });

    // Load default tab on page load
    showTab("details");
    detailsTab.classList.add("active"); // Make detailsTab active by default
});
// Function to toggle between tabs
function showTab(tabName) {
    const detailsContainer = document.getElementById("eventDetailsContainer");
    const photosContainer = document.getElementById("photosSection");

    detailsContainer.style.display = (tabName === "details") ? "block" : "none";
    photosContainer.style.display = (tabName === "photos") ? "block" : "none";

    if (tabName === "details") {
        displayEventDetails();  // Ensure event details reload if switched to details
    } else if (tabName === "photos") {
        displayEventPhotos();  // Load photos when "photos" tab is active
    }
}




// Load default tab
window.onload = () => {
    showTab('details');  // Show details tab on load
};
