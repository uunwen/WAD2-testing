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
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Import filtered event from sponsor1.js
import {
  getSponsorOrg_name,
  getFilteredEventsByOrganizer,
  getEventfromUid,
  getDurationFromEventSession,
} from "./sponsor1.js";

const userData = JSON.parse(sessionStorage.getItem('user')); // Added by Jaxsen

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
      // TO-DO: EVENTID?
      // Create new function to fix eventID --- ????????
      const eventUid = await this.getEventUid(this.selectedEvent);
      if (!eventUid) {
        console.error("Event UID not found");
        alert("Event not found in the system");
        return;
      }
      // TO-DO: EVENTID --- ????????

      const updatedCheckin = {};

      // TO-DO:
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
      // To-do: NEED TO PREVENT DOUBLE SCANNINIG ---
      if (userData[eventUid] === true) {
        this.isEndAttendance = false;
        try {
          let name = userData.name;
          let timestamp = new Date().toLocaleString();

          // To-do: ADJUST THE HOURS BASED ON ROUND UP/ROUND DOWN ---
          let actualDuration = getDurationInHours(
            this.attendanceList[this.attendanceList.length - 1]
              .clockInTimestamp,
            timestamp
          );

          // GET HOURS BASED ON SESSION
          const event = await getEventfromUid(eventUid);
          const duration = getDurationFromEventSession(event["Session(s)"]);

          // FIND DIFFERENCE BETWEEN SESSION AND ACTUAL CLOCKIN HOURS
          let diffInActualnSessionDuration = actualDuration - duration;
          console.log(
            diffInActualnSessionDuration,
            diffInActualnSessionDuration <= 0
          );

          let eventHours;

          if (diffInActualnSessionDuration > 0) {
            eventHours = duration;
          } else if (diffInActualnSessionDuration <= 0) {
            eventHours = duration + diffInActualnSessionDuration;
            // To-do: CREATE VAR TO INDICATE MISSED HOURS DUE TO EARLY CLOCK-OUT ----------
            let missedHours = duration - eventHours;
            get(child(ref(database), `events/${eventUid}/signups`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const eventInfo = snapshot.val();
                  eventInfo["missed_hours"] = missedHours;
                  // to-do: CANNOT IDENTIFY WHERE IS THE CORROSPONDING SIGN-UPS FOR STUDENT,
                  console.log(eventInfo);
                } else {
                  console.log("No data available");
                }
              })
              .catch((error) => {
                console.error(error);
              });
            // To-do: CREATE VAR TO INDICATE MISSED HOURS DUE TO EARLY CLOCK-OUT ----------
          } else {
            alert("Failed to process checkout");
          }

          // Calculate new hours_left
          const userHoursLeft = userData["hours_left"];

          const updatedHours = {};
          const studentRef = ref(database, `students/${this.userUid}`);
          updatedHours["hours_left"] = userHoursLeft - eventHours;

          // Add to checkout list for display
          this.checkoutList.push({
            name: name,
            clockOutTimestamp: timestamp,
            hoursDeducted: eventHours,
          });

          // Update to firebase
          await update(studentRef, updatedHours);
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

// for handleCheckout
function getDurationInHours(dateString1, dateString2) {
  // Parse the date strings into Date objects
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = date2 - date1;

  // Convert milliseconds to hours
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

  // Round off the result
  return Math.round(diffInHours);
}

updateOptions();
