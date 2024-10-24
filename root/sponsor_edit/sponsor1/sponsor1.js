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

// // Fetch sponsor data
// function fetchSponsor1Data() {
//     const sponsor1Ref = ref(database, 'sponsors/sponsor1');
//     get(sponsor1Ref)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const sponsorData = snapshot.val();
//                 console.log("Sponsor data fetched:", sponsorData);  // Added log to track data
//                 displaySponsorData(sponsorData);
//             } else {
//                 console.warn("No sponsor data available");
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
//     const dataDisplayDiv = document.getElementById(containerId);
//     dataDisplayDiv.innerHTML = '';

//     // Add header (project name)
//     if (eventData['Project Name']) {
//         const headerDiv = document.createElement('div');
//         headerDiv.className = 'event-header';

//         const header = document.createElement('h2');
//         header.textContent = eventData['Project Name'];

//         // Create the disabled delete button
//         const deleteBtn = document.createElement('button');
//         deleteBtn.className = 'delete-btn';
//         deleteBtn.disabled = true;  // Disable it for now
//         deleteBtn.textContent = 'Delete';

//         headerDiv.appendChild(header);
//         headerDiv.appendChild(deleteBtn);
//         dataDisplayDiv.appendChild(headerDiv);
//     }

//     // Create a container for the event data
//     const boxDiv = document.createElement('div');
//     boxDiv.style.border = '1px solid #ccc';
//     boxDiv.style.padding = '15px';
//     boxDiv.style.borderRadius = '5px';
//     boxDiv.style.backgroundColor = '#f9f9f9';
//     boxDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
//     boxDiv.style.margin = '15px 0';

//     const displayOrder = [
//         'Description', 'Location', 'Session(s)', 'Volunteer Hours per Session',
//         'Volunteer Period', 'Capacity', 'Total CSP hours', 'Project Requirements', 'Region', 'Admissions Period'
//     ];

//     displayOrder.forEach(key => {
//         if (eventData[key]) {
//             const paragraph = document.createElement('p');
//             paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key]}`;
//             boxDiv.appendChild(paragraph);
//         }
//     });

//     dataDisplayDiv.appendChild(boxDiv);
// }


// // Function to fetch and display data for any event
// function fetchEventData(eventRefPath, containerId) {
//     const eventRef = ref(database, eventRefPath);
//     get(eventRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const eventData = snapshot.val();
//                 console.log(`Event data fetched for ${eventRefPath}:`, eventData);  // Added log for event data
//                 displayEventData(eventData, containerId);
//             } else {
//                 console.warn(`No data available for ${eventRefPath}`);
//                 document.getElementById(containerId).innerHTML = `<p>No data available for ${eventRefPath}.</p>`;
//             }
//         })
//         .catch((error) => {
//             console.error(`Error fetching event data for ${eventRefPath}:`, error.message);
//             document.getElementById(containerId).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
//         });
// }

// window.onload = () => {
//     console.log("Window loaded, fetching sponsor and event data"); // Added log for window load
//     fetchSponsor1Data(); // Fetch sponsor data
//     fetchEventData('events/event1', 'event1Data');
//     fetchEventData('events/event11', 'event11Data');
//     fetchEventData('events/event12', 'event12Data');
//     fetchEventData('events/event13', 'event13Data');
// };



// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
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
  // Get user info from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");
  console.log(uid);

  const sponsor1Ref = ref(database, "sponsors/" + uid);
  get(sponsor1Ref)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sponsorData = snapshot.val();
        console.log("Sponsor data fetched:", sponsorData); // Added log to track data
        displaySponsorData(sponsorData);
      } else {
        console.warn("No sponsor data available");
        document.getElementById("sponsorHeader").innerHTML =
          "<p>No sponsor data available.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);
      document.getElementById(
        "sponsorHeader"
      ).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

// Enable edit mode for the "About" section
function enableEditAboutSection() {
    const aboutText = document.getElementById("aboutText");
    const aboutTextarea = document.getElementById("aboutTextarea");
    const aboutActions = document.getElementById("aboutActions");
    const editBtn = document.getElementById("editAboutBtn");
    const saveBtn = document.getElementById("saveAboutBtn");
    const cancelBtn = document.getElementById("cancelAboutBtn");

    // Hide the static content and show the editable textarea and buttons
    aboutText.style.display = "none";
    aboutTextarea.style.display = "block";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    editBtn.style.display = "none";

    // Set the current "About" content in the textarea
    aboutTextarea.value = document.getElementById("aboutContent").textContent;
}

// Cancel edit mode and restore the original content
function cancelEditAboutSection(aboutContent) {
    const aboutText = document.getElementById("aboutText");
    const aboutTextarea = document.getElementById("aboutTextarea");
    const aboutActions = document.getElementById("aboutActions");
    const editBtn = document.getElementById("editAboutBtn");
    const saveBtn = document.getElementById("saveAboutBtn");
    const cancelBtn = document.getElementById("cancelAboutBtn");

    // Restore the static content and hide the textarea and buttons
    aboutText.style.display = "block";
    aboutTextarea.style.display = "none";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    editBtn.style.display = "inline-block";

    // Set the original content back
    document.getElementById("aboutContent").textContent = aboutContent;
}

// Save the edited "About" section to Firebase
function saveAboutSection(sponsorId) {
    const aboutTextarea = document.getElementById("aboutTextarea");
    const newAboutContent = aboutTextarea.value;

    const sponsorRef = ref(database, `sponsors/${sponsorId}`);
    update(sponsorRef, { org_background: newAboutContent })
        .then(() => {
            console.log("About section updated successfully in Firebase");
            // Update the UI with the new content and disable edit mode
            cancelEditAboutSection(newAboutContent);
        })
        .catch((error) => {
            console.error("Error updating about section:", error.message);
        });
}

// Display sponsor data with edit functionality for the "About" section
function displaySponsorData(sponsorData) {
  const sponsorNameElement = document.getElementById("sponsorHeader");
  const sponsorStats = document.getElementById("sponsorStats");
  const iconsRow = document.getElementById("iconsRow");
  const sponsorDescription = document.getElementById("sponsorDescription");

  // Set the Sponsor Name and update the page title
  if (sponsorData["org_name"]) {
    sponsorNameElement.textContent = sponsorData["org_name"];
    document.title = sponsorData["org_name"];
  }

    // Clear previous content
    sponsorStats.innerHTML = '';
    sponsorDescription.innerHTML = '';

  // Display followers, likes, and projects
  const stats = [
    { label: "Followers", value: sponsorData["followers_count"] || "N/A" },
    { label: "Likes", value: sponsorData["likes_count"] || "N/A" },
    { label: "Projects", value: sponsorData["project_count"] || "N/A" },
  ];

  stats.forEach((stat) => {
    const statItem = document.createElement("div");
    statItem.className = "stat-item";
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
  dataDisplayDiv.innerHTML = "";

  // Add header (project name)
  if (eventData["Project Name"]) {
    const headerDiv = document.createElement("div");
    headerDiv.className = "event-header";

    const header = document.createElement("h2");
    header.textContent = eventData["Project Name"];

    // Create the disabled delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.disabled = true; // Disable it for now
    deleteBtn.textContent = "Delete";

    headerDiv.appendChild(header);
    headerDiv.appendChild(deleteBtn);
    dataDisplayDiv.appendChild(headerDiv);
  }

  // Create a container for the event data
  const boxDiv = document.createElement("div");
  boxDiv.style.border = "1px solid #ccc";
  boxDiv.style.padding = "15px";
  boxDiv.style.borderRadius = "5px";
  boxDiv.style.backgroundColor = "#f9f9f9";
  boxDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  boxDiv.style.margin = "15px 0";

  const displayOrder = [
    "Description",
    "Location",
    "Session(s)",
    "Volunteer Hours per Session",
    "Volunteer Period",
    "Capacity",
    "Total CSP hours",
    "Project Requirements",
    "Region",
    "Admissions Period",
  ];

  displayOrder.forEach((key) => {
    if (eventData[key]) {
      const paragraph = document.createElement("p");
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
        console.log(`Event data fetched for ${eventRefPath}:`, eventData); // Added log for event data
        displayEventData(eventData, containerId);
      } else {
        console.warn(`No data available for ${eventRefPath}`);
        document.getElementById(
          containerId
        ).innerHTML = `<p>No data available for ${eventRefPath}.</p>`;
      }
    })
    .catch((error) => {
      console.error(
        `Error fetching event data for ${eventRefPath}:`,
        error.message
      );
      document.getElementById(
        containerId
      ).innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

function fetchEventFromSponsor(uid) {
    
}

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

window.onload = () => {
  console.log("Window loaded, fetching sponsor and event data"); // Added log for window load
  fetchSponsor1Data(); // Fetch sponsor data
  fetchEventData("events/event1", "event1Data");
  fetchEventData("events/event11", "event11Data");
  fetchEventData("events/event12", "event12Data");
  fetchEventData("events/event13", "event13Data");
};
