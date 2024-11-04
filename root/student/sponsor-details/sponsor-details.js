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

// Display sponsor details
function displaySponsorDetails() {
    const sponsorKey = getQueryParam("sponsorKey");
    if (!sponsorKey) {
        document.getElementById("sponsorDetails").innerHTML = "<p>Sponsor not found.</p>";
        return;
    }

    const dbRef = ref(database, `sponsors/${sponsorKey}`);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Set sponsor title as org_name
            document.getElementById("sponsorTitle").textContent = data["org_name"];

            // Display stats using likes_count, followers_count, and project_count
            document.getElementById("followers").textContent = `${data["followers_count"] || 0}`;
            document.getElementById("likes").textContent = `${data["likes_count"] || 0}`;
            document.getElementById("projects").textContent = `${data["project_count"] || 0}`;

            // Update icon links if data exists
            if (data["email_add"]) {
                document.getElementById("emailIcon").href = `mailto:${data["email_add"]}`;
                document.getElementById("emailIcon").style.display = "block";
            }
            if (data["facebook_link"]) {
                document.getElementById("facebookIcon").href = data["facebook_link"];
                document.getElementById("facebookIcon").style.display = "block";
            }
            if (data["website"]) {
                document.getElementById("websiteIcon").href = data["website"];
                document.getElementById("websiteIcon").style.display = "block";
            }

            // Display additional sponsor details, using "About" instead of "org_background"
            const sponsorDetailsContainer = document.getElementById("sponsorDetails");
            sponsorDetailsContainer.innerHTML = "";

            for (const key in data) {
                if (data.hasOwnProperty(key) && !["org_name", "followers_count", "likes_count", "project_count", "email_add", "facebook_link", "website"].includes(key)) {
                    const paragraph = document.createElement("p");

                    if (key === "org_background") {
                        // Display About section
                        paragraph.innerHTML = `<span style="font-weight:bold; font-size: 1.3em;">About</span><br>&emsp;&emsp;<span>${data[key]}</span>`;
                    } else if (key === "project_list") {
                        // Display Project List section with bullet points
                        paragraph.innerHTML = `<span style="font-weight:bold; font-size: 1.3em;">Project List</span><br>`;

                        // Check if project_list is an array
                        const projectArray = Array.isArray(data[key]) ? data[key] : data[key].split(",");

                        // Create an unordered list for projects
                        const ul = document.createElement("ul");
                        ul.style.paddingLeft = "20px"; // Add some indentation for bullet points

                        projectArray.forEach(project => {
                            const li = document.createElement("li");
                            li.textContent = project.trim(); // Trim to remove any extra spaces
                            ul.appendChild(li);
                        });

                        paragraph.appendChild(ul);
                    } else {
                        paragraph.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
                    }

                    sponsorDetailsContainer.appendChild(paragraph);
                }
            }
        } else {
            document.getElementById("sponsorDetails").innerHTML = "<p>Sponsor details not available.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching sponsor details:", error);
        document.getElementById("sponsorDetails").innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
}

window.onload = displaySponsorDetails;
