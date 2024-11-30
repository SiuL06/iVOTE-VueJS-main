<template>
  <div class="constraint-layout">
    <div class="overlay">
      <h2>Login</h2>
      <form @submit.prevent="loginWithVoucher">
        <!-- Voucher Field -->
        <div class="form-group">
          <label for="voucher">Voucher Code:</label>
          <input
            type="text"
            id="voucher"
            v-model="voucherCode"
            required
            placeholder="Enter your voucher code"
          />
        </div>
        <!-- Login Button -->
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>


<script>
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

export default {
  name: "LoginComponent",
  data() {
    return {
      voucherCode: "", // Voucher code input by the user
      isSubmitting: false, // Prevent duplicate submissions
      userData: null, // Retrieved user data
    };
  },
  methods: {
    async authenticateUser() {
      const auth = getAuth();
      try {
        const userCredential = await signInAnonymously(auth);
        console.log("User authenticated:", userCredential.user);
      } catch (error) {
        console.error("Authentication error:", error);
        alert("Failed to authenticate. Please refresh and try again.");
      }
    },

    async loginWithVoucher() {
      this.isSubmitting = true;
      try {
        const db = getFirestore();

        const trimmedVoucher = this.voucherCode.trim();
        if (!trimmedVoucher) {
          alert("Please enter a valid voucher code.");
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("Voucher", "==", trimmedVoucher)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          alert("Invalid voucher code. Please try again.");
          return;
        }

        const userData = userSnapshot.docs[0].data();
        this.userData = userData;

        // Check voting time validity
        const currentTime = new Date();
        const validFrom = userData.validFrom.toDate();
        const validTo = userData.validTo.toDate();

        if (currentTime < validFrom) {
          alert(`Voting is not valid until ${validFrom.toLocaleString()}.`);
          return;
        }

        if (currentTime > validTo) {
          alert(`Voting ended on ${validTo.toLocaleString()}.`);
          return;
        }

        // Save user session and redirect
        sessionStorage.setItem("voucher", trimmedVoucher);
        sessionStorage.setItem("user", JSON.stringify(userData));
        alert(`Welcome, ${userData.Firstname} ${userData.Lastname}!`);
        this.$router.push("/voters");
      } catch (error) {
        console.error("Error logging in with voucher:", error);
        alert("An error occurred during login. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  async mounted() {
    await this.authenticateUser();
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
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
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

.overlay {
  background-color: rgba(0, 0, 0, 0.7); /* Black background with 70% opacity */
  padding: 2rem;
  border-radius: 8px; /* Optional: Rounded corners */
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-family: agrandir;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  font-family: agrandir;
}

label {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 0.8rem 2rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
}

button:hover {
  background-color: #218838;
  transition: background-color 0.3s ease;
}

/* Register button styling */
.register-button {
  padding: 0.8rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.register-button:hover {
  background-color: #0056b3;
  transition: background-color 0.3s ease;
}

p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-family: agrandir;
  color: white;
}
</style>
