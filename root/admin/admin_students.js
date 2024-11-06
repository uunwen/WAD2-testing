// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


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
      filterGraduation: "allGraduationYear",
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
        const matchesName = this.filterStudentName === "" ||
          student.name.toLowerCase().includes(this.filterStudentName.toLowerCase());

        // Filter by hours left
        const matchesHours = student.hours_left >= this.filterMinHours &&
          student.hours_left <= this.filterMaxHours;

        const currentYear = new Date().getFullYear();
        let matchesGraduationYear = true; // Default to true if no filter is applied

        // Graduation year filtering logic
        if (this.filterGraduation != "allGraduationYear") {
          const graduationYear = student.graduation_year; // Assuming graduationYear is a property in the student object

          if (this.filterGraduation == "within1Year") {
            matchesGraduationYear = graduationYear == currentYear + 1; // Graduating next year
          } else if (this.filterGraduation == "within2Years") {
            matchesGraduationYear = graduationYear === currentYear + 1 || graduationYear === currentYear + 2; // Graduating in one or two years
          }
        }

        
        // Return true if all conditions match
        return matchesName && matchesHours && matchesGraduationYear;
      });
    },
    async updateTasklist(index) {
      const student = this.allStudents[index];
      try {
        // Reference to the tasklist array in the database
        const tasklistRef = ref(database, `events/${student.studentKey}/tasklist`);
    
        // Get the current tasklist array
        const snapshot = await get(tasklistRef);
        let tasklist = snapshot.exists() ? snapshot.val() : [];
    
        // Add a new item to the tasklist array
        tasklist.push("Approved");
    
        // Update the array in the database
        await set(tasklistRef, tasklist);
        console.log("Tasklist successfully updated!");
      } 
      catch (error) {
        console.error("Error updating tasklist:", error);
      }
    }
  }
});


adminApp.component('studentRecords', {
  props: ['record', 'index'],
  emits: ['updateTasklist'],
  template: `
        <tr>
            <td :class="checkGraduation(record['graduation_year'])" class="align-middle"><b>{{ index }}</b></td>
            <td class="align-middle">{{ record.name }}</td>
            <td class="align-middle">{{ record.email }}</td>
            <td class="align-middle">{{ record['graduation_year'] }}</td>
            <td class="align-middle">{{ record.hours_left }}</td>
            <td class="align-middle"><button class="btn btn-light" @click="$emit('updateTasklist', index)">Message</button></td>
        </tr>
  `,
  methods: {
    checkGraduation(graduationYear) {
      const currentYear = new Date().getFullYear();
      if (graduationYear == currentYear + 1) {
        return "red"
      }
      else if (graduationYear == currentYear + 2) {
        return "orange"
      }
      return "green"
    }
  }
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
