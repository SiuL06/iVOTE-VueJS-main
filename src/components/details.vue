<template>
  <div>
    <header>
      <nav>
        <div class="nav-left">
          <ul>
            <li><a href="/landing" style="color: #2D3038; text-decoration: none; font-family: agrandir;" class="homeBtn">iVOTE</a></li>
          </ul>
        </div>
        <div class="nav-right">
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <!-- Logout Button -->
            <li><button @click="logout" class="logoutBtn">Logout</button></li>
          </ul>
        </div>
      </nav>
    </header>

    <main>
      <section class="content">
        <h2>Election Results</h2>
        <p>Here are the nominees and their respective vote counts:</p>

        <!-- Check if there are no nominees, show the fallback message -->
        <div v-if="nominees.length === 0" class="no-results">
          <p>No results available yet.</p>
        </div>

        <!-- Display each nominee's name and vote count -->
        <div v-else class="nominee-container">
          <div v-for="nominee in nominees" :key="nominee.name" class="nominee-card">
            <div class="nominee-name">{{ nominee.name }}</div>
            <div class="vote-count">{{ nominee.votes }} votes</div>
            <img :src="nominee.image" alt="Nominee Image" class="nominee-image">
          </div>
        </div>

        <button class="btn" @click="goBack">Go Back</button>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 iVote. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { db } from '@/firebase'; // Assuming you have Firebase setup
import { auth } from '@/firebase'; // Assuming Firebase Authentication is being used

export default {
  name: 'DetailsPage',
  data() {
    return {
      nominees: [], // Array to store nominees and their votes
    };
  },
  mounted() {
    this.fetchNomineeData(); // Fetch nominee data when the page is mounted
  },
  methods: {
    async fetchNomineeData() {
      try {
        const nomineesRef = db.collection('elections').doc('current'); // Adjust path if needed
        const nomineesDoc = await nomineesRef.get();
        if (nomineesDoc.exists) {
          const nomineesData = nomineesDoc.data().nominees; // Assuming nominees are stored under 'nominees' in Firebase
          this.nominees = nomineesData; // Store fetched data into nominees array
        } else {
          // Handle the case when no election data is found
          this.nominees = []; // Ensure nominees array is empty if no data
        }
      } catch (error) {
        console.error('Error fetching nominee data: ', error);
        this.nominees = []; // Handle the error and set nominees to empty
      }
    },
    goBack() {
      this.$router.push('/'); // Adjust route as needed to go back to the home page
    },
    // Logout method
    logout() {
      auth.signOut().then(() => {
        localStorage.removeItem('account');
        this.$router.push('/'); // Redirect to the login page after logout
      }).catch(error => {
        console.error('Logout error: ', error);
      });
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: agrandir;
}

body {
  font-family: agrandir;
  background-color: #f4f4f4;
  color: #333;
}

header {
  background-color: #fff;
  color: #fff;
  padding: 10px 0;
  font-family: agrandir;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  padding-right: 50px;
  font-size: 20px;
  font-family: agrandir;
}

.homeBtn {
  font-size: 20px;
  font-weight: bold;
  transition: 0.2s ease;
}

.homeBtn:hover {
  cursor: pointer;
  opacity: .3;
}

.nav-left ul li {
  font-size: 30px;
  padding-left: 0px;
  list-style: none;
  text-decoration: none;
  margin: 0;
  color: #2D3038;
}

.nav-right ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-right ul li a {
  color: #2D3038;
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: agrandir;
}

.nav-right ul li a:hover {
  color: #ccc;
}

.nav-right ul li button.logoutBtn {
  font-size: 20px;
  margin-bottom: 0px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  border: none;
  background: transparent;
}

.nav-right ul li button.logoutBtn:hover {
  opacity: 0.3;
}


.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  padding-bottom: 38vh;
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
  border-radius: 8px;
}

.content h2 {
  font-size: 25px;
  margin-bottom: 10px;
  color: white;
  text-align: center;
}

.content p {
  font-size: 18px;
  margin-bottom: 20px;
  color: white;
  text-align: center;
}

.nominee-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.nominee-card {
  background-color: #383C47;
  color: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 500px;
}

.nominee-name {
  font-size: 20px;
  font-weight: bold;
}

.vote-count {
  font-size: 18px;
  margin-left: 10px;
}

.nominee-image {
  max-width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.no-results {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.content .btn {
  background-color: #383C47;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 10px;
}

.content .btn:hover {
  background-color: #2D3038;
}

footer {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #555;
  font-family: Arial, Helvetica, sans-serif !important;
}
</style>
