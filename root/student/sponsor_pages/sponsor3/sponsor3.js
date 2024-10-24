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

// Function to display sponsor data on the HTML page
function displaySponsorData(sponsorData) {
    const sponsorNameElement = document.getElementById("sponsorHeader"); // h1 element for the Sponsor Name
    const aboutTextElement = document.getElementById("aboutText"); // Paragraph for About section
    const projectsListElement = document.getElementById("projectsList"); // UL element for Projects list
    const dataDisplayDiv = document.getElementById("sponsorData"); // Div to display sponsor3 data

    // Clear previous content
    dataDisplayDiv.innerHTML = '';
    projectsListElement.innerHTML = ''; // Clear projects list

    // Set the Sponsor Name as the header and update the page title
    if (sponsorData['org_name']) {
        sponsorNameElement.textContent = sponsorData['org_name'];
        document.title = sponsorData['org_name'];
    }

    // Create a table for followers_count, likes_count, and project_count
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.textAlign = 'center';
    table.style.margin = '20px 0';

    // Create the first row (values)
    const valuesRow = document.createElement('tr');
    ['followers_count', 'likes_count', 'project_count'].forEach((key) => {
        const valueCell = document.createElement('td');
        valueCell.textContent = sponsorData[key] || 'N/A'; // Handle missing data
        valueCell.style.padding = '10px';
        valueCell.style.fontSize = '24px';
        valuesRow.appendChild(valueCell);
    });
    table.appendChild(valuesRow);

    // Create the second row (keys/labels)
    const labelsRow = document.createElement('tr');
    ['Followers', 'Likes', 'Projects'].forEach((label) => {
        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        labelCell.style.padding = '10px';
        labelCell.style.fontWeight = 'bold';
        labelsRow.appendChild(labelCell);
    });
    table.appendChild(labelsRow);

    // Append the table to the data display div
    dataDisplayDiv.appendChild(table);

    // Update the About section
    if (sponsorData['org_background']) {
        aboutTextElement.innerHTML = `<strong>About:</strong> ${sponsorData['org_background']}`;
    } else {
        aboutTextElement.innerHTML = `<strong>About:</strong> No information available.`;
    }

    // Populate the projects list
    if (Array.isArray(sponsorData['project_list'])) {
        sponsorData['project_list'].forEach((project) => {
            const listItem = document.createElement('li');
            listItem.textContent = project;
            projectsListElement.appendChild(listItem);
        });
    } else {
        projectsListElement.innerHTML = '<li>No projects available.</li>';
    }

    // Create a row with icons for email, Facebook, and website
    const iconsRow = document.createElement('div');
    iconsRow.style.display = 'flex';
    iconsRow.style.justifyContent = 'center';
    iconsRow.style.margin = '20px 0';

    // Email icon
    const emailIcon = document.createElement('a');
    emailIcon.href = `mailto:${sponsorData['email_add']}`;
    emailIcon.innerHTML = '<i class="fas fa-envelope icon"></i>';  // Added icon class for hover effect
    emailIcon.title = 'Email';
    iconsRow.appendChild(emailIcon);

    // Facebook icon
    const facebookIcon = document.createElement('a');
    facebookIcon.href = sponsorData['facebook_link'];
    facebookIcon.target = '_blank';
    facebookIcon.innerHTML = '<i class="fab fa-facebook icon"></i>';  // Added icon class for hover effect
    facebookIcon.title = 'Facebook';
    iconsRow.appendChild(facebookIcon);

    // Website icon
    const websiteIcon = document.createElement('a');
    websiteIcon.href = sponsorData['website'];
    websiteIcon.target = '_blank';
    websiteIcon.innerHTML = '<i class="fas fa-globe icon"></i>';  // Added icon class for hover effect
    websiteIcon.title = 'Website';
    iconsRow.appendChild(websiteIcon);

    // Append the icons row to the data display div
    dataDisplayDiv.appendChild(iconsRow);
}

// Function to fetch and display data for sponsor3
function fetchSponsor3Data() {
    const sponsor3Ref = ref(database, 'sponsors/sponsor3'); // Reference to 'sponsor3' data in Firebase

    get(sponsor3Ref)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const sponsorData = snapshot.val();
                displaySponsorData(sponsorData); // Display the fetched sponsor3 data
            } else {
                document.getElementById("sponsorData").innerHTML = '<p>No data available for this sponsor.</p>';
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("sponsorData").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

// Fetch and display data when the page loads
window.onload = fetchSponsor3Data;
