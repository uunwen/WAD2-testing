const userData = JSON.parse(sessionStorage.getItem('user'));

// Check if userData exists and if userType is not 'admin'
if (!userData || userData.userType !== "admin") {
  // Clear session storage and redirect to login page
  sessionStorage.clear();
  window.location.href = "../login/login.html";
}


// Import Firebase modules from CDN
import { Chart, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PieController } from 'https://cdn.jsdelivr.net/npm/chart.js@3.8.0/dist/chart.esm.min.js';

// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PieController);
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
      modalDetails: {},
      showModal: false,
      message: "",
      currentIndex: -1,
      isFilterMenuOpen: false,
      sortColumn: '',       // track the currently sorted column
      sortAscending: true,  // track sorting order
      studentsWithHoursChart: null // Variable to store the chart instance
    };
  },
  mounted() {
    this.loadStudents();
  },
  watch: {

  },
  methods: {
    createStudentsWithHoursChart() {
      const studentsWithHours = this.allStudents.filter(student => student.hours_left > 0).length;
      const studentsWithoutHours = this.allStudents.length - studentsWithHours;
    
      // Destroy previous chart instance if it exists
      if (this.studentsWithHoursChart) {
        this.studentsWithHoursChart.destroy();
      }
    
      // Select the canvas element where the chart will render
      const ctx = document.getElementById('studentsWithHoursChart').getContext('2d');
    
      // Create the pie chart with updated data
      this.studentsWithHoursChart = new Chart(ctx, {
        type: 'pie',  // Pie chart
        data: {
          labels: ['Students with > 0 Hours', 'Students with 0 Hours'],
          datasets: [{
            data: [studentsWithHours, studentsWithoutHours],
            backgroundColor: ['#4CAF50', '#FF6347'], // Colors for the chart
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    },
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
      this.selectedStudents = [...this.selectedStudents].sort((a, b) => {
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
      // Toggle the filter menu when the icon is clicked (for mobile)
      if (window.innerWidth < 768) {
        this.isFilterMenuOpen = !this.isFilterMenuOpen;
      }
    },
    openFilterOnHover() {
      // Show the filter menu on hover (for desktop)
      if (window.innerWidth >= 768) {
        this.isFilterMenuOpen = true;
      }
    },
    closeFilterOnHover() {
      // Hide the filter menu on mouse leave (for desktop)
      if (window.innerWidth >= 768) {
        this.isFilterMenuOpen = false;
      }
    },
    openModal(record, index) {
      this.modalDetails = { ...record };  // Store the record data in modalDetails
      this.showModal = true;  // Show the modal
      this.currentIndex = index
    },
    closeModal() {
      this.showModal = false;  // Close the modal
    },
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
            this.createStudentsWithHoursChart();
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
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    },
    async updateTasklist(index) {
      const student = this.allStudents[index];
      try {
        console.log(student)
        // Reference to the tasklist array in the database
        const tasklistRef = ref(database, `students/${student.studentKey}/tasklist`);

        // Get the current tasklist array
        const snapshot = await get(tasklistRef);
        let tasklist = snapshot.exists() ? snapshot.val() : [];

        // Add a new item to the tasklist array
        tasklist.push(this.message);

        // Update the array in the database
        await set(tasklistRef, tasklist);
        console.log("Tasklist successfully updated!");
        this.showModal = false;
        this.message = "";
      }
      catch (error) {
        console.error("Error updating tasklist:", error);
      }
    },
    checkGraduation(graduationYear) {
      const currentYear = new Date().getFullYear();
      if (graduationYear == currentYear + 1) {
        return "glowing-circle-red"
      }
      else if (graduationYear == currentYear + 2) {
        return "glowing-circle-orange"
      }
      return "glowing-circle-green"
    }
  }
});


adminApp.component('studentRecords', {
  props: ['record', 'index'],
  emits: ['open-modal'],
  template: `
        <tr>
            <td class="align-middle"><div style="display: inline-block;" :class="checkGraduation(record['graduation_year'])"></div></td>
            <td class="align-middle">{{ record.name }}</td>
            <td class="hide-md align-middle">{{ record.email }}</td>
            <td class="align-middle">{{ record['graduation_year'] }}</td>
            <td class="align-middle">{{ record.hours_left }}</td>
            <td class="align-middle"><button class="btn btn-light" @click="$emit('open-modal', record, index)">Message</button></td>
        </tr>
  `,
  methods: {
    checkGraduation(graduationYear) {
      const currentYear = new Date().getFullYear();
      if (graduationYear == currentYear + 1) {
        return "glowing-circle-red"
      }
      else if (graduationYear == currentYear + 2) {
        return "glowing-circle-orange"
      }
      return "glowing-circle-green"
    }
  }
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)

document.getElementById("logout-link").addEventListener("click", function(event) {
  // Clear sessionStorage to end the session
  sessionStorage.clear();
});
