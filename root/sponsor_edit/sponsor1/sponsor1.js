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

// Fetch and display sponsor data
function fetchSponsorData() {
  const sponsorRef = ref(database, 'sponsors/sponsor1');
  get(sponsorRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sponsorData = snapshot.val();
        displaySponsorDetails(sponsorData);
      } else {
        document.getElementById('sponsorDescription').innerHTML = '<p>No sponsor data available.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching sponsor data:", error.message);
      document.getElementById('sponsorDescription').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

function displaySponsorDetails(sponsorData) {
  // Display sponsor name and background
  document.getElementById('sponsorHeader').textContent = sponsorData['org_name'] || 'Sponsor Details';
  document.getElementById('aboutContent').textContent = sponsorData['org_background'] || 'N/A';

  // Display sponsor statistics
  const sponsorStats = document.getElementById('sponsorStats');
  const iconsRow = document.getElementById('iconsRow');
  sponsorStats.innerHTML = '';
  iconsRow.innerHTML = '';

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

  // Display contact icons
  addIconLink(iconsRow, sponsorData['email_add'], 'fas fa-envelope', `mailto:${sponsorData['email_add']}`);
  addIconLink(iconsRow, sponsorData['facebook_link'], 'fab fa-facebook', sponsorData['facebook_link']);
  addIconLink(iconsRow, sponsorData['website'], 'fas fa-globe', sponsorData['website']);
}

function addIconLink(container, link, iconClass, href) {
  if (link) {
    const icon = document.createElement('a');
    icon.href = href;
    icon.target = '_blank';
    icon.innerHTML = `<i class="${iconClass} icon-large"></i>`;
    container.appendChild(icon);
  }
}







// Fetch and display events by organizer
function fetchEventsByOrganizer(organizerName) {
  const eventsRef = ref(database, 'events');
  get(eventsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const allEvents = snapshot.val();
        const filteredEvents = Object.entries(allEvents).filter(
          ([, eventData]) => eventData['Organiser'] === organizerName
        );
        displayFilteredEvents(filteredEvents);
      } else {
        document.getElementById("eventContainer").innerHTML = '<p>No events available.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching events:", error.message);
      document.getElementById("eventContainer").innerHTML = `<p>Error fetching events: ${error.message}</p>`;
    });
}

// Display filtered events with edit functionality
function displayFilteredEvents(events) {
  const eventContainer = document.getElementById("eventContainer");
  eventContainer.innerHTML = '';

  if (events.length === 0) {
    eventContainer.innerHTML = '<p>No events found for the specified organizer.</p>';
    return;
  }

  events.forEach(([eventKey, eventData]) => {
    const eventBox = document.createElement('div');
    eventBox.className = 'event-box';

    // Create event header
    const header = document.createElement('h3');
    header.textContent = eventData['Project Name'] || 'Unnamed Project';
    eventBox.appendChild(header);

    // Display each detail of the event
    for (const [key, value] of Object.entries(eventData)) {
      const paragraph = document.createElement('p');
      paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
      paragraph.setAttribute('data-key', key);
      eventBox.appendChild(paragraph);
    }

    // Add edit, save, and cancel buttons
    createEditButtons(eventBox, eventKey);

    eventContainer.appendChild(eventBox);
  });
}

function createEditButtons(eventBox, eventKey) {
  const editBtn = createButton('Edit', 'edit-btn');
  const saveBtn = createButton('Save', 'save-btn', 'none');
  const cancelBtn = createButton('Cancel', 'cancel-btn', 'none');

  editBtn.addEventListener('click', () => enableEditEvent(eventBox, saveBtn, cancelBtn));
  saveBtn.addEventListener('click', () => saveEventData(eventKey, eventBox));
  cancelBtn.addEventListener('click', () => cancelEditEvent(eventKey, eventBox));

  eventBox.appendChild(editBtn);
  eventBox.appendChild(saveBtn);
  eventBox.appendChild(cancelBtn);
}

function createButton(text, className, display = 'inline-block') {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.style.display = display;
  return button;
}

// Enable editing for an event
function enableEditEvent(eventBox, saveBtn, cancelBtn) {
  eventBox.querySelectorAll('p').forEach(paragraph => {
    const key = paragraph.getAttribute('data-key');
    const value = paragraph.textContent.split(': ')[1];

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.setAttribute('data-key', key);

    paragraph.innerHTML = `<strong>${key}:</strong> `;
    paragraph.appendChild(input);
  });

  saveBtn.style.display = 'inline-block';
  cancelBtn.style.display = 'inline-block';
  eventBox.querySelector('.edit-btn').style.display = 'none';
}

// Save the edited event data to Firebase
function saveEventData(eventKey, eventBox) {
  const updatedData = {};
  eventBox.querySelectorAll('input').forEach(input => {
    const key = input.getAttribute('data-key');
    updatedData[key] = input.value;
  });

  const eventRef = ref(database, `events/${eventKey}`);
  update(eventRef, updatedData)
    .then(() => {
      console.log("Event updated successfully.");
      fetchEventsByOrganizer("Ocean Purpose Project"); // Refresh to show updated data
    })
    .catch((error) => {
      console.error("Error updating event:", error.message);
    });
}

// Cancel editing the event and restore original content
function cancelEditEvent(eventKey, eventBox) {
  const eventRef = ref(database, `events/${eventKey}`);
  get(eventRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const eventData = snapshot.val();
        displayEventData(eventData, eventBox);
      }
    })
    .catch((error) => {
      console.error("Error restoring event data:", error.message);
    });
}

// Display event data in the specified event box
function displayEventData(eventData, eventBox) {
  eventBox.innerHTML = '';

  const header = document.createElement('h3');
  header.textContent = eventData['Project Name'] || 'Unnamed Project';
  eventBox.appendChild(header);

  for (const [key, value] of Object.entries(eventData)) {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `<strong>${key}:</strong> ${value}`;
    paragraph.setAttribute('data-key', key);
    eventBox.appendChild(paragraph);
  }

  createEditButtons(eventBox, eventData.eventKey);
}

// On window load, fetch sponsor data and events for the specified organizer
window.onload = () => {
  const organizerName = "Ocean Purpose Project";
  fetchSponsorData();
  fetchEventsByOrganizer(organizerName);
};
