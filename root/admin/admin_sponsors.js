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
      allSponsors: [],
      selectedSponsors: [],
      minCount: 0,
      maxCount: 0,
      filterMinCount: this.minCount,
      filterMaxCount: this.maxCount,
      filterSponsorName: "",
      isFilterMenuOpen: false,
      currentIndex: -1,
      showModal: false
    };
  },
  mounted() {
    this.loadSponsors();
  },
  watch: {

  },
  methods: {
    toggleFilterMenu() {
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    },
    openModal(record, index) {
      this.modalDetails = { ...record };  // Store the record data in modalDetails
      this.showModal = true;  // Show the modal
      this.currentIndex = index;
    },
    closeModal() {
      this.showModal = false;  // Close the modal
    },
    async loadSponsors() {
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            this.allSponsors = Object.keys(data.sponsors).map(sponsorkey => ({
              ...data.sponsors[sponsorkey],
              sponsorkey,
            }));
            // Initially set selectedSponsors to allSponsors
            this.selectedSponsors = this.allSponsors;
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
      if (this.allSponsors.length > 0) {
        this.minCount = Math.min(...this.allSponsors.map(sponsor => sponsor.project_list.length));
        this.maxCount = Math.max(...this.allSponsors.map(sponsor => sponsor.project_list.length));
      }
      this.filterMinCount = this.minCount;
      this.filterMaxCount = this.maxCount;
    },
    updateRecords() {

      this.selectedSponsors = this.allSponsors.filter(sponsor => {
        // Filter by sponsor name
        const matchesName = this.filterSponsorName == "" || sponsor.org_name.toLowerCase().includes(this.filterSponsorName.toLowerCase());
        const matchesCount = sponsor.project_list.length >= this.filterMinCount && sponsor.project_list.length <= this.filterMaxCount;
        // Return true if both conditions match
        return matchesName && matchesCount;
      });
    }
  }
});


adminApp.component('sponsorRecords', {
  props: ['record', 'index'],
  emits: ['open-modal'],
  template: `
        <tr>
            <td class="align-middle">{{ index }}</td>
            <td class="align-middle">{{ record.org_name }}</td>
            <td class="hide-lg align-middle"><a :href="record.website" target="_blank">{{ record.website }}</a></td>
            <td class="align-middle">{{ record.project_list.length }}</td>
            <td class="align-middle">
              <button class="btn btn-light" @click="$emit('open-modal', record, index - 1)">View</button>
            </td>
        </tr>
  `
});

const vm = adminApp.mount('#adminApp');
// component must be declared before app.mount(...)
