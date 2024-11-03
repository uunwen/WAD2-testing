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
      filterProjectName: "",
      filterAdmission: "allAdmission",
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
      // Iterate over selected events
      console.log(this.selectedEvents);
    }
  }
});


adminApp.component('communityServiceRecords', {
  props: ['record', 'index'],
  emits: ["updateStatus"],
  template: `
        <tr>
            <td>{{ index }}</td>
            <td>{{ record['Admissions Period'] }}</td>
            <td>{{ record.Capacity }}</td>
            <td>{{ record.Location }}</td>
            <td>{{ record.Organiser }}</td>
            <td>{{ record['Project Name'] }}</td>
            <td>{{ record.Region }}</td>
            <td>{{ record['Session(s)'] }}</td>
            <td>{{ record['Total CSP hours'] }}</td>
            <td>{{ record['Volunteer Period'] }}</td>
            <td><button class="btn btn-light" @click="$emit('update-status', index)">{{ record.Status }}</button></td>
            <td><button class="btn btn-light">View</button></td>
        </tr>
  `
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
