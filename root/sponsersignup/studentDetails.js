studentDetials.js
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS6yp8D-82OMm_s3AmwCJfyDKFhGl0V0",
  authDomain: "wad-proj-2b37f.firebaseapp.com",
  databaseURL: "https://wad-proj-2b37f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad-proj-2b37f",
  storageBucket: "wad-proj-2b37f.appspot.com",
  messagingSenderId: "873354832788",
  appId: "1:873354832788:web:41105e10dd0f7651607d81",
  measurementId: "G-LFFLPT7G58"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get the userId from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

// Reference to HTML elements where data will be displayed
const studentNameDisplay = document.getElementById('student-name');
const studentEmailDisplay = document.getElementById('student-email');
const studentHoursLeftDisplay = document.getElementById('student-hours-left');

// Function to fetch and display student details
async function fetchStudentDetails() {
  if (!userId) {
      console.error('No userId found in URL');
      return;
  }

  try {
      const snapshot = await database.ref(`students/${userId}`).once('value');
      const studentData = snapshot.val();

      if (studentData) {
          // Populate HTML elements with the student's data
          studentNameDisplay.textContent = studentData.name || 'N/A';
          studentEmailDisplay.textContent = studentData.email || 'N/A';
          studentHoursLeftDisplay.textContent = studentData.hours_left || 'N/A';
      } else {
          console.log('No data available for this student');
      }
  } catch (error) {
      console.error('Error fetching student data:', error);
  }
}

// Call the function to fetch student details when the page loads
fetchStudentDetails();
