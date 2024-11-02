/**
 * @author Chan Yun Wen
 */

// Function to create the floating button
function createFloatingButton(text, url) {
  const button = document.createElement("button");
  button.className = "floating-btn";
  button.innerText = text;

  button.addEventListener("click", () => {
    window.location.href = url;
  });

  document.body.appendChild(button);
}

// Retrive user info
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Create the button
createFloatingButton("+", "./upload.html?uid=" + uid);
