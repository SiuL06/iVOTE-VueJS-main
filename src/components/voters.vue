<template>
  <div class="constraint-layout">
    <div class="background-overlay"></div>
    <div class="overlay-container">
      <h2>Vote for Your Candidate</h2>
      <!-- Instruction -->
      <p class="instruction-text">Instruction: Click your desired Candidate</p>

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
            <div class="photo-container" @click="fetchCandidateDetails(candidate.id)">
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

    <!-- Modal for Candidate Details -->
    <div v-if="showCandidateDetailsModal" class="modal-overlay">
      <div class="modal">
        <h3>Candidate Details</h3>
        <div v-if="candidateDetails">
          <p><strong>Name:</strong> {{ candidateDetails.name }}</p>
          <p><strong>Position:</strong> {{ candidateDetails.position }}</p>
          <p><strong>Details:</strong> {{ candidateDetails.details || 'No details available.' }}</p>
        </div>
        <button class="close-modal" @click="closeCandidateDetailsModal">
          Close
        </button>
      </div>
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
  getDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { getAuth, signOut } from "firebase/auth";

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
        "VICE-PRESIDENT",
        "SECRETARY",
        "TREASURER",
        "AUDITOR",
        "BUSINESS MANAGER",
        "PUBLIC INFORMATION OFFICER",
        "PUBLIC RELATIONS OFFICER",
        "CREATIVE DIRECTOR",
        "EXECUTIVE ASSISTANT TO THE PRESIDENT",
        "ASSISTANT SECRETARY",
        "ASSISTANT TREASURER",
        "ASSISTANT AUDITOR",
        "ASSISTANT BUSINESS MANAGER",
        "ASSISTANT CREATIVE DIRECTOR",
        "CHIEF OF STAFF",
        "EXECUTIVE STAFF",
      ],
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

        this.unsubscribe = onSnapshot(
          nomineesRef,
          (snapshot) => {
            this.candidates = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
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
    async fetchCandidateDetails(candidateId) {
      try {
        const db = getFirestore();
        const candidateDoc = await getDoc(doc(db, "nominees", candidateId));
        if (candidateDoc.exists()) {
          const candidate = candidateDoc.data();

          // Display candidate details using SweetAlert
          Swal.fire({
            title: `<strong>${candidate.name}</strong>`, // Candidate's name
            html: `
              <p><strong>Position:</strong> ${candidate.position || "No position specified"}</p>
              <p><strong>Details:</strong> ${candidate.details || "No details provided"}</p>
           `,
            imageUrl: candidate.photo || "https://via.placeholder.com/150",
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: candidate.name,
            confirmButtonText: "Close",
          });

          // Increment the view count for the candidate
          await updateDoc(doc(db, "nominees", candidateId), {
            views: increment(1),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Candidate Not Found",
            text: "The selected candidate does not exist in the database.",
          });
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
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
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You have already voted. You cannot vote again.",
    });
    return;
  }

  if (Object.keys(this.selectedCandidate).length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Selection",
      text: "Please select at least one candidate to vote.",
    });
    return;
  }

  const userConfirmation = await Swal.fire({
    title: "Are you sure?",
    html: `Do you want to submit your votes?<br>${Object.entries(
      this.selectedCandidate
    )
      .map(([position, candidateId]) => {
        const candidate = this.candidates.find((c) => c.id === candidateId);
        return candidate
          ? `<strong>${position}:</strong> ${candidate.name}`
          : "";
      })
      .join("<br>")}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, submit it!",
    cancelButtonText: "No, reset selection",
  });

  if (!userConfirmation.isConfirmed) {
    this.selectedCandidate = {};
    Swal.fire({
      icon: "info",
      title: "Reset",
      text: "Your vote selection has been reset.",
    });
    return;
  }

  if (this.isSubmitting) return;
  this.isSubmitting = true;

  try {
    const db = getFirestore();
    const auth = getAuth();
    const votedCandidates = []; // To store details of voted candidates

    for (const [position, candidateId] of Object.entries(
      this.selectedCandidate
    )) {
      const candidate = this.candidates.find((c) => c.id === candidateId);
      if (candidate) {
        // Log the vote
        await addDoc(collection(db, "votes"), {
          Candidate: candidate.name,
          Position: position,
          Department: this.userDepartment,
          Voucher: this.userVoucher,
          Timestamp: Timestamp.now(),
        });

        // Increment the candidate's score
        await updateDoc(doc(db, "nominees", candidateId), {
          score: increment(1),
        });

        // Add to votedCandidates list
        votedCandidates.push({ position, name: candidate.name });
      }
    }

    this.hasVoted = true;

    // Show SweetAlert with the list of candidates voted
    const votedListHtml = votedCandidates
      .map((vote) => `<strong>${vote.position}:</strong> ${vote.name}`)
      .join("<br>");

    await Swal.fire({
      icon: "success",
      title: "Vote Recorded",
      html: `Your votes have been recorded:<br>${votedListHtml}`,
      confirmButtonText: "OK",
    });

    // Log out the user after showing the confirmation
    await signOut(auth);

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out after voting.",
    });

    window.location.reload(); // Reload the page
  } catch (error) {
    console.error("Error submitting votes:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to submit your votes. Please try again.",
    });
  } finally {
    this.isSubmitting = false;
  }
}

  },
  async mounted() {
    this.userVoucher = sessionStorage.getItem("voucher") || "";
    this.userDepartment =
      JSON.parse(sessionStorage.getItem("user"))?.Department || "";
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
@font-face {
  font-family: "agrandir";
  src: url("@/assets/agrandir.otf");
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent scrolling if necessary */
}

.instruction-text {
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-family: agrandir;
}


.constraint-layout {
  position: fixed; /* Ensures the layout fills the viewport */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex; /* Use Flexbox to center content */
  flex-direction: column; /* Stack items vertically */
  justify-content: flex-start; /* Align content to the top */
  align-items: center; /* Center content horizontally */
  background-image: url("@/assets/facade1.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}


.overlay-container {
  margin-top: 5vh;
  position: relative;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  font-family: agrandir;
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Change to start for scrolling */
  align-items: center;
  overflow-y: auto; /* Add scroll */
  max-height: 90vh; /* Set a max height to trigger scrolling */
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

.details-text {
  white-space: pre-line;
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
