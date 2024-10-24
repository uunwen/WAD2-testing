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
  
  const eventsRef = database.ref('events');
  
  // Function to fetch events and their student sign-ups
  async function fetchEventSignUps() {
    try {
      const snapshot = await eventsRef.once('value');
      const events = snapshot.val();
      const eventNames = [];
      const signUpCounts = [];
  
      for (const eventKey in events) {
        const signUps = await database.ref(`students`).once('value');
        const students = signUps.val();
        let count = 0;
  
        // Count the number of students signed up for the current event
        for (const userKey in students) {
          if (students[userKey][eventKey] === true) {
            count++;
          }
        }
  
        eventNames.push(events[eventKey]["Project Name"]); // Get the project name
        signUpCounts.push(count); // Add count to the array
      }
  
      createChart(eventNames, signUpCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to create the bar chart
  function createChart(eventNames, signUpCounts) {
    const ctx = document.getElementById('signupChart').getContext('2d');
    const signupChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: eventNames,
        datasets: [{
          label: 'Number of Students Signed Up',
          data: signUpCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Sign Ups'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Events'
            }
          }
        }
      }
    });
  }
  
  // Call fetchEventSignUps on page load
  window.onload = () => {
    fetchEventSignUps(); // Fetch event sign-ups when the page loads
  };
  