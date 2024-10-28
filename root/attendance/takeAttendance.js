app.unmount("#app");

const createApp = Vue.createApp({
  data() {
    return {
      attendanceList: [],
      isScanning: false,
      scanner: null,
    };
  },
  methods: {
    startAttendance() {
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
    onScanSuccess(result) {
      this.getUserDataByUid(result)
        .then((userData) => {
          if (userData) {
            console.log("User's name:", userData.name);
            this.addAttendance(userData);
          }
        })
        .catch((error) => {
          console.error("Failed to get user data:", error);
        });
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
    addAttendance(userData) {
      this.attendanceList.push({
        uid: userData.uid,
        name: userData.name,
        timestamp: new Date().toLocaleString(),
      });
    },
  }, // methods
}).mount("#app2");
