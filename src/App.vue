<template>
  <div id="app">
    <!-- Navigation Links -->
    <nav>

    </nav>

    <!-- Render Voting System only on the /home route -->
    <div v-if="isHomePage">
      <h1>Voting System</h1>
      <h2>Nominees:</h2>
      <ul>
        <li v-for="nominee in nominees" :key="nominee.id">
          {{ nominee.name }} - {{ nominee.score }} votes
          <button @click="submitVote(nominee.id)">Vote</button>
          <button @click="renameNominee(nominee)">Rename</button>
        </li>
      </ul>
    </div>

    <!-- Vote Response Message -->
    <div v-if="voteResponseMessage">
      <p>{{ voteResponseMessage }}</p>
    </div>

    <!-- Render the matched component (dynamic content based on routes) -->
    <router-view></router-view>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import { auth } from "@/firebase"; // Import the Firebase auth module
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener

export default {
  name: 'App',
  data() {
    return {
      socket: null,
      nominees: [],
      voteResponseMessage: '',
      isHomePage: false,  // To control if the Voting System is visible
      isAuthenticated: false, // Track authentication status
    };
  },
  methods: {
    // Submit a vote for the selected nominee
    submitVote(nomineeId) {
      const userId = 'lpamallari.student@ua.edu.ph'; // Replace with dynamic user ID
      this.socket.emit('submitVote', { userId, nomineeId });
    },

    // Rename a nominee
    renameNominee(nominee) {
      const newName = prompt("Enter new name for the nominee:", nominee.name);
      if (newName) {
        this.socket.emit('renameNominee', { id: nominee.id, name: newName });
      }
    },

    // Check if the current route is 'home' (for displaying the Voting System)
    checkIfHomePage() {
      this.isHomePage = this.$route.path === '/home';
    },

    // Check if the user is authenticated
    checkAuthentication() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
          // Redirect to login page if not authenticated
          this.$router.push('/');
        }
      });
    }
  },
  created() {
    // Check if the user is authenticated when the app is created
    this.checkAuthentication();

    // Create a socket connection to the backend server on localhost:3001
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    // Listen for nominee updates from the server
    this.socket.on('nomineeUpdate', (updatedNominees) => {
      this.nominees = updatedNominees;
    });

    // Listen for vote submission response
    this.socket.on('voteResponse', (response) => {
      this.voteResponseMessage = response.message;
    });

    // Check if current route is 'home' to show the Voting System
    this.checkIfHomePage();
  },
  watch: {
    // Watch for route changes and update `isHomePage` accordingly
    '$route': 'checkIfHomePage'
  },
  beforeUnmount() {
    // Clean up the socket connection when the component is destroyed
    if (this.socket) {
      this.socket.off('nomineeUpdate');
      this.socket.off('voteResponse');
    }
  },
};
</script>

<style scoped>
/* Styles for the page */
#app {
  text-align: center;
  padding: 20px;
}

nav {
  margin-bottom: 20px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 5px;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

h1 {
  color: #333;
}
</style>
