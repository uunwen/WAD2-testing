/**
 * @author Chan Yun Wen
 */

// Retrive user info
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// Create the HTML structure
const navbarLinks = document.createElement("ul");
navbarLinks.classList.add("sideBar");

// Define the menu items
const menuItems = [
  {
    href: `./sponsor1.html?uid=${uid}`,
    imgSrc: "../img/house.png",
    text: "Home",
  },
  {
    href: `./takeAttendance.html?uid=${uid}`,
    imgSrc: "../img/attendance.png",
    text: "Attendance",
  },
  {
    href: `../sponsersignup/index.html?uid=${uid}`,
    imgSrc: "../img/viewSignUp.png",
    text: "Event Sign-ups",
  },
];

// Populate the 'ul' with 'li' items
menuItems.forEach((item) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = item.href;

  const img = document.createElement("img");
  img.src = item.imgSrc;

  a.appendChild(img);
  a.append(` ${item.text}`);
  li.appendChild(a);
  navbarLinks.appendChild(li);
});

// Append the navbar to the DOM, for example in a div with id 'navbar'
document.getElementById("sidebar").appendChild(navbarLinks);
