<template>
  <div class="constraint-layout">
    <div class="overlay">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="voucherCode">Voucher Code:</label>
          <input type="text" v-model="voucherCode" required />
        </div>
        <button type="submit">Login</button>
      </form>

      <!-- Register Button -->
      <p>Don't have an account? <router-link to="/register">
        <button class="register-button">Register</button>
      </router-link></p>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "", // User input for email
      voucherCode: "", // User input for voucher code
    };
  },
  methods: {
    async login() {
      try {
        console.log("Email Entered:", this.email);
        console.log("Voucher Code Entered:", this.voucherCode);

        // Query Firestore to find the user by email
        const userQuery = query(collection(db, "users"), where("Email", "==", this.email));
        const querySnapshot = await getDocs(userQuery);

        console.log("Query Snapshot Size:", querySnapshot.size);

        if (querySnapshot.empty) {
          alert("Email not found.");
          console.log("No matching user document for the provided email.");
          return;
        }

        let retrievedVoucher = null;
        querySnapshot.forEach((doc) => {
          console.log("Document ID:", doc.id);
          console.log("Document Data:", doc.data());
          retrievedVoucher = doc.data().Voucher;
        });

        console.log("Retrieved Voucher Code:", retrievedVoucher);

        if (this.voucherCode !== retrievedVoucher) {
          alert("Invalid voucher code.");
          console.log("Voucher code mismatch.");
          return;
        }

        console.log("Login successful. Redirecting...");
        this.$router.push("/voters"); // Redirect to voters page
      } catch (error) {
        console.error("Login error:", {
          message: error.message,
          stack: error.stack,
          code: error.code || "No error code provided",
        });
        alert(`An unexpected error occurred: ${error.message}`);
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
