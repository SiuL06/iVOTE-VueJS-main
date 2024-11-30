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

        // Validate voucher input
        const trimmedVoucher = this.voucherCode.trim();
        if (!trimmedVoucher) {
          alert("Please enter a voucher code.");
          return;
        }

        // Query the `users` collection to find a matching voucher
        const userQuery = query(
          collection(db, "users"),
          where("Voucher", "==", trimmedVoucher)
        );
        const userSnapshot = await getDocs(userQuery);

        // If no user is found with the voucher, deny login
        if (userSnapshot.empty) {
          alert("Invalid voucher code. Please try again.");
          return;
        }

        let userData;
        userSnapshot.forEach((document) => {
          userData = { id: document.id, ...document.data() };
        });

        // Check if the voucher has already been used
        const voteQuery = query(
          collection(db, "votes"),
          where("Voucher", "==", trimmedVoucher)
        );
        const voteSnapshot = await getDocs(voteQuery);

        if (!voteSnapshot.empty) {
          alert("You have already submitted your vote. You cannot vote again.");
          return;
        }

        // Parse `validFrom` and `validTo` as JavaScript Date objects
        const currentTime = new Date();
        const validFrom =
          userData.validFrom && typeof userData.validFrom === "string"
            ? new Date(userData.validFrom) // Parse string to Date
            : null;
        const validTo =
          userData.validTo && typeof userData.validTo === "string"
            ? new Date(userData.validTo) // Parse string to Date
            : null;

        // Validate the time range for the voucher
        if (validFrom && currentTime < validFrom) {
          alert(`This voucher is not valid until ${validFrom.toLocaleString()}.`);
          return;
        }

        if (validTo && currentTime > validTo) {
          alert(`This voucher expired on ${validTo.toLocaleString()}.`);
          return;
        }

        // Successful login - Store voucher and user details in sessionStorage
        sessionStorage.setItem("voucher", trimmedVoucher);
        sessionStorage.setItem("user", JSON.stringify(userData));

        alert(`Welcome ${userData.Firstname} ${userData.Lastname}!`);
        this.$router.push("/voters");
      } catch (error) {
        console.error("Error logging in with voucher:", error.message, error.stack);
        alert("An error occurred during login. Please try again.");
      }
    },
  },
};
</script>





<style scoped>
/* Your existing styles */
</style>






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
