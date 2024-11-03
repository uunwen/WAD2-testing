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
      textBox: "",
    };
  },
  mounted() {
    this.loadCommunityServices();
  },
  watch: {
    textBox() {
      this.updateCommunityServices();
    }
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
      this.selectedEvents = this.allEvents.filter(event =>
        event["Project Name"].toLowerCase().includes(this.textBox.toLowerCase())
      );
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
