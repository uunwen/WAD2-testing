// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase setting
const appSettings = {
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Realtime Database and get a reference to the service
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Get user info from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");
const name = urlParams.get("name");

// Display welcome message
document.getElementById(
  "welcomeMessage"
).textContent = `Welcome, ${name}!`;

// // Get today's date, NOT COMPLETE BUT DO NOT DELET FIRST
// var date = moment();
// let qrText = date.format("DD/MM/YYYY").toString();
// console.log(qrText);

// Turn today's date into QR quote
function generateQr() {
  let qrImage = document.getElementById("qrImage");
  // Call qr API
  qrImage.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
    uid;
}

// Ensure QR code generation runs after all elements are loaded
window.onload = () => {
  setTimeout(generateQr, 1000); // Delay QR generation by 1 second
};