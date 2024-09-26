// Function to show the respective login form
function showForm(formType) {
  document.querySelector(".login-options").style.display = "none";
  document.getElementById("communityServiceForm").style.display = "none";
  document.getElementById("userForm").style.display = "none";
  document.getElementById("adminForm").style.display = "none";

  if (formType === "communityService") {
    document.getElementById("communityServiceForm").style.display = "block";
  } else if (formType === "user") {
    document.getElementById("userForm").style.display = "block";
  } else if (formType === "admin") {
    document.getElementById("adminForm").style.display = "block";
  }
}

// Function to go back to the selection menu
function goBack() {
  document.querySelector(".login-options").style.display = "block";
  document.getElementById("communityServiceForm").style.display = "none";
  document.getElementById("userForm").style.display = "none";
  document.getElementById("adminForm").style.display = "none";
}
    