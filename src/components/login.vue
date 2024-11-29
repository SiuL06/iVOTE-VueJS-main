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
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default {
  name: "VoucherLoginForm",
  data() {
    return {
      voucherCode: "", // Stores the voucher code entered by the user
    };
  },
  methods: {
    async loginWithVoucher() {
      try {
        const db = getFirestore();

        // Query Firestore to find the user with the matching voucher code
        const userQuery = query(
          collection(db, "users"),
          where("Voucher", "==", this.voucherCode)
        );
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          alert("Invalid voucher code. Please try again.");
          return;
        }

        let userData;

        // Fetch user data from the matched document
        querySnapshot.forEach((document) => {
          userData = document.data();
        });

        // Example: Display a welcome message
        alert(`Welcome ${userData.Firstname} ${userData.Lastname}!`);

        // Store voucher code in session (optional for session management)
        sessionStorage.setItem("voucher", this.voucherCode);

        // Redirect to a protected page or dashboard
        this.$router.push("/voters");
      } catch (error) {
        console.error("Error logging in with voucher:", error);
        alert("An error occurred during login. Please try again.");
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
