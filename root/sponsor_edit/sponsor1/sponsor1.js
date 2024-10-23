// // Import Firebase modules from CDN
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
//     authDomain: "wad-proj-2b37f.firebaseapp.com",
//     databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "wad-proj-2b37f",
//     storageBucket: "wad-proj-2b37f.appspot.com",
//     messagingSenderId: "873354832788",
//     appId: "1:873354832788:web:41105e10dd0f7651607d81",
//     measurementId: "G-LFFLPT7G58",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // Log Firebase initialization
// console.log("Firebase initialized:", app);
// console.log("Database initialized:", database);

// // Fetch sponsor data
// function fetchSponsor1Data() {
//     const sponsor1Ref = ref(database, 'sponsors/sponsor1');

//     // Get data from Firebase
//     get(sponsor1Ref)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const sponsorData = snapshot.val();
//                 console.log("Sponsor data fetched successfully:", sponsorData);
//                 displaySponsorData(sponsorData); // Display the fetched sponsor data
//             } else {
//                 document.getElementById("sponsorHeader").innerHTML = '<p>No sponsor data available.</p>';
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching sponsor data:", error.message);
//             document.getElementById("sponsorHeader").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
//         });
// }

// // Display sponsor data
// function displaySponsorData(sponsorData) {
//     const sponsorNameElement = document.getElementById("sponsorHeader");
//     const sponsorStats = document.getElementById("sponsorStats");
//     const iconsRow = document.getElementById("iconsRow");
//     const sponsorDescription = document.getElementById("sponsorDescription");

//     // Set the Sponsor Name and update the page title
//     if (sponsorData['org_name']) {
//         sponsorNameElement.textContent = sponsorData['org_name'];
//         document.title = sponsorData['org_name'];
//     }

//     // Clear previous content
//     sponsorStats.innerHTML = '';
//     sponsorDescription.innerHTML = '';

//     // Display followers, likes, and projects
//     const stats = [
//         { label: 'Followers', value: sponsorData['followers_count'] || 'N/A' },
//         { label: 'Likes', value: sponsorData['likes_count'] || 'N/A' },
//         { label: 'Projects', value: sponsorData['project_count'] || 'N/A' }
//     ];

//     stats.forEach(stat => {
//         const statItem = document.createElement('div');
//         statItem.className = 'stat-item';
//         statItem.innerHTML = `<p class="number">${stat.value}</p><p>${stat.label}</p>`;
//         sponsorStats.appendChild(statItem);
//     });

//     // Icons for email, Facebook, website (clear iconsRow content first)
//     iconsRow.innerHTML = '';
//     if (sponsorData['email_add']) {
//         const emailIcon = document.createElement('a');
//         emailIcon.href = `mailto:${sponsorData['email_add']}`;
//         emailIcon.innerHTML = '<i class="fas fa-envelope"></i>';
//         iconsRow.appendChild(emailIcon);
//     }
//     if (sponsorData['facebook_link']) {
//         const facebookIcon = document.createElement('a');
//         facebookIcon.href = sponsorData['facebook_link'];
//         facebookIcon.target = '_blank';
//         facebookIcon.innerHTML = '<i class="fab fa-facebook"></i>';
//         iconsRow.appendChild(facebookIcon);
//     }
//     if (sponsorData['website']) {
//         const websiteIcon = document.createElement('a');
//         websiteIcon.href = sponsorData['website'];
//         websiteIcon.target = '_blank';
//         websiteIcon.innerHTML = '<i class="fas fa-globe"></i>';
//         iconsRow.appendChild(websiteIcon);
//     }

//     // About section
//     if (sponsorData['org_background']) {
//         sponsorDescription.innerHTML = `<strong>About:</strong> ${sponsorData['org_background']}`;
//     }
// }

// // Display event data in a styled box
// function displayEventData(eventData, containerId) {
//     console.log("Displaying event data:", eventData); // Log event data for debugging

//     const dataDisplayDiv = document.getElementById(containerId); // This should exist in your HTML to display event data

//     // Clear previous content
//     dataDisplayDiv.innerHTML = '';

//     // Add the project name as the header
//     if (eventData['Project Name']) {
//         const header = document.createElement('h2');
//         header.textContent = eventData['Project Name'];
//         dataDisplayDiv.appendChild(header);
//     }

//     // Create a container div for the box styling
//     const boxDiv = document.createElement('div');
//     boxDiv.style.border = '1px solid #ccc';
//     boxDiv.style.padding = '15px';
//     boxDiv.style.borderRadius = '5px';
//     boxDiv.style.backgroundColor = '#f9f9f9';
//     boxDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
//     boxDiv.style.margin = '15px 0';

//     // Data to be displayed in the box (excluding 'Organiser')
//     const displayOrder = [
//         'Description',
//         'Location',
//         'Session(s)',
//         'Volunteer Hours per Session',
//         'Volunteer Period',
//         'Capacity',
//         'Total CSP hours',
//         'Project Requirements',
//         'Region', // Ensure this key matches exactly with the database key
//         'Admissions Period'
//     ];

//     // Iterate through the displayOrder array and display the corresponding data
//     displayOrder.forEach(key => {
//         if (eventData[key]) {
//             const paragraph = document.createElement('p');
//             paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key]}`;
//             boxDiv.appendChild(paragraph);
//         }
//     });

//     // Append the boxDiv to the display div
//     dataDisplayDiv.appendChild(boxDiv);
// }


// // Function to fetch and display data for any event
// function fetchEventData(eventRefPath, containerId) {
//     const eventRef = ref(database, eventRefPath); // Reference to the event data in Firebase

//     get(eventRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const eventData = snapshot.val();
//                 console.log(`Event data for ${eventRefPath} fetched successfully:`, eventData);
//                 displayEventData(eventData, containerId); // Display the fetched event data
//             } else {
//                 document.getElementById(containerId).innerHTML = `<p>No data available for ${eventRefPath}.</p>`;
//             }
//         })
//         .catch((error) => {
//             console.error(`Error fetching event data for ${eventRefPath}:`, error.message);
//             document.getElementById(containerId).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
//         });
// }

// // Call the functions on window load
// window.onload = () => {
//     fetchSponsor1Data(); // Fetch sponsor data

//     // Fetch data for multiple events and display them in separate boxes
//     fetchEventData('events/event1', 'event1Data'); // Event 1
//     fetchEventData('events/event11', 'event11Data'); // Event 11
//     fetchEventData('events/event12', 'event12Data'); // Event 12
//     fetchEventData('events/event13', 'event13Data'); // Event 13
// };



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

// Fetch sponsor data
function fetchSponsor1Data() {
    const sponsor1Ref = ref(database, 'sponsors/sponsor1');
    get(sponsor1Ref)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const sponsorData = snapshot.val();
                console.log("Sponsor data fetched:", sponsorData);  // Added log to track data
                displaySponsorData(sponsorData);
            } else {
                console.warn("No sponsor data available");
                document.getElementById("sponsorHeader").innerHTML = '<p>No sponsor data available.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching sponsor data:", error.message);
            document.getElementById("sponsorHeader").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Display sponsor data
function displaySponsorData(sponsorData) {
    const sponsorNameElement = document.getElementById("sponsorHeader");
    const sponsorStats = document.getElementById("sponsorStats");
    const iconsRow = document.getElementById("iconsRow");
    const sponsorDescription = document.getElementById("sponsorDescription");

    // Set the Sponsor Name and update the page title
    if (sponsorData['org_name']) {
        sponsorNameElement.textContent = sponsorData['org_name'];
        document.title = sponsorData['org_name'];
    }

    // Clear previous content
    sponsorStats.innerHTML = '';
    sponsorDescription.innerHTML = '';

    // Display followers, likes, and projects
    const stats = [
        { label: 'Followers', value: sponsorData['followers_count'] || 'N/A' },
        { label: 'Likes', value: sponsorData['likes_count'] || 'N/A' },
        { label: 'Projects', value: sponsorData['project_count'] || 'N/A' }
    ];

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `<p class="number">${stat.value}</p><p>${stat.label}</p>`;
        sponsorStats.appendChild(statItem);
    });

    // Icons for email, Facebook, website (clear iconsRow content first)
    iconsRow.innerHTML = '';
    if (sponsorData['email_add']) {
        const emailIcon = document.createElement('a');
        emailIcon.href = `mailto:${sponsorData['email_add']}`;
        emailIcon.innerHTML = '<i class="fas fa-envelope"></i>';
        iconsRow.appendChild(emailIcon);
    }
    if (sponsorData['facebook_link']) {
        const facebookIcon = document.createElement('a');
        facebookIcon.href = sponsorData['facebook_link'];
        facebookIcon.target = '_blank';
        facebookIcon.innerHTML = '<i class="fab fa-facebook"></i>';
        iconsRow.appendChild(facebookIcon);
    }
    if (sponsorData['website']) {
        const websiteIcon = document.createElement('a');
        websiteIcon.href = sponsorData['website'];
        websiteIcon.target = '_blank';
        websiteIcon.innerHTML = '<i class="fas fa-globe"></i>';
        iconsRow.appendChild(websiteIcon);
    }

    // About section
    if (sponsorData['org_background']) {
        sponsorDescription.innerHTML = `<strong>About:</strong> ${sponsorData['org_background']}`;
    }
}

// Display event data in a styled box
function displayEventData(eventData, containerId) {
    const dataDisplayDiv = document.getElementById(containerId);
    dataDisplayDiv.innerHTML = '';

    // Add header (project name)
    if (eventData['Project Name']) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'event-header';

        const header = document.createElement('h2');
        header.textContent = eventData['Project Name'];

        // Create the disabled delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.disabled = true;  // Disable it for now
        deleteBtn.textContent = 'Delete';

        headerDiv.appendChild(header);
        headerDiv.appendChild(deleteBtn);
        dataDisplayDiv.appendChild(headerDiv);
    }

    // Create a container for the event data
    const boxDiv = document.createElement('div');
    boxDiv.style.border = '1px solid #ccc';
    boxDiv.style.padding = '15px';
    boxDiv.style.borderRadius = '5px';
    boxDiv.style.backgroundColor = '#f9f9f9';
    boxDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    boxDiv.style.margin = '15px 0';

    const displayOrder = [
        'Description', 'Location', 'Session(s)', 'Volunteer Hours per Session',
        'Volunteer Period', 'Capacity', 'Total CSP hours', 'Project Requirements', 'Region', 'Admissions Period'
    ];

    displayOrder.forEach(key => {
        if (eventData[key]) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key]}`;
            boxDiv.appendChild(paragraph);
        }
    });

    dataDisplayDiv.appendChild(boxDiv);
}

// Fetch and display event data for multiple events
function fetchEventData(eventRefPath, containerId) {
    const eventRef = ref(database, eventRefPath);
    get(eventRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const eventData = snapshot.val();
                console.log(`Event data fetched for ${eventRefPath}:`, eventData);  // Added log for event data
                displayEventData(eventData, containerId);
            } else {
                console.warn(`No data available for ${eventRefPath}`);
                document.getElementById(containerId).innerHTML = `<p>No data available for ${eventRefPath}.</p>`;
            }
        })
        .catch((error) => {
            console.error(`Error fetching event data for ${eventRefPath}:`, error.message);
            document.getElementById(containerId).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

window.onload = () => {
    console.log("Window loaded, fetching sponsor and event data"); // Added log for window load
    fetchSponsor1Data(); // Fetch sponsor data
    fetchEventData('events/event1', 'event1Data');
    fetchEventData('events/event11', 'event11Data');
    fetchEventData('events/event12', 'event12Data');
    fetchEventData('events/event13', 'event13Data');
};
