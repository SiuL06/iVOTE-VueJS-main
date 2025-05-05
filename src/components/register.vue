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
  <select v-model="department" required>
    <option value="">Select Department</option>
    <option value="AAA">AAA</option>
    <option value="BACC">BACC</option>
    <option value="BATAS">BATAS</option>
    <option value="BHS-PHS">BHS-PHS</option>
    <option value="CDW">CDW</option>
    <option value="CHARMS">CHARMS</option>
    <option value="CRCYC">CRCYC</option>
    <option value="CREATE">CREATE</option>
    <option value="ICPEP">ICPEP</option>
    <option value="INA">INA</option>
    <option value="JPIA">JPIA</option>
    <option value="JPPhA">JPPhA</option>
    <option value="LEAD">LEAD</option>
    <option value="LTSP">LTSP</option>
    <option value="MCSA">MCSA</option>
    <option value="NSC">NSC</option>
    <option value="PICE">PICE</option>
    <option value="PIIE">PIIE</option>
    <option value="PsychSoc">PsychSoc</option>
    <option value="SSITE">SSITE</option>
    <option value="VE">VE</option>
    <option value="UASAO">UASAO</option>
  </select>
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
      voucherCode: "", 
    };
  },
  methods: {
    async submitForm() {
      try {
        const db = getFirestore();


        const userQuery = query(
          collection(db, "users"),
          where("Email", "==", this.email),
          where("Department", "==", this.department)
        );
        const querySnapshot = await getDocs(userQuery);

        
        if (querySnapshot.empty) {
          alert("Email and Department combination not found in the system.");
          return;
        }

        let userDocRef;
        let retrievedFirstname;
        let existingVoucher;

        
        querySnapshot.forEach((document) => {
          userDocRef = document.ref; 
          retrievedFirstname = document.data().Firstname; 
          existingVoucher = document.data().Voucher; 
        });

       
        if (existingVoucher) {
          alert("You have already registered and received a voucher.");
          return;
        }

       
        this.voucherCode = this.generateVoucherCode();

        
        this.sendVoucherEmail(this.email, retrievedFirstname, this.voucherCode);

       
        await setDoc(
          userDocRef,
          {
            Lastname: this.lastname,
            Firstname: this.firstname,
            Department: this.department,
            Voucher: this.voucherCode, 
          },
          { merge: true } 
        );

        alert(`Registration successful! Your voucher code has been sent to ${this.email}`);
      } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred during registration. Please try again.");
      }
    },

    
    generateVoucherCode() {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    },

    
    sendVoucherEmail(email, firstname, voucherCode) {
      const templateParams = {
        to_email: email, 
        to_name: firstname, 
        from_name: "System Admin", 
        message: `Your voucher code is: ${voucherCode}`, 
      };

      emailjs
        .send(
          'service_owytwze', 
          'template_ddqgd23', 
          templateParams,
          'ASoddsQfmCUWEnZsY' 
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

.form-group select {
  width: 100%; /* Adjust width as needed */
  max-width: 300px; /* Set maximum width */
  padding: 10px; /* Adjust padding for height */
  font-size: 1rem; /* Adjust font size */
  border-radius: 8px; /* Optional: Adjust border radius */
  border: 1px solid #ccc; /* Optional: Add border style */
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
