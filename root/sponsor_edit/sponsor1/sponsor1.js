// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
        console.log("Sponsor Data:", sponsorData);  // Check what data is retrieved
        displaySponsorData(sponsorData);  // Display sponsor data
      } else {
        document.getElementById("sponsorHeader").innerHTML = '<p>No sponsor data available.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);
      document.getElementById("sponsorHeader").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

// Display sponsor data with edit functionality for the "About" section
function displaySponsorData(sponsorData) {
  const sponsorNameElement = document.getElementById("sponsorHeader");
  const sponsorStats = document.getElementById("sponsorStats");
  const iconsRow = document.getElementById("iconsRow");

  // Set the Sponsor Name and update the page title
  if (sponsorData['org_name']) {
    sponsorNameElement.textContent = sponsorData['org_name'];
    document.title = sponsorData['org_name'];
  }

  // Clear previous content for statistics and icons
  sponsorStats.innerHTML = '';
  iconsRow.innerHTML = '';

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

  // Icons for email, Facebook, and website
  if (sponsorData['email_add']) {
    const emailIcon = document.createElement('a');
    emailIcon.href = `mailto:${sponsorData['email_add']}`;
    emailIcon.innerHTML = '<i class="fas fa-envelope"></i>';
    iconsRow.appendChild(emailIcon);
  }

  // Check if the Facebook link exists and display it
  if (sponsorData['facebook_link']) {
    console.log("Facebook Link:", sponsorData['facebook_link']);  // Log Facebook link to check
    const facebookIcon = document.createElement('a');
    facebookIcon.href = sponsorData['facebook_link'];
    facebookIcon.target = '_blank';
    facebookIcon.innerHTML = '<i class="fab fa-facebook"></i>';  // Font Awesome class for Facebook
    iconsRow.appendChild(facebookIcon);
  } else {
    console.log("No Facebook link found.");
  }

  if (sponsorData['website']) {
    const websiteIcon = document.createElement('a');
    websiteIcon.href = sponsorData['website'];
    websiteIcon.target = '_blank';
    websiteIcon.innerHTML = '<i class="fas fa-globe"></i>';
    iconsRow.appendChild(websiteIcon);
  }

  // Display the "About" section content
  const aboutContent = sponsorData['org_background'] || "N/A";
  document.getElementById("aboutContent").textContent = aboutContent;

  // Event listener for editing the "About" section
  document.getElementById("editAboutBtn").addEventListener("click", enableEditAboutSection);

  // Event listeners for save and cancel buttons
  document.getElementById("saveAboutBtn").addEventListener("click", () => saveAboutSection('sponsor1'));
  document.getElementById("cancelAboutBtn").addEventListener("click", cancelEditAboutSection);
}

// Enable edit mode for the "About" section
function enableEditAboutSection() {
  const aboutText = document.getElementById("aboutText");
  const aboutTextarea = document.getElementById("aboutTextarea");
  const saveBtn = document.getElementById("saveAboutBtn");
  const cancelBtn = document.getElementById("cancelAboutBtn");
  const editBtn = document.getElementById("editAboutBtn");

  // Hide the static content and show the editable textarea and buttons
  aboutText.style.display = "none";
  aboutTextarea.style.display = "block";
  aboutTextarea.value = document.getElementById("aboutContent").textContent;
  saveBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
  editBtn.style.display = "none";
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
      document.getElementById("aboutContent").textContent = newAboutContent;
      cancelEditAboutSection(); // Exit edit mode after saving
    })
    .catch((error) => {
      console.error("Error updating about section:", error.message);
    });
}

// Cancel editing the "About" section
function cancelEditAboutSection() {
  const aboutText = document.getElementById("aboutText");
  const aboutTextarea = document.getElementById("aboutTextarea");
  const saveBtn = document.getElementById("saveAboutBtn");
  const cancelBtn = document.getElementById("cancelAboutBtn");
  const editBtn = document.getElementById("editAboutBtn");

  // Restore the static content and hide the textarea and buttons
  aboutText.style.display = "block";
  aboutTextarea.style.display = "none";
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
  editBtn.style.display = "inline-block";
}

// Fetch event data from Firebase
function fetchEventData(eventRefPath, containerId) {
  const eventRef = ref(database, eventRefPath);
  get(eventRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const eventData = snapshot.val();
        displayEventData(eventData, containerId, eventRefPath);
      } else {
        document.getElementById(containerId).innerHTML = `<p>No data available for ${eventRefPath}.</p>`;
      }
    })
    .catch((error) => {
      console.error(`Error fetching event data for ${eventRefPath}:`, error.message);
    });
}

// Display event data in a styled box with edit functionality
function displayEventData(eventData, containerId, eventRefPath) {
  const dataDisplayDiv = document.getElementById(containerId);
  dataDisplayDiv.innerHTML = ''; // Clear any existing content

  // Add header (project name)
  if (eventData['Project Name']) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'event-header';

    const header = document.createElement('h2');
    header.textContent = eventData['Project Name'];

    headerDiv.appendChild(header);
    dataDisplayDiv.appendChild(headerDiv);
  }

  // Create a container for the event data and allow editing
  const boxDiv = document.createElement('div');
  boxDiv.className = 'event-box';
  boxDiv.id = containerId;

  // Iterate through the event data and display each key-value pair
  for (const key in eventData) {
    if (key !== 'Project Name') {
      const paragraph = document.createElement('p');
      paragraph.setAttribute('data-key', key);
      paragraph.innerHTML = `<strong>${key}:</strong> ${eventData[key]}`;
      boxDiv.appendChild(paragraph);
    }
  }

  // Add Edit, Save, and Cancel buttons
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-btn';
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none'; // Initially hidden

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'cancel-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.display = 'none'; // Initially hidden

  // Add event listeners to buttons
  editBtn.addEventListener('click', () => enableEditEvent(containerId, saveBtn, cancelBtn));
  saveBtn.addEventListener('click', () => saveEventData(eventRefPath, containerId));
  cancelBtn.addEventListener('click', () => cancelEditEvent(eventRefPath, containerId));

  boxDiv.appendChild(editBtn);
  boxDiv.appendChild(saveBtn);
  boxDiv.appendChild(cancelBtn);

  dataDisplayDiv.appendChild(boxDiv);
}

// Enable edit mode for events
function enableEditEvent(containerId, saveBtn, cancelBtn) {
  const eventDataDiv = document.getElementById(containerId);
  const editBtn = eventDataDiv.querySelector('.edit-btn');

  // Convert static paragraphs into input fields for editing
  eventDataDiv.querySelectorAll('p').forEach(paragraph => {
    const key = paragraph.getAttribute('data-key');
    const value = paragraph.textContent.split(': ')[1];
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = value;
    inputField.setAttribute('data-key', key);
    paragraph.innerHTML = `<strong>${key}:</strong> `;
    paragraph.appendChild(inputField);
  });

  // Show save and cancel buttons, hide edit button
  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';
  cancelBtn.style.display = 'inline-block';
}

// Save event changes to Firebase
function saveEventData(eventRefPath, containerId) {
  const eventDataDiv = document.getElementById(containerId);
  const updatedData = {};

  // Collect updated data from input fields
  eventDataDiv.querySelectorAll('input').forEach(inputField => {
    const key = inputField.getAttribute('data-key');
    updatedData[key] = inputField.value;
  });

  const eventRef = ref(database, eventRefPath);
  update(eventRef, updatedData)
    .then(() => {
      console.log(`Event data updated successfully`);
      displayUpdatedEventData(updatedData, containerId); // Display updated data
    })
    .catch((error) => {
      console.error(`Error updating event data:`, error.message);
    });
}

// Cancel editing the event and restore the original content
function cancelEditEvent(eventRefPath, containerId) {
  fetchEventData(eventRefPath, containerId); // Reload the original data from Firebase
}

// Display updated event data after saving
function displayUpdatedEventData(updatedData, containerId) {
  const eventDataDiv = document.getElementById(containerId);
  const editBtn = eventDataDiv.querySelector('.edit-btn');
  const saveBtn = eventDataDiv.querySelector('.save-btn');
  const cancelBtn = eventDataDiv.querySelector('.cancel-btn');

  eventDataDiv.innerHTML = ''; // Clear existing content

  // Rebuild the static content with the updated data
  for (const key in updatedData) {
    const paragraph = document.createElement('p');
    paragraph.setAttribute('data-key', key);
    paragraph.innerHTML = `<strong>${key}:</strong> ${updatedData[key]}`;
    eventDataDiv.appendChild(paragraph);
  }

  // Restore the edit button and hide save/cancel buttons
  editBtn.style.display = 'inline-block';
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
}

// On window load, fetch sponsor and event data
window.onload = () => {
  fetchSponsor1Data(); // Fetch sponsor data
  fetchEventData('events/event1', 'event1Data');
  fetchEventData('events/event11', 'event11Data');
  fetchEventData('events/event12', 'event12Data');
  fetchEventData('events/event13', 'event13Data');
};

