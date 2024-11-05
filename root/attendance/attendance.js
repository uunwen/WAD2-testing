// Get user info from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Display welcome message
document.getElementById(
  "welcomeMessage"
).textContent = `Welcome`;

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