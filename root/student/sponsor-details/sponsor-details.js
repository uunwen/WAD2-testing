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
            document.getElementById("sponsorTitle").textContent = data["name"];

            const sponsorDetailsContainer = document.getElementById("sponsorDetails");
            sponsorDetailsContainer.innerHTML = "";

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const paragraph = document.createElement("p");
                    paragraph.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
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