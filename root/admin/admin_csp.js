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
      allEvents: [],
      selectedEvents: [],
      minHour: 0,
      maxHour: 0,
      organisers: [],
      filterMinHours: this.minHour,
      filterMaxHours: this.maxHour,
      filterProjectStatus: "allProjects",
      filterProjectName: "",
      filterAdmission: "allAdmission",
      filterOrganiser: "allOrganisers"
    };
  },
  mounted() {
    this.loadCommunityServices();
  },
  watch: {

  },
  methods: {
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
      console.log(selectedEvent);
      if (selectedEvent.Status === "Not Approved") {
        try {
          const statusRef = ref(database, `events/${selectedEvent.eventKey}`);
          await update(statusRef, { Status: "Approved" });
          selectedEvent.Status = "Approved"; // Update the local data
          console.log("Status successfully updated!");
        } catch (error) {
          console.error("Error updating status:", error);
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
      console.log("Organiser", this.organiser);
      console.log("Min hours:", this.minHour);
      console.log("Max hours:", this.maxHour);
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
            console.log(`Added ongoing event: ${event['Project Name']}`);
          }
          else if (this.filterAdmission === "upcomingAdmission" && date < startDate) {
            this.selectedEvents.push(event);
            console.log(`Added upcoming event: ${event['Project Name']}`);
          }
          else if (this.filterAdmission === "completedAdmission" && date > endDate) {
            this.selectedEvents.push(event);
            console.log(`Added completed event: ${event['Project Name']}`);
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
    }

  }
});


adminApp.component('communityServiceRecords', {
  props: ['record', 'index'],
  emits: ["updateStatus"],
  template: `
        <tr>
            <td class="align-middle">{{ index }}</td>
            <td class="align-middle">{{ record['Admissions Period'] }}</td>
            <td class="align-middle">{{ record.Capacity }}</td>
            <td class="align-middle">{{ record.Location }}</td>
            <td class="align-middle">{{ record.Organiser }}</td>
            <td class="align-middle">{{ record['Project Name'] }}</td>
            <td class="align-middle">{{ record.Region }}</td>
            <td class="align-middle">{{ record['Session(s)'] }}</td>
            <td class="align-middle">{{ record['Total CSP hours'] }}</td>
            <td class="align-middle">{{ record['Volunteer Period'] }}</td>
            <td class="align-middle"><button class="btn btn-light" @click="$emit('update-status', index)">{{ record.Status }}</button></td>
            <td class="align-middle"><button class="btn btn-light">View</button></td>
        </tr>
  `
});

adminApp.component('organisersList', {
  props: ['organiser'],
  emits: [],
  template: `
        <option :value="organiser">{{organiser}}</option>
  `
});
const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
