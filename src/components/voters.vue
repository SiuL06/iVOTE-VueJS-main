<template>
  <div class="constraint-layout">
    <div class="background-overlay"></div>
    <div class="overlay-container">
      <h2>Vote for Your Candidate</h2>

      <!-- Display containers for each position -->
      <div
        class="position-container"
        v-for="(nominees, position) in groupedNominees"
        :key="position"
      >
        <h3 class="position-title">{{ position }}</h3>
        <div class="candidates">
          <div
            v-for="candidate in nominees"
            :key="`${position}-${candidate.id}`"
            class="candidate-card"
            :class="{ selected: selectedCandidate[position] === candidate.id }"
            @click="selectCandidate(candidate.id, position)"
          >
            <div class="photo-container">
              <img
                :src="candidate.photo || 'https://via.placeholder.com/150'"
                :alt="candidate.name"
                class="nominee-photo"
              />
            </div>
            <p class="candidate-name">{{ candidate.name }}</p>
            <p class="vote-text">Vote</p>
            <!-- Green check mark -->
            <div
              v-if="selectedCandidate[position] === candidate.id"
              class="checkmark"
            >
              ✔
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Votes Button -->
      <button
        v-if="Object.keys(selectedCandidate).length > 0"
        class="submit-votes"
        @click="confirmVote"
      >
        Submit Votes
      </button>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default {
  name: "VoterComponent",
  data() {
    return {
      candidates: [], // List of candidates from Firebase
      selectedCandidate: {}, // Tracks selected candidates per position
    };
  },
  computed: {
    groupedNominees() {
      // Group candidates by their position
      return this.candidates.reduce((groups, candidate) => {
        const position = candidate.position || "Others";
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {});
    },
  },
  methods: {
    selectCandidate(candidateId, position) {
      // Toggle the selection for the given position
      if (this.selectedCandidate[position] === candidateId) {
        delete this.selectedCandidate[position]; // Unset the candidate if already selected
      } else {
        this.selectedCandidate = {
          ...this.selectedCandidate, // Preserve existing selections
          [position]: candidateId, // Update the selection for the current position
        };
      }
      console.log("Updated selectedCandidate:", this.selectedCandidate);
    },
    async confirmVote() {
      if (Object.keys(this.selectedCandidate).length === 0) {
        alert("Please select at least one candidate to vote.");
        return;
      }

      try {
        const db = getFirestore();
        const votes = []; // To track recorded votes for alert feedback

        // Process each selected candidate
        for (const [position, candidateId] of Object.entries(
          this.selectedCandidate
        )) {
          const candidate = this.candidates.find((c) => c.id === candidateId);
          if (candidate) {
            const candidateDocRef = doc(db, "nominees", candidate.id);

            // Increment the vote count in Firestore
            await updateDoc(candidateDocRef, {
              score: increment(1),
            });

            // Add the vote to the feedback array
            votes.push(`${position}: ${candidate.name}`);
          }
        }

        // Provide feedback to the user
        alert(`Your votes have been recorded:\n${votes.join("\n")}`);
        this.selectedCandidate = {}; // Reset selection after voting
      } catch (error) {
        console.error("Error saving votes:", error);
        alert("An error occurred while saving your votes. Please try again.");
      }
    },
    fetchCandidates() {
      const db = getFirestore();
      const nomineesRef = collection(db, "nominees");

      // Listen for real-time updates from Firestore
      onSnapshot(nomineesRef, (snapshot) => {
        this.candidates = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },
  },
  mounted() {
    this.fetchCandidates(); // Fetch candidates when the component is mounted
  },
};
</script>

<style scoped>
@font-face {
  font-family: "agrandir";
  src: url("@/assets/agrandir.otf");
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.constraint-layout {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url("@/assets/facade1.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay-container {
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  z-index: 1;
  font-family: agrandir;
}

h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-family: agrandir;
}

.position-container {
  margin-bottom: 2rem;
  width: 100%;
  text-align: center;
}

.position-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.candidates {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.candidate-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.candidate-card:hover {
  transform: scale(1.05);
}

.candidate-card.selected {
  border-color: green;
  background-color: #e6ffe6;
}

.photo-container {
  width: 100%;
  height: 150px;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.nominee-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.candidate-name {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  color: #000;
}

.vote-text {
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
  margin-top: 0.5rem;
}

.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  color: green;
  font-size: 1.5rem;
}

button.submit-votes {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.submit-votes:hover {
  background-color: #0056b3;
}
</style>
