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


window.initMap = function () {
    // Check if geolocation is supported and enabled
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Create the map centered on the user's current location
            const map = new google.maps.Map(document.getElementById("eventMap"), {
                center: { lat: userLat, lng: userLng }, // Center the map on user's location
                zoom: 12,
            });

            // Add a marker for the user's current location
            const userMarker = new google.maps.Marker({
                position: { lat: userLat, lng: userLng },
                map: map,
                title: "Your Current Location", // Title to show when you hover over the marker
            });

            // Add a marker for the event location (using example coordinates)
            const eventCoordinates = { lat: 1.3521, lng: 103.8198 };  // Replace with actual event coordinates
            const eventMarker = new google.maps.Marker({
                position: eventCoordinates,
                map: map,
                title: "Event Location",
            });

            // Set up Directions Service and Renderer
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true, // Do not show default markers for start and end
            });

            // Function to calculate and display the route
            const calculateRoute = () => {
                const request = {
                    origin: { lat: userLat, lng: userLng }, // User's current location
                    destination: eventCoordinates,  // Event location
                    travelMode: google.maps.TravelMode.DRIVING,  // You can also use WALKING, BICYCLING, or TRANSIT
                };

                directionsService.route(request, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);  // Display the route on the map
                    } else {
                        alert("Directions request failed due to " + status);
                    }
                });
            };

            // Automatically calculate the route when the map is loaded
            calculateRoute();

            // Optionally, you can add a button for users to recalculate the route
            const recalculateRouteBtn = document.createElement("button");
            recalculateRouteBtn.textContent = "Recalculate Route";
            recalculateRouteBtn.className = "btn btn-secondary btn-sm button-with-margin";
            recalculateRouteBtn.onclick = calculateRoute;

            document.getElementById("mapContainer").appendChild(recalculateRouteBtn);

        }, (error) => {
            // If geolocation fails (e.g., permissions denied), show an alert
            alert("Geolocation service failed. Please enable location access.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
};





// Helper to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


// Function to create the "View on Map" button for each event
function createViewOnMapButton(coordinates) {
    const viewMapBtn = document.createElement("button");
    viewMapBtn.textContent = "View on Map";
    viewMapBtn.className = "btn btn-primary btn-sm button-with-margin";
    viewMapBtn.style.marginTop = "15px";
    viewMapBtn.style.marginBottom = "20px"; // Add margin-bottom for vertical space

    // Add event listener to display map when clicked
    viewMapBtn.onclick = () => {
        if (coordinates) {
            const [lat, lng] = coordinates.split(", ").map(Number);

            // Show the map container
            const mapContainer = document.getElementById("mapContainer");
            mapContainer.style.display = "block";

            // Initialize the map
            const map = new google.maps.Map(document.getElementById("eventMap"), {
                center: { lat, lng },
                zoom: 15,
            });

            // Add a marker to the map
            new google.maps.Marker({
                position: { lat, lng },
                map: map,
            });

            // Check for and create the "Close Map" button if not already present
            if (!mapContainer.querySelector('.close-map-button')) {
                const closeMapBtn = document.createElement("button");
                closeMapBtn.textContent = "Close Map";
                closeMapBtn.className = "btn btn-secondary btn-sm close-map-button";
                closeMapBtn.onclick = () => {
                    mapContainer.style.display = "none";
                };
                mapContainer.appendChild(closeMapBtn);
            }
        } else {
            alert("Coordinates are not available.");
        }
    };

    return viewMapBtn;
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



// Function to toggle between tabs
function showTab(tabName) {
    const detailsContainer = document.getElementById("eventDetailsContainer");
    const photosContainer = document.getElementById("photosSection");

    detailsContainer.style.display = (tabName === "details") ? "block" : "none";
    photosContainer.style.display = (tabName === "photos") ? "block" : "none";

    if (tabName === "details" && !detailsContainer.hasChildNodes()) {
        displayEventDetails();  // Ensure event details are loaded only once
    } else if (tabName === "photos") {
        displayEventPhotos();  // Load photos when "photos" tab is active
    }
}

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
            document.getElementById("eventTitle").textContent = data["Project Name"];
            const eventContent = document.getElementById("eventContent");
            eventContent.innerHTML = ""; // Clear previous content

            // Process the "Organiser" key outside the loop
            const organiserName = data["Organiser"];
            if (organiserName) {
                // Fetch sponsorKey for the organiser
                findSponsorKey(organiserName).then((sponsorKey) => {
                    const link = document.createElement("a");
                    link.href = `../sponsor-details/sponsor-details.html?sponsorKey=${sponsorKey}`;
                    link.style.textDecoration = "underline"; // Apply underline style
                    link.className = "organiser-card"; // Add the class
                    link.textContent = organiserName; // Set the text content of the link

                    const organiserCard = document.createElement("div");
                    organiserCard.className = "card";
                    const organiserLabel = document.createElement("strong");
                    organiserLabel.textContent = "Organiser: ";
                    organiserCard.appendChild(organiserLabel);
                    organiserCard.appendChild(link);
                    eventContent.appendChild(organiserCard); // Append the organiser card

                    // Now process the rest of the event details
                    processEventDetails(data, eventContent); // Call function to process remaining fields
                }).catch((error) => {
                    console.error("Error fetching sponsor key:", error);
                });
            } else {
                // If no "Organiser", process the rest of the details immediately
                processEventDetails(data, eventContent);
            }

        } else {
            document.getElementById("eventDetailsContainer").innerHTML = "<p>Event details not available.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching event details:", error);
        document.getElementById("eventDetailsContainer").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

// Helper function to process event details (other than the "Organiser")
function processEventDetails(data, eventContent) {
    for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "Organiser" && key !== "signups" && key !== "Project Name" && key !== "photoURL" && key !== "Photos" && key !== "Status" && key !== "Coordinates") {
            const card = document.createElement("div");
            card.className = "card";

            const label = document.createElement("strong");
            label.textContent = `${key}: `;
            card.appendChild(label);
            card.appendChild(document.createTextNode(data[key])); // Add text directly
            eventContent.appendChild(card); // Append the card
        }
    }

    // Add the "View on Map" button if coordinates are available
    if (data["Coordinates"]) {
        const viewMapBtn = createViewOnMapButton(data["Coordinates"]);
        eventContent.appendChild(viewMapBtn);
    }

    // Add the "Sign Up" button
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.innerHTML = ""; // Clear previous content
    const signupButton = document.createElement("button");
    signupButton.textContent = "Sign Up";
    signupButton.className = "signup-button button-with-margin";
    const signupLink = `../event-signup/signup-form.html?eventKey=${getQueryParam("eventKey")}&eventName=${encodeURIComponent(data["Project Name"])}`;
    signupButton.onclick = () => {
        window.location.href = signupLink;
    };
    buttonContainer.appendChild(signupButton);
}

// Function to load and display event photos from Firestore
async function displayEventPhotos() {
    const eventKey = getQueryParam("eventKey");
    if (!eventKey) {
        console.error('Event key is missing in the URL.');
        document.getElementById("photo-gallery").innerHTML = "<p>No event specified.</p>";
        return;
    }

    try {
        const projectName = document.getElementById("eventTitle").textContent;
        if (!projectName) {
            console.error('Project name not found.');
            document.getElementById("photo-gallery").innerHTML = "<p>Project name not available.</p>";
            return;
        }

        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("Project Name", "==", projectName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const photos = data.Photos;

                if (photos && Array.isArray(photos)) {
                    const photoGallery = document.getElementById('photo-gallery');
                    photoGallery.innerHTML = ''; // Clear existing content

                    // Append each photo directly into the grid container
                    photos.forEach(photoUrl => {
                        const imgElement = document.createElement('img');
                        imgElement.src = photoUrl;
                        imgElement.alt = 'Event Photo';

                        // Apply CSS directly to the image element
                        imgElement.style.width = '100%';  // Ensures the image fits the card width
                        imgElement.style.height = '300px'; // Sets a fixed height for all images
                        imgElement.style.objectFit = 'cover'; // Ensures the image covers the space without distortion
                        imgElement.style.borderRadius = '8px'; // Optional rounded corners
                        imgElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Optional shadow for styling

                        photoGallery.appendChild(imgElement);
                    });
                } else {
                    document.getElementById('photo-gallery').innerHTML = '<p>No photos available for this event.</p>';
                }
            });
        } else {
            document.getElementById('photo-gallery').innerHTML = '<p>No matching event found.</p>';
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