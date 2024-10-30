// Export searched term variable to sponsor1.js
export let search = "";

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
  databaseURL:
    "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad-proj-2b37f",
  storageBucket: "wad-proj-2b37f.appspot.com",
  messagingSenderId: "873354832788",
  appId: "1:873354832788:web:41105e10dd0f7651607d81",
  measurementId: "G-LFFLPT7G58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Search functionality
// (only need this function for search, just replace the ids, the rest is specific for sponsor)
export async function initializeSearch() {
  // Replace this 2 depending on the nav-bar
  const searchInput = document.getElementById("searchInput");
  const projectsContainer = document.getElementById("projectsContainer");

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const searchProjects = debounce(async (searchTerm) => {
    try {
      // Export term into sponsor1.js
      search = searchTerm;
    } catch (error) {
      console.error("Error searching projects:", error);
      if (projectsContainer) {
        projectsContainer.innerHTML =
          "<p>Error searching projects. Please try again.</p>";
      }
    }
  }, 500);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchProjects(e.target.value);
      console.log("input" + e.target.value);
    });
  }
}

// Get sponsor profile data
async function getSponsorData(uid) {
  try {
    const sponsorRef = ref(database, "sponsors/" + uid);
    const snapshot = await get(sponsorRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching sponsor data:", error);
    return null;
  }
}

// navbar
export function createNavbar() {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");

  const navbar = `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center brand-container">
          <a href="sponsor1.html?uid=${uid}" class="navbar-brand">
            <img src="../img/social-services.png" alt="">RIGHTTRACK
          </a>
        </div>
        
        <div class="flex-grow-1 mx-4 search-wrapper">
          <div class="row justify-content-center">
            <div class="col-8">
              <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search projects..." aria-label="Search">
                <span class="search-icon">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div class="menu">
          <span class="icon" id="profileMenuBtn"><img src="../img/user.png" alt="Profile"></span>
          <div class="menu-content" id="profileMenu">
            <div id="socialLinks"></div>
            <a href="#"><img src="../img/user.png" alt="Profile Icon">Profile</a>
            <a href="#"><img src="../img/settings.png" alt="Settings Icon">Settings</a>
            <div class="separator"></div>
            <a href="#"><img src="../img/logout.png" alt="Log Out Icon">Log out</a>
          </div>
        </div>
      </div>
    </nav>
  `;

  // Updated styles with responsive design
  const styles = `
    <style>
      body {
        padding-top: 60px;
      }

      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1030;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
      }

      .navbar-brand img {
        height: 30px;
        margin-right: 10px;
      }

      .search-container {
        position: relative;
        width: 100%;
      }

      .search-container input {
        width: 100%;
        padding: 8px 35px 8px 15px;
        border-radius: 20px;
        border: 1px solid #ddd;
        outline: none;
        transition: border-color 0.2s;
      }

      .search-container input:focus {
        border-color: #007bff;
      }

      .search-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }

      .menu {
        position: relative;
        margin-left: 15px;
      }

      .menu .icon {
        cursor: pointer;
      }

      .menu .icon img {
        height: 24px;
        width: 24px;
      }

      .menu-content {
        display: none;
        position: absolute;
        right: 0;
        top: 100%;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        min-width: 200px;
        padding: 8px 0;
        margin-top: 10px;
      }

      .menu-content.show {
        display: block;
      }

      .menu-content a {
        display: flex;
        align-items: center;
        padding: 8px 15px;
        color: inherit;
        text-decoration: none;
        transition: background-color 0.2s;
      }

      .menu-content a:hover {
        background-color: #f5f5f5;
      }

      .menu-content img {
        height: 20px;
        width: 20px;
        margin-right: 10px;
      }

      .separator {
        height: 1px;
        background-color: #eee;
        margin: 8px 0;
      }

      #socialLinks {
        padding: 8px 15px;
      }

      #socialLinks a {
        display: inline-block;
        padding: 5px;
        color: #333;
      }

      #socialLinks i {
        font-size: 20px;
      }

      .project-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .project-card h3 {
        margin-top: 0;
        color: #333;
        margin-bottom: 15px;
      }

      .project-card p {
        margin-bottom: 8px;
      }

      /* Responsive styles */
      @media (max-width: 576px) {
        .brand-container {
          display: none !important;
        }
        
        .search-wrapper {
          display: none !important;
        }
        
        .navbar .container-fluid {
          justify-content: flex-end !important;
          padding-right: 15px;
        }

        .menu {
          margin-left: 0;
        }

        .menu-content {
          right: -15px;
        }
      }
    </style>
  `;

  // Insert navbar and styles
  document.body.insertAdjacentHTML("afterbegin", navbar);
  document.head.insertAdjacentHTML("beforeend", styles);

  // Initialize click-based profile menu
  const profileBtn = document.getElementById("profileMenuBtn");
  const profileMenu = document.getElementById("profileMenu");
  const socialLinks = document.getElementById("socialLinks");

  document.addEventListener("click", (event) => {
    if (
      !profileMenu.contains(event.target) &&
      !profileBtn.contains(event.target)
    ) {
      profileMenu.classList.remove("show");
    }
  });

  profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    profileMenu.classList.toggle("show");
  });

  // Add sponsor social links if UID is available
  if (uid) {
    getSponsorData(uid).then((sponsorData) => {
      if (sponsorData) {
        let socialLinksHTML = "";

        if (sponsorData.email_add) {
          socialLinksHTML += `<a href="mailto:${sponsorData.email_add}"><i class="fas fa-envelope"></i></a>`;
        }
        if (sponsorData.facebook_link) {
          socialLinksHTML += `<a href="${sponsorData.facebook_link}" target="_blank"><i class="fab fa-facebook"></i></a>`;
        }
        if (sponsorData.website) {
          socialLinksHTML += `<a href="${sponsorData.website}" target="_blank"><i class="fas fa-globe"></i></a>`;
        }

        if (socialLinksHTML) {
          socialLinks.innerHTML = socialLinksHTML;
        }
      }
    });
  }
}
