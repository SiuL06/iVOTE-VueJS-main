<template>
  <div class="constraint-layout">
    <div class="overlay">
      <h1>Contact Us</h1>
      <p>We would love to hear from you! Please fill out the form below to get in touch with us.</p>
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="firstname">Firstname</label>
          <input type="text" id="firstname" v-model="form.firstname" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" v-model="form.message" required></textarea>
        </div>
        <button type="submit">Submit</button>
        <button type="button" class="register-button" @click="goBackToLogin">Go back to Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import emailjs from "emailjs-com";

export default {
  name: "ContactUs",
  data() {
    return {
      form: {
        firstname: "",
        email: "",
        message: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    async submitForm() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      try {
        // Validate fields
        if (!this.form.firstname.trim() || !this.form.email.trim()) {
          alert("Firstname and Email cannot be empty.");
          this.isSubmitting = false;
          return;
        }

        if (!this.form.message.trim()) {
          alert("Message cannot be empty. Please enter a message.");
          this.isSubmitting = false;
          return;
        }

        // Check Firebase for Firstname and Email
        const isUserValid = await this.checkUserInFirebase();
        if (!isUserValid) {
          alert("The entered Firstname and Email are not registered in our system.");
          this.isSubmitting = false;
          return;
        }

        // Send the message via EmailJS
        await this.sendEmail();

        alert("Your message has been successfully sent to the admin!");
        this.resetForm();
      } catch (error) {
        console.error("Error during form submission:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        this.isSubmitting = false;
      }
    },

    async checkUserInFirebase() {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
          where("Firstname", "==", this.form.firstname), // Matches Firstname
          where("Email", "==", this.form.email) // Matches Email
        );

        const querySnapshot = await getDocs(userQuery);

        // Check if any document exists
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error checking user in Firebase:", error);
        throw error;
      }
    },

    async sendEmail() {
      const serviceId = "service_cxbpnzk";
      const templateId = "template_0s2i8w2";
      const userId = "ASoddsQfmCUWEnZsY";

      const templateParams = {
        firstname: this.form.firstname,
        email: this.form.email,
        message: this.form.message,
        admin_email: "lpamallari.student@ua.edu.ph", // Admin's email
      };

      try {
        await emailjs.send(serviceId, templateId, templateParams, userId);
        console.log("Message successfully sent to the admin!");
      } catch (error) {
        console.error("Error sending email via EmailJS:", error);
        throw error;
      }
    },

    resetForm() {
      this.form.firstname = "";
      this.form.email = "";
      this.form.message = "";
    },

    goBackToLogin() {
      // Navigate back to the login page
      this.$router.push("/");
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
  margin: 0;
  padding: 0;
  font-family: agrandir, sans-serif; /* Apply the custom font globally */
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

  background-image: url("@/assets/facade1.png"); /* Background image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
  padding: 2rem;
  border-radius: 10px; /* Slightly rounded corners */
  max-width: 600px; /* Limit the width for larger screens */
  width: 90%; /* Maintain responsiveness for smaller screens */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Adds depth with shadow */
}

h1 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: agrandir, sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6); /* Adds a subtle text shadow */
}

p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  line-height: 1.5; /* Improve readability */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.contact-form {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px; /* Adds spacing between form elements */
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box; /* Ensures padding doesn't affect width */
  outline: none; /* Removes default browser focus outline */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff; /* Highlight border on focus */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Add glow effect */
}

button {
  padding: 0.8rem 2rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  margin: 0 auto; /* Automatically centers the button in its parent container */
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Adds a slight zoom effect on hover */
}

button:active {
  transform: scale(1); /* Removes zoom effect when pressed */
}

.register-button {
  margin-top: 10px;
  padding: 0.8rem 2rem;
  background-color: #6c757d; /* Gray color */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.register-button:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.register-button:active {
  transform: scale(1);
}

textarea {
  min-height: 120px; /* Ensures a larger textarea by default */
  resize: vertical; /* Allows vertical resizing only */
}

@media (max-width: 768px) {
  .overlay {
    padding: 1.5rem;
    width: 95%; /* Reduce width on smaller screens */
  }

  h1 {
    font-size: 2rem;
  }

  button {
    font-size: 1rem;
  }

  p {
    font-size: 1rem;
  }

  .form-group input,
  .form-group textarea {
    font-size: 0.9rem;
  }
}
</style>
