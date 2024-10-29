// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


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
const dbRef = ref(database); // Reference to the root of the database

const adminApp = Vue.createApp({
  data() {
    return {
      admissionsPeriod: [],
      capacity: [],
      description: [],
      location: [],
      organiser: [],
      projectName: [],
      projectRequirements: [],
      region: [],
      sessions: [],
      totalCSPHours: [],
      volunteerPeriod: [],
      status: [],
      eventKey: [],
    };
  }, // data
  computed: {

  },
  mounted() {
    this.loadCommunityServices();
  },
  methods: {
    getUser() {
      return this.account
    },
    async loadCommunityServices() {
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // dataDisplayDiv.innerHTML = ""; // Clear previous content
            console.log(data.events);
            // Assuming 'events' is the parent node of all event data
            for (const eventKey in data.events) {
              this.eventKey.push(eventKey);
              const eventDetails = data.events[eventKey];
              this.admissionsPeriod.push(eventDetails["Admissions Period"]);
              this.capacity.push(eventDetails["Capacity"]);
              this.description.push(eventDetails["Description"]);
              this.location.push(eventDetails["Location"]);
              this.organiser.push(eventDetails["Organiser"]);
              this.projectName.push(eventDetails["Project Name"]);
              this.projectRequirements.push(eventDetails["Project Requirements"]);
              this.region.push(eventDetails["Region"]);
              this.sessions.push(eventDetails["Session(s)"]);
              this.status.push(eventDetails["Status"]);
              this.totalCSPHours.push(eventDetails["Total CSP hours"]);
              this.volunteerPeriod.push(eventDetails["Volunteer Period"]);
            };
          }
          else {
            // dataDisplayDiv.innerHTML = "<p>No data available</p>"; // Show message if no data is found
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // dataDisplayDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
    },
    async updateStatus(index) {
      console.log(index);
      console.log(this.status[index]);
      if (this.status[index] === "Not Approved") {
        try {
          const statusRef = ref(database, `events/${this.eventKey[index]}`);
          await update(statusRef, { Status: "Approved" });
          this.status[index] = "Approved"; // Update the local data
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    }
  } // methods
});

adminApp.component('communityServiceRecords', {
  props: ['eventKey', 'index', 'admissionsPeriod', 'capacity', 'description', 'location',
    'organiser', 'projectName', 'projectRequirements', 'region',
    'sessions', 'totalCspHours', 'volunteerPeriod', 'status'],
  emits: ["updateStatus"],
  template:
    `
      <tr>
        <td>{{index}}</td>
        <td>{{admissionsPeriod}}</td>
        <td>{{capacity}}</td>
        <!-- <td>{{description}}</td> -->
        <td>{{location}}</td>
        <td>{{organiser}}</td>
        <td>{{projectName}}</td>
        <!-- <td>{{projectRequirements}}</td> -->
        <td>{{region}}</td>
        <td>{{sessions}}</td>
        <td>{{totalCspHours}}</td>
        <td>{{volunteerPeriod}}</td>
        <td><button id="{{index}}" class="btn btn-light" @click="$emit('updateStatus')">{{status}}</button></td>
        <td><button class="btn btn-light">View</button></td>
      </tr>
  `
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
