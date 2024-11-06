/**
 * @author Chan Yun Wen
 */

// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Import filtered event from sponsor1.js
import {
  getSponsorOrg_name,
  getFilteredEventsByOrganizer,
  getEventfromUid,
  getDurationFromEventSession,
} from "./sponsor1.js";

// Firebase settings
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

// Initialize Realtime Database and get a reference to the service
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const createApp = Vue.createApp({
  data() {
    return {
      attendanceList: [],
      checkoutList: [],
      isScanning: false,
      scanner: null,
      isEndAttendance: false, // Track if we're in end attendance mode
      selectedEvent: "", // Track selected event
      org_name: null,
      filteredEvent: [],
      userUid: "",
      
    };
  },
  async mounted() {
    this.org_name = await getSponsorOrg_name();
    this.filteredEvent = await getFilteredEventsByOrganizer(this.org_name);
    console.log(this.filteredEvent[0][1]);
  },

  methods: {
    startAttendance() {
      this.selectedEvent = document.getElementById("events").value;
      if (!this.selectedEvent) {
        alert("Please select an event first!");
        return;
      }
      this.isEndAttendance = false;
      this.initializeScanner();
      this.isScanning = true;
    },

    endAttendance() {
      this.selectedEvent = document.getElementById("events").value;
      if (!this.selectedEvent) {
        alert("Please select an event first!");
        return;
      }
      this.isEndAttendance = true;
      this.initializeScanner();
      this.isScanning = true;
    },

    stopAttendance() {
      if (this.scanner) {
        this.scanner.clear();
        this.scanner = null;
      }
      this.isScanning = false;
    },

    initializeScanner() {
      this.scanner = new Html5QrcodeScanner("reader", {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      });
      this.scanner.render(this.onScanSuccess, this.onScanError);
    },

    async getEventUid(selectedEvent) {
      for (let i = 0; i < this.filteredEvent.length; i++) {
        if (this.filteredEvent[i][1]["Project Name"] === selectedEvent) {
          return this.filteredEvent[i][0];
        }
      }

      return loggedEventNames;
    },

    async handleCheckin(userData) {
      // TO-DO: WTF IS EVENTID,
      // Create new function to fix eventID --- ????????
      const eventUid = await this.getEventUid(this.selectedEvent);
      if (!eventUid) {
        console.error("Event UID not found");
        alert("Event not found in the system");
        return;
      }
      // TO-DO: WTF IS EVENTID --- ????????

      // TESTING PORTION! NEED TO SHIFT THIS DOWN TO SCANEND!!!!

      console.log(eventUid);
      const event = await getEventfromUid(eventUid); //get event from uid
      console.log(event["Session(s)"]);
      const duration = getDurationFromEventSession(event["Session(s)"]); //get duratin from session
      console.log(duration);

      // TESTING PORTION! NEED TO SHIFT THIS DOWN TO SCANEND!!!!

      console.log();
      const updatedCheckin = {};

      if (userData[eventUid] === false) {
        try {
          const studentRef = ref(database, `students/${this.userUid}`);
          updatedCheckin[eventUid] = true;
          await update(studentRef, updatedCheckin);

          // Add to attendance list for display
          this.attendanceList.push({
            name: userData.name,
            clockInTimestamp: new Date().toLocaleString(),
            status: "Checked In",
          });
        } catch (error) {
          console.error("Failed to update attendance:", error);
          alert("Failed to record attendance");
        }
      } else if (userData[eventUid] === true) {
        alert("User has already checked in for this event!");
      } else {
        alert("User is not registered for this event!");
      }
    },

    async handleCheckout(userData) {
      const eventUid = await this.getEventUid(this.selectedEvent);

      // Verify that the user checked in earlier (event value is true)
      if (userData[eventUid] === true) {
        this.isEndAttendance = false;
        try {
          // Get event hours

          // To-do: GET HOURS CORROSPONDING TO THE EVENT SESSION ----

          let eventHours = 2;
          const userHoursLeft = userData["hours_left"];

          // Calculate new hours_left

          // To-do: ADJUST THE HOURS BASED ON ROUND UP/ROUND DOWN ---
          // To-do: NEED TO PREVENT DOUBLE SCANNINIG ---
          const updatedHours = {};
          const studentRef = ref(database, `students/${this.userUid}`);
          updatedHours["hours_left"] = userHoursLeft - eventHours;

          // Update to firebase
          await update(studentRef, updatedHours);

          // Add to checkout list for display
          this.checkoutList.push({
            name: userData.name,
            clockOutTimestamp: new Date().toLocaleString(),
            hoursDeducted: eventHours,
          });
        } catch (error) {
          console.error("Failed to update hours:", error);
          alert("Failed to process checkout");
        }
      } else {
        alert("User hasn't checked in for this event or has no hours left!");
      }
    },

    async onScanSuccess(result) {
      try {
        const userData = await this.getUserDataByUid(result);
        this.userUid = result;
        if (!userData) return;

        if (this.isEndAttendance) {
          console.log(userData);
          await this.handleCheckout(userData);
        } else {
          await this.handleCheckin(userData);
        }
      } catch (error) {
        console.error("Scan processing failed:", error);
      }
    },
    onScanError(err) {
      console.error(err);
    },

    getUserDataByUid(uid) {
      const userRef = ref(database, "students/" + uid);

      return get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("User data:", userData);
            return { ...userData, uid };
          } else {
            console.log("No data available for this user");
            return null;
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
          throw error;
        });
    },
  }, // methods
}).mount("#app");

async function updateOptions() {
  const org_name = await getSponsorOrg_name();
  let filteredEvent = await getFilteredEventsByOrganizer(org_name);

  const eventsSelect = document.getElementById("events");

  // Clear existing options
  eventsSelect.innerHTML = "";

  // Add default empty option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select an event";
  defaultOption.value = "";
  eventsSelect.add(defaultOption);

  // Populate with new options
  for (let i = 0; i < filteredEvent.length; i++) {
    let event = await filteredEvent[i][1]["Project Name"];
    const option = document.createElement("option");
    option.text = event;
    eventsSelect.add(option);
  }
}

updateOptions();
