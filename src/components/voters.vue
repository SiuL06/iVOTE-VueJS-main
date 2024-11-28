<template>
  <div class="constraint-layout">
    <div class="background-overlay"></div> <!-- Add overlay for darkening -->
    <div class="overlay-container"> <!-- New overlay container -->
      <h2>Vote for Your Candidate</h2> <!-- Header -->
      <div class="candidates">
        <div
          v-for="(candidate, index) in candidates"
          :key="index"
          class="candidate-card"
          :class="{ selected: selectedCandidate === index }"
          @click="selectCandidate(index)"
        >
          <img :src="candidate.picture" :alt="candidate.name" />
          <p>{{ candidate.name }}</p>
          <div v-if="selectedCandidate === index" class="checkmark">✔</div>
        </div>
      </div>
      <button v-if="selectedCandidate !== null" @click="confirmVote">
        Press Again to Vote
      </button>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";

export default {
  name: "VoterComponent",
  data() {
    return {
      candidates: [
        { name: "Candidate 1", picture: "path/to/picture1.jpg" },
        { name: "Candidate 2", picture: "path/to/picture2.jpg" },
        { name: "Candidate 3", picture: "path/to/picture3.jpg" },
      ],
      selectedCandidate: null,
    };
  },
  methods: {
    selectCandidate(index) {
      this.selectedCandidate = this.selectedCandidate === index ? null : index;
    },
    async confirmVote() {
      if (this.selectedCandidate === null) return;

      try {
        const db = getFirestore();
        const candidate = this.candidates[this.selectedCandidate];
        const candidateDocRef = doc(db, "candidates", candidate.name);

        // Increment the vote count for the selected candidate
        await updateDoc(candidateDocRef, {
          votes: increment(1),
        });

        alert(`Your vote for ${candidate.name} has been recorded!`);
        this.selectedCandidate = null;
      } catch (error) {
        console.error("Error saving vote:", error);
        alert("An error occurred while saving your vote.");
      }
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'agrandir';
  src: url('@/assets/agrandir.otf');
}

html, body {
  height: 100%;
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

.constraint-layout {
  position: absolute; /* Change to absolute positioning */
  top: 0; /* Align to the top */
  left: 0; /* Align to the left */
  height: 91.60%; /* Full viewport height */
  width: 95.88%; /* Full viewport width */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background-image: url('@/assets/facade1.png'); /* Background image */
  background-size: cover; /* Ensure the image covers the entire screen */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent repeating */
}

.overlay-container {
  background-color: rgba(0, 0, 0, 0.7); /* Black background with opacity */
  color: #333; /* Set text color to white for visibility */
  padding: 2rem; /* Add padding for spacing */
  border-radius: 8px; /* Optional: Add rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Optional: Add shadow for depth */
  z-index: 1; /* Ensure it is above the background overlay */
  font-family: agrandir;
}

/* Updated positioning for the title and candidates */
h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem; /* Casual font size */
  font-family: agrandir;
}

.candidates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.candidate-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: transform 0.3s ease;
}

.candidate-card:hover {
  transform: scale(1.05);
}

.candidate-card.selected {
  border-color: green;
  background-color: #e6ffe6;
}

.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  color: green;
  font-size: 1.5rem;
}

button {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background-color: #007bff;
  color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
