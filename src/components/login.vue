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
        <button type="submit" :disabled="isSubmitting">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default {
  name: "VoucherLoginForm",
  data() {
    return {
      voucherCode: "", // Stores the voucher code entered by the user
      isSubmitting: false, // Prevent duplicate submissions
    };
  },
  methods: {
    async loginWithVoucher() {
      this.isSubmitting = true;
      try {
        const db = getFirestore();

        // Validate voucher input
        const trimmedVoucher = this.voucherCode.trim();
        if (!trimmedVoucher) {
          alert("Please enter a voucher code.");
          return;
        }

        console.log("Querying Firestore for Voucher:", trimmedVoucher);

        // Query the `votes` collection to check if the voucher has already voted
        const votesQuery = query(
          collection(db, "votes"),
          where("voucher", "==", trimmedVoucher)
        );
        const votesSnapshot = await getDocs(votesQuery);

        // If there is a document with the voucher, it means the user has already voted
        if (!votesSnapshot.empty) {
          alert("You have already voted. You cannot log in again.");
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

        // Retrieve the user data from the matched document
        userSnapshot.forEach((document) => {
          userData = { id: document.id, ...document.data() };
        });

        console.log("User Data Retrieved:", userData);

        // Check voting time validity
        const currentTime = new Date();

        let validFrom, validTo;

        try {
          // Parse `validFrom` and `validTo` fields
          validFrom =
            typeof userData.validFrom === "string"
              ? new Date(userData.validFrom.replace(/"/g, ""))
              : userData.validFrom.toDate();
          validTo =
            typeof userData.validTo === "string"
              ? new Date(userData.validTo)
              : userData.validTo.toDate();
        } catch (parseError) {
          console.error("Error parsing validFrom/validTo fields:", parseError);
          alert("Invalid voting period configuration. Please contact support.");
          return;
        }

        // Convert `validFrom` and `validTo` to Philippine Time (UTC +8)
        const philippinesTimeOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        validFrom = new Date(validFrom.getTime() + philippinesTimeOffset);
        validTo = new Date(validTo.getTime() + philippinesTimeOffset);

        // Convert current time to Philippine Time
        const philippinesCurrentTime = new Date(currentTime.getTime() + philippinesTimeOffset);

        console.log("Current Time:", philippinesCurrentTime);
        console.log("validFrom:", validFrom);
        console.log("validTo:", validTo);

        if (philippinesCurrentTime < validFrom) {
          alert(`Voting is not valid until ${validFrom.toLocaleString('en-PH')}.`);
          return;
        }

        if (philippinesCurrentTime > validTo) {
          alert(`Voting ended on ${validTo.toLocaleString('en-PH')}.`);
          return;
        }

        // Successful login - Store voucher and user details in sessionStorage
        sessionStorage.setItem("voucher", trimmedVoucher);
        sessionStorage.setItem("user", JSON.stringify(userData));

        alert(`Welcome ${userData.Firstname} ${userData.Lastname}!`);
        this.$router.push("/voters");

        // Mark the user as voted by saving a vote document
        await this.markUserAsVoted(trimmedVoucher);

      } catch (error) {
        console.error("Error logging in with voucher:", error);
        alert("An error occurred during login. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },

    // Mark the user as voted by adding an entry in the `votes` collection
    async markUserAsVoted(voucher) {
      const db = getFirestore();
      const votesCollection = collection(db, "votes");

      try {
        // Add a document to the `votes` collection with the user's voucher
        await addDoc(votesCollection, {
          voucher: voucher,
          timestamp: new Date(),
        });

        console.log(`Voucher ${voucher} marked as voted.`);
      } catch (error) {
        console.error("Error marking user as voted:", error);
      }
    },
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
