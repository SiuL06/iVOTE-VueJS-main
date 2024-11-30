<template>
  <div class="constraint-layout">
    <div class="background-overlay"></div>
    <div class="overlay-container">
      <h2>Vote for Your Candidate</h2>

      <!-- Display containers for each filtered position -->
      <div
        class="position-container"
        v-for="position in filteredPositions"
        :key="position"
      >
        <h3 class="position-title">{{ position }}</h3>
        <div class="candidates">
          <div
            v-for="candidate in groupedNominees[position] || []"
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
  addDoc,
  updateDoc,
  doc,
  increment,
  Timestamp,
} from "firebase/firestore";

export default {
  name: "VoterComponent",
  data() {
    return {
      candidates: [], // List of candidates
      selectedCandidate: {}, // Selected candidates for each position
      hasVoted: false, // Track if the user has already voted
      userVoucher: "", // User's voucher code
      userDepartment: "", // User's department
      isSubmitting: false, // Prevent duplicate submissions
      isLoading: false, // Loading state for async operations
      orderedPositions: [
        "PRESIDENT",
        "VICE PRESIDENT",
        "SECRETARY",
        "TREASURER",
        "AUDITOR",
        "PUBLIC RELATIONS OFFICER",
        "PUBLIC INFORMATION OFFICER",
      ], // Predefined positions
    };
  },
  computed: {
    groupedNominees() {
      return this.candidates.reduce((groups, candidate) => {
        const position = candidate.position || "Others";
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {});
    },
    filteredPositions() {
      return this.orderedPositions.filter(
        (position) => this.groupedNominees[position]?.length > 0
      );
    },
  },
  methods: {
    async fetchCandidates() {
      this.isLoading = true;
      try {
        const db = getFirestore();
        const nomineesRef = collection(db, "nominees");

        // Subscribe to Firestore collection changes
        this.unsubscribe = onSnapshot(
          nomineesRef,
          (snapshot) => {
            this.candidates = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log("Candidates fetched successfully:", this.candidates);

            if (!this.candidates.length) {
              console.warn("No candidates found in Firestore.");
            }
          },
          (error) => {
            console.error("Error fetching candidates:", error);
          }
        );
      } catch (error) {
        console.error("Error initializing candidates fetch:", error);
      } finally {
        this.isLoading = false;
      }
    },
    selectCandidate(candidateId, position) {
      if (this.selectedCandidate[position] === candidateId) {
        delete this.selectedCandidate[position];
      } else {
        this.selectedCandidate = {
          ...this.selectedCandidate,
          [position]: candidateId,
        };
      }
    },
    async confirmVote() {
      if (this.hasVoted) {
        alert("You have already voted. You cannot vote again.");
        return;
      }

      if (Object.keys(this.selectedCandidate).length === 0) {
        alert("Please select at least one candidate to vote.");
        return;
      }

      if (this.isSubmitting) return;
      this.isSubmitting = true;

      try {
        const db = getFirestore();
        const votes = [];

        for (const [position, candidateId] of Object.entries(
          this.selectedCandidate
        )) {
          const candidate = this.candidates.find((c) => c.id === candidateId);
          if (candidate) {
            await updateDoc(doc(db, "nominees", candidate.id), {
              score: increment(1),
            });

            await addDoc(collection(db, "votes"), {
              Candidate: candidate.name,
              Position: position,
              Department: this.userDepartment,
              Voucher: this.userVoucher,
              Timestamp: Timestamp.now(),
            });

            votes.push(`${position}: ${candidate.name}`);
          }
        }

        this.hasVoted = true;
        alert(`Your votes have been recorded:\n${votes.join("\n")}`);
        this.selectedCandidate = {};
      } catch (error) {
        console.error("Error saving votes:", error);
        alert("Failed to save your votes. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  async mounted() {
    await this.fetchCandidates();
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
};
</script>


<style scoped>
/* Add your styles here */
</style>





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
  overflow-y: auto;
}

.constraint-layout {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-image: url("@/assets/facade1.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 0;
}

.overlay-container {
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  z-index: 1;
  font-family: agrandir;
  width: 90%;
  max-width: 1200px;
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
  position: relative;
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
  font-weight: bold;
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
