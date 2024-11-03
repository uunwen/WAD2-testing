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
      allStudents: [],
      selectedStudents: [],
      minHour: 0,
      maxHour: 0,
      filterMinHours: this.minHour,
      filterMaxHours: this.maxHour,
      filterStudentName: "",
    };
  },
  mounted() {
    this.loadStudents();
  },
  watch: {

  },
  methods: {
    async loadStudents() {
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            this.allStudents = Object.keys(data.students).map(studentKey => ({
              ...data.students[studentKey],
              studentKey,
            }));
            // Initially set selectedStudents to allStudents
            this.selectedStudents = this.allStudents;
            this.findFilterParameters();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    findFilterParameters() {
      if (this.allStudents.length > 0) {
        const firstHour = this.allStudents[0]["hours_left"];
        this.minHour = firstHour;
        this.maxHour = firstHour;
      }
      for (const student of this.allStudents) {
        const hours = student["hours_left"];
        if (hours < this.minHour) {
          this.minHour = hours;
        }
        if (hours > this.maxHour) {
          this.maxHour = hours;
        }
      }

      this.filterMinHours = this.minHour
      this.filterMaxHours = this.maxHour
    },
    updateRecords() {

      this.selectedStudents = this.allStudents.filter(student => {
        // Filter by student name
        const matchesName = this.filterStudentName === "" || student.name.toLowerCase().includes(this.filterStudentName.toLowerCase());
        
        // Filter by hours left
        const matchesHours = student.hours_left >= this.filterMinHours && student.hours_left <= this.filterMaxHours;

        // Return true if both conditions match
        return matchesName && matchesHours;
      });
    }
  }
});


adminApp.component('studentRecords', {
  props: ['record', 'index'],
  emits: [],
  template: `
        <tr>
            <td class="align-middle">{{ index }}</td>
            <td class="align-middle">{{ record.name }}</td>
            <td class="align-middle">{{ record.email }}</td>
            <td class="align-middle">{{ record.hours_left }}</td>
        </tr>
  `
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
