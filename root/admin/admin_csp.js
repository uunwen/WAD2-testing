const userData = JSON.parse(sessionStorage.getItem('user'));

// Check if userData exists and if userType is not 'admin'
if (!userData || userData.userType !== "admin") {
  // Clear session storage and redirect to login page
  sessionStorage.clear();
  window.location.href = "../login/login.html";
}

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const dbStore = getFirestore(app);
const database = getDatabase(app);
const dbRef = ref(database); // Reference to the root of the database

const adminApp = Vue.createApp({
  data() {
    return {
      allEvents: {},
      selectedEvents: {},
      minHour: 0,
      maxHour: 0,
      organisers: [],
      filterMinHours: this.minHour,
      filterMaxHours: this.maxHour,
      filterProjectStatus: "allProjects",
      filterProjectName: "",
      filterAdmission: "allAdmission",
      filterOrganiser: "allOrganisers",
      currentPhotoIndex: 0,
      modalDetails: {
        photos: [],
      },
      signups: [],
      showModal: false,
      currentIndex: -1,
      isFilterMenuOpen: false,
      sortColumn: '',       // track the currently sorted column
      sortAscending: true,  // track sorting order
    };
  },
  mounted() {
    this.loadCommunityServices();
    window.addEventListener("resize", this.checkScreenWidth);
    this.checkScreenWidth();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
  watch: {

  },
  methods: {
    sortData(column) {
      // Log to verify column click
      console.log(`Sorting by column: ${column}`);
  
      // Toggle sort order if the same column is clicked, otherwise reset to ascending
      if (this.sortColumn === column) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.sortColumn = column;
        this.sortAscending = true;
      }
  
      // Perform the sorting directly on selectedStudents
      this.selectedEvents = [...this.selectedEvents].sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
  
        // Handle undefined or null values by treating them as empty strings or zeros
        const parsedAValue = aValue === undefined || aValue === null ? '' : aValue;
        const parsedBValue = bValue === undefined || bValue === null ? '' : bValue;
  
        // Sort strings and numbers differently
        if (typeof parsedAValue === 'string' && typeof parsedBValue === 'string') {
          return this.sortAscending 
            ? parsedAValue.localeCompare(parsedBValue)
            : parsedBValue.localeCompare(parsedAValue);
        } else {
          return this.sortAscending 
            ? parsedAValue - parsedBValue 
            : bValue - parsedAValue;
        }
      });
    },
    toggleFilterMenu() {
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    },
    openFilterOnHover() {
      if (window.innerWidth >= 768) {
        this.isFilterMenuOpen = true;
      }
    },
    closeFilterOnHover() {
      if (window.innerWidth >= 768) {
        this.isFilterMenuOpen = false;
      }
    },
    checkScreenWidth() {
      // This checks the screen width and manages the filter menu visibility based on screen size
      if (window.innerWidth < 768) {
        this.isFilterMenuOpen = false; // Hide menu on small screens
      }
    },
    openModal(record, index) {
      this.modalDetails = { ...record };  // Store the record data in modalDetails
      this.showModal = true;  // Show the modal
      this.currentIndex = index;
      this.currentPhotoIndex = 0;
      this.displayEventPhoto(record["Project Name"]);
    },
    closeModal() {
      this.showModal = false;  // Close the modal
    },
    async loadCommunityServices() {
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            this.allEvents = Object.keys(data.events).map(eventKey => ({
              ...data.events[eventKey],
              eventKey,
            }));
            // Initially set selectedEvents to allEvents
            this.selectedEvents = this.allEvents;
            this.findFilterParameters();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    async updateStatus(index) {
      const selectedEvent = this.selectedEvents[index];
      if (selectedEvent.Status === "Not Approved") {
        try {
          const statusRef = ref(database, `events/${selectedEvent.eventKey}`);
          await update(statusRef, { Status: "Approved" });
          selectedEvent.Status = "Approved"; // Update the local data
          console.log("Status successfully updated!");
          if (this.modalDetails != {}) {
            this.modalDetails.Status = "Approved"
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }
      else if (selectedEvent.Status === "Approved") {
        try {
          const statusRef = ref(database, `events/${selectedEvent.eventKey}`);
          await update(statusRef, { Status: "Not Approved" });
          selectedEvent.Status = "Not Approved"; // Update the local data
          console.log("Status successfully updated!");
        } catch (error) {
          console.error("Error updating status:", error);
        }
        if (this.modalDetails != {}) {
          this.modalDetails.Status = "Not Approved"
        }
      }

    },
    findFilterParameters() {
      if (this.allEvents.length > 0) {
        const firstEventHours = this.allEvents[0]["Total CSP hours"];
        this.minHour = firstEventHours;
        this.maxHour = firstEventHours;
      }
      for (const event of this.allEvents) {
        const hours = event["Total CSP hours"];
        const organiser = event["Organiser"];
        if (hours < this.minHour) {
          this.minHour = hours;
        }
        if (hours > this.maxHour) {
          this.maxHour = hours;
        }
        if (!this.organisers.includes(organiser)) {
          this.organisers.push(organiser);
        }
      }

      this.filterMinHours = this.minHour
      this.filterMaxHours = this.maxHour
    },
    updateCommunityServices() {
      const date = new Date();
      this.selectedEvents = []; // Clear previous selections

      // Filter Admission Period Status  
      // Iterate over all events

      for (const event of this.allEvents) {

        // Split the Admissions Period and trim any whitespace
        const admissionsPeriod = event["Admissions Period"].split('–').map(period => period.trim());

        // Check if the admissions period has two parts before proceeding
        if (admissionsPeriod.length === 2) {
          // Parse the start and end dates
          const startDate = new Date(admissionsPeriod[0]);
          const endDate = new Date(admissionsPeriod[1]);

          // Check if the current date is within the admissions period
          if (this.filterAdmission === "allAdmission") {
            this.selectedEvents.push(event)
          }
          else if (this.filterAdmission === "ongoingAdmission" && date >= startDate && date <= endDate) {
            this.selectedEvents.push(event);
          }
          else if (this.filterAdmission === "upcomingAdmission" && date < startDate) {
            this.selectedEvents.push(event);
          }
          else if (this.filterAdmission === "completedAdmission" && date > endDate) {
            this.selectedEvents.push(event);
          }
        }
      }

      // Filter Project Name
      if (this.filterProjectName != "") {
        this.selectedEvents = this.selectedEvents.filter(event =>
          event["Project Name"].toLowerCase().includes(this.filterProjectName.toLowerCase())
        );
      }

      //Filter Project Status
      if (this.filterProjectStatus == "approvedProjects") {
        this.selectedEvents = this.selectedEvents.filter(event =>
          event["Status"] == "Approved"
        );
      }
      else if (this.filterProjectStatus == "notApprovedProjects") {
        this.selectedEvents = this.selectedEvents.filter(event =>
          event["Status"] == "Not Approved"
        );
      }

      // Filter Organisers
      if (this.filterOrganiser != "allOrganisers") {
        this.selectedEvents = this.selectedEvents.filter(event =>
          event["Organiser"] == this.filterOrganiser
        );
      }

      // Filter Total CSP Hours
      this.selectedEvents = this.selectedEvents.filter(event =>
        event["Total CSP hours"] <= this.filterMaxHours && event["Total CSP hours"] >= this.filterMinHours
      );
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    },
    checkStatus(status, admissionPeriod) {
      if (status == "Not Approved") {
        return "glowing-circle-red";
      }
      else {
        try {
          const admission = admissionPeriod.split('–').map(period => period.trim());

          // Check if the admissions period has two parts before proceeding
          if (admission.length == 2) {
            const date = new Date();
            // Parse the start and end dates
            const startDate = new Date(admission[0]);
            const endDate = new Date(admission[1]);

            if (date >= startDate && date <= endDate) {
              return "glowing-circle-green"
            }
            else if (date < startDate) {
              return "glowing-circle-orange"
            }
            else {
              return "glowing-circle-black"
            }
          }
        }
        catch {
          console.error("Error parsing admission period.");
        }
      }
      return "glowing-circle-black"
    },
    async displayEventPhoto(projectName) {
      const eventsRef = collection(dbStore, "events");
      const q = query(eventsRef, where("Project Name", "==", projectName));
      const querySnapshot = await getDocs(q);

      let test = 0; // Use `let` to modify test
      this.modalDetails.photos = []; // Initialize photos to empty array

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const photos = data.Photos || []; // Use `let` to allow modification if needed

          test += 1;

          // If photos exist, add them to modalDetails
          this.modalDetails.photos = photos;  // This will overwrite photos for each iteration
        });
      } else {
        // No matching events found
        this.modalDetails.photos = [];
      }
    }


  }
});

adminApp.component('organisersList', {
  props: ['organiser'],
  emits: [],
  template: `
        <option :value="organiser">{{organiser}}</option>
  `
});

adminApp.component('communityServiceRecords', {
  props: ['record', 'index'],
  emits: ['open-modal', 'update-status'],
  template: `
    <tr>
      <td class="align-middle">
        <div :class="checkStatus(record.Status, record['Admissions Period'])"></div>
      </td>
      <td class="hide-md align-middle">{{ record['Admissions Period'] }}</td>
      <td class="align-middle">
        {{ getSignupsCount(record) }} / {{ record.Capacity }}
      </td>
      <td class="hide-xl align-middle">{{ record.Location }}</td>
      <td class="hide-lg align-middle">{{ record.Organiser }}</td>
      <td class="align-middle">{{ record['Project Name'] }}</td>
      <td class="hide-xxl align-middle">{{ record.Region }}</td>
      <td class="hide-xxl align-middle">{{ record['Session(s)'] }}</td>
      <td class="hide-lg align-middle">{{ record['Total CSP hours'] }}</td>
      <td class="hide-xl align-middle">{{ record['Volunteer Period'] }}</td>
      <td class="align-middle hide-xl">
        <button 
          :class="record.Status === 'Approved' ? 'btn btn-success' : 'btn btn-danger'" 
          @click="$emit('update-status', index)">
          {{ record.Status }}
        </button>
      </td>
      <td class="align-middle">
        <button class="btn btn-light" @click="$emit('open-modal', record, index)">View</button>
      </td>
    </tr>
  `,
  methods: {
    checkStatus(status, admissionPeriod) {
      if (status === 'Not Approved') return 'glowing-circle-red';

      try {
        const [start, end] = admissionPeriod.split('–').map(date => new Date(date.trim()));
        const currentDate = new Date();

        if (start && end) {
          if (currentDate >= start && currentDate <= end) {
            return 'glowing-circle-green';
          } else if (currentDate < start) {
            return 'glowing-circle-orange';
          } else {
            return 'glowing-circle-black';
          }
        }
      } catch (error) {
        console.error('Error parsing admission period:', error);
      }

      return 'glowing-circle-black';
    },
    getSignupsCount(record) {
      // Check if record.signups is an array and return its length; otherwise return 0
      if (Array.isArray(record.signups)) {
        return record.signups.length;
      } else if (record.signups && typeof record.signups === 'object') {
        // If signups is an object (e.g., it could be an object with keys and values)
        return Object.keys(record.signups).length;
      } else {
        // Fallback for cases where signups is not defined or is not an array/object
        return 0;
      }
    }
  }
});


adminApp.component('studentList', {
  props: ['student'],
  emits: [],
  template: `
        <tr>
            <td class="align-middle">{{ student[ 'name' ] }}</td>
            <td class="align-middle">{{ student['email'] }}</td>
        </tr>
  `
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)

document.getElementById("logout-link").addEventListener("click", function(event) {
  // Clear sessionStorage to end the session
  sessionStorage.clear();
});