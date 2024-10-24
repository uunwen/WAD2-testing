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
  
  // Function to fetch and display student details
  async function fetchStudentDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId'); // Get the userId from the URL
  
    try {
      const snapshot = await database.ref('students/' + userId).once('value');
      const student = snapshot.val();
  
      if (student) {
        // Display student information
        const studentInfoDiv = document.getElementById('student-info');
        studentInfoDiv.innerHTML = `
          <h2>Name: ${student.name}</h2>
          <p>Email: ${student.email}</p>
         
        `;
      } else {
        console.log('No student found with this ID.');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  }
  
  // Call fetchStudentDetails on page load
  window.onload = fetchStudentDetails;
  