<template>
  <div class="container">
    <!-- Navbar -->
    <header>
      <div class="navbar">
        <RouterLink to="/landing" class="btn">iVOTE</RouterLink>
        <nav>
          <ul>
            <li><RouterLink to="/about" class="btn">About</RouterLink></li>
            <li><RouterLink to="/contact" class="btn">Contact</RouterLink></li>
            <li><button @click="signOut" class="btn logout-btn">Logout</button></li> <!-- Added Log out button -->
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content">
      <main>
        <section class="contact-intro">
          <h1>Get in Touch with iVote</h1>
          <p>If you have any questions or need further information, feel free to reach out to us. We’d love to hear from you!</p>
        </section>

        <div class="contact-wrapper">
          <section class="contact-info">
            <h2>Other Ways to Contact Us</h2>
            <p><i class="fas fa-envelope"></i> <strong>Email:</strong> kajkcanlas.student@ua.edu.ph</p>
            <p><i class="fas fa-phone"></i> <strong>Phone:</strong> +63 923 460 4375</p>
            <p><i class="fas fa-map-marker-alt"></i> <strong>Address:</strong> Arayat, Pampanga</p>
          </section>

          <section class="contact-form">
            <h2>Contact Us</h2>
            <form @submit.prevent="submitForm">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="form.name" required placeholder="Your Name">

              <label for="email">Email:</label>
              <input type="email" id="email" v-model="form.email" required placeholder="Your Email">

              <label for="message">Message:</label>
              <textarea id="message" v-model="form.message" rows="5" required placeholder="Write your message here..."></textarea>

              <button type="submit">Send Message</button>
            </form>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "ContactPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: ""
      }
    };
  },
  methods: {
    submitForm() {
      alert(`Message Sent!\nName: ${this.form.name}\nEmail: ${this.form.email}\nMessage: ${this.form.message}`);
      // Clear form after submission
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          localStorage.removeItem('account');
          this.$router.push("/");
          console.log("User signed out.");
        })
        .catch((error) => {
          console.error("Sign-out error: ", error);
        });
    }
  }
};
</script>

<style scoped>
* {
  font-family: agrandir;
  font-size: 18px;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  padding-right: 30px;
  background-color: #fff; /* Secondary background for navbar */
  position: relative;
}

.navbar nav ul {
  list-style-type: none;
  display: flex;
}

.navbar nav ul li {
  margin-right: 20px;
}

/* Button styles for navbar */
.btn {
  background-color: transparent;
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  text-decoration: none !important;
}

.btn:hover {
  opacity: 0.3;
}

/* Log Out button styles */
.logout-btn {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  text-decoration: none !important;
}

.logout-btn:hover {
  opacity: 0.3;
}

/* Content area */
.content {
  padding: 20px;
  color: #2d3038;
  background: rgb(2, 0, 36);
  background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);
  border-radius: 8px;
  padding-bottom: 10vh;
}

/* Flexbox layout for contact section */
.contact-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.contact-intro {
  text-align: center;
  margin-bottom: 0;
  border-radius: 5px;
}

.contact-intro h1 {
  font-size: 20px;
  color: white; /* Primary color */
}

.contact-intro p {
  font-size: 16px;
  color: white; /* Subtle text color */
}

.contact-form,
.contact-info {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  flex: 1;
}

.contact-form h2,
.contact-info h2 {
  font-size: 15px;
  margin-bottom: 0;
  color: #657FC7; /* Primary color */
}

.contact-form form {
  display: flex;
  flex-direction: column;
}

.contact-form label {
  font-size: 16px;
  color: #2d3038;
  margin-bottom: 5px;
}

.contact-form input,
.contact-form textarea {
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
}

.contact-form button {
  background-color: #657FC7; /* Primary color */
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.contact-form button:hover {
  background-color: #527DF2; /* Accent color on hover */
}

.contact-info p {
  font-size: 18px;
  color: #2d3038;
  margin-bottom: 10px;
}

.contact-info p i {
  margin-right: 8px;
  color: #2d3038;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-wrapper {
    flex-direction: column;
  }

  .contact-intro h1 {
    font-size: 28px;
  }

  .contact-form,
  .contact-info {
    padding: 15px;
  }
}
</style>
