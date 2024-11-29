<template>
  <div class="constraint-layout">
    <div class="overlay">
      <h2>Register</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="lastname">Last Name:</label>
          <input type="text" v-model="lastname" required />
        </div>
        <div class="form-group">
          <label for="firstname">First Name:</label>
          <input type="text" v-model="firstname" required />
        </div>
        <div class="form-group">
          <label for="department">Department:</label>
          <input type="text" v-model="department" required />
        </div>
        <button type="submit">Submit</button>
      </form>

      <!-- Go Back to Login Button -->
      <p>Already registered? <router-link to="/">
        <button class="go-back-login-button">Go back to Login</button>
      </router-link></p>
    </div>
  </div>
</template>

<script>
// Importing emailjs-com for email sending
import emailjs from 'emailjs-com';
import { getFirestore, collection, query, where, getDocs, setDoc } from "firebase/firestore";

export default {
  name: "UserRegisterForm",
  data() {
    return {
      email: "",
      lastname: "",
      firstname: "",
      department: "",
      voucherCode: "", // This will store the generated voucher code
    };
  },
  methods: {
    async submitForm() {
      try {
        const db = getFirestore();

        // Query Firestore to find the user with the matching email
        const userQuery = query(collection(db, "users"), where("Email", "==", this.email));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          alert("Email not found in the system.");
          return;
        }

        let userDocRef;
        let retrievedFirstname;

        // Retrieve document reference and firstname
        querySnapshot.forEach((document) => {
          userDocRef = document.ref; // Document reference
          retrievedFirstname = document.data().Firstname; // Fetch the existing Firstname
        });

        // Generate a random voucher code
        this.voucherCode = this.generateVoucherCode();

        // Send the voucher email using EmailJS
        this.sendVoucherEmail(this.email, retrievedFirstname, this.voucherCode);

        // Save user details along with the voucher code to Firestore
        await setDoc(
          userDocRef,
          {
            Lastname: this.lastname,
            Firstname: this.firstname,
            Department: this.department,
            Voucher: this.voucherCode, // Save the voucher code
          },
          { merge: true } // Merge with existing fields
        );

        alert(`Registration successful! Your voucher code has been sent to ${this.email}`);
      } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred during registration. Please try again.");
      }
    },

    // Function to generate a random voucher code
    generateVoucherCode() {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    },

    // Function to send the voucher email using EmailJS
    sendVoucherEmail(email, firstname, voucherCode) {
  const templateParams = {
    to_email: email, // Dynamically pass the recipient's email
    to_name: firstname, // Maps to {{to_name}} in the template
    from_name: "System Admin", // Static name; Maps to {{from_name}}
    message: `Your voucher code is: ${voucherCode}`, // Maps to {{message}} in the template
  };

      emailjs
        .send(
          'service_owytwze', // Replace with your EmailJS service ID
          'template_ddqgd23', // Replace with your EmailJS template ID
          templateParams,
          'ASoddsQfmCUWEnZsY' // Replace with your EmailJS public key
        )
        .then((response) => {
          console.log("Email sent successfully:", response);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
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
  margin: 0;
  padding: 0;
}

.constraint-layout {
  position: absolute;
  top: 0;
  left: 0;
  height: 91.60%;
  width: 95.88%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background-image: url('@/assets/facade1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 8px;
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
}

button:hover {
  background-color: #0056b3;
  transition: background-color 0.3s ease;
}

.go-back-login-button {
  padding: 0.8rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.go-back-login-button:hover {
  background-color: #218838;
  transition: background-color 0.3s ease;
}

p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-family: agrandir;
  color: white;
}
</style>
