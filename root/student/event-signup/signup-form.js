// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

// Load event name in form header
const eventName = getQueryParam("eventName");
document.getElementById("eventName").textContent = eventName || "the Event";

// Input field validation functions

// Validate Name (ensure it is not empty)
document.getElementById("name").addEventListener("input", function () {
    const nameInput = document.getElementById("name");
    if (!nameInput.value.trim()) {
        nameInput.setCustomValidity("Name is required.");
        nameInput.reportValidity();
    } else {
        nameInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Validate Email (ensure it includes '@')
document.getElementById("email").addEventListener("input", function () {
    const emailInput = document.getElementById("email");
    if (!emailInput.value.includes('@')) {
        emailInput.setCustomValidity("Please include an '@' in the email address.");
        emailInput.reportValidity();
    } else {
        emailInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Validate Telegram Handle (must start with '@')
document.getElementById("telegram").addEventListener("input", function () {
    const telegramInput = document.getElementById("telegram");
    if (!telegramInput.value.startsWith('@')) {
        telegramInput.setCustomValidity("Please include an '@' at the start of the Telegram handle.");
        telegramInput.reportValidity();
    } else {
        telegramInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Validate Age (must be a positive number and only numeric characters)
document.getElementById("age").addEventListener("input", function () {
    const ageInput = document.getElementById("age");
    if (!/^\d+$/.test(ageInput.value) || ageInput.value < 0) {
        ageInput.setCustomValidity("Age must be a valid positive number without any letters or special characters.");
        ageInput.reportValidity();
    } else {
        ageInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Validate School (ensure a selection is made)
document.getElementById("school").addEventListener("change", function () {
    const schoolInput = document.getElementById("school");
    if (!schoolInput.value) {
        schoolInput.setCustomValidity("Please select your school.");
        schoolInput.reportValidity();
    } else {
        schoolInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Validate Contact Number (only allow digits and certain signs)
document.getElementById("contact").addEventListener("input", function () {
    const contactInput = document.getElementById("contact");
    if (!/^[0-9+\-() ]*$/.test(contactInput.value)) {
        contactInput.setCustomValidity("Contact number can only include numbers and certain signs (+, -, (), spaces).");
        contactInput.reportValidity();
    } else {
        contactInput.setCustomValidity(""); // Clear the message when valid
    }
});

// Handle form submission
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Check for validation errors
    const inputs = document.querySelectorAll("#signupForm input, #signupForm select");
    let isValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });

    // Stop submission if any validation errors exist
    if (!isValid) {
        return;
    }

    // Get eventKey for specific event
    const eventKey = getQueryParam("eventKey");

    // Collect form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const telegram = document.getElementById("telegram").value.trim();
    const age = document.getElementById("age").value.trim();
    const school = document.getElementById("school").value;
    const contact = document.getElementById("contact").value.trim();

    // Reference to the event's sign-ups in Firebase
    const signupsRef = ref(database, `events/${eventKey}/signups`);

    // Save data to Firebase
    push(signupsRef, {
        name,
        email,
        telegram,
        age,
        school,
        contact
    }).then(() => {
        alert("You have successfully signed up for the event!");
        document.getElementById("signupForm").reset(); // Clear form
    }).catch((error) => {
        console.error("Error submitting data:", error);
        alert("An error occurred while signing up. Please try again.");
    });
});
