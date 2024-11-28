<template>
  <div id="app">
    <!-- Navbar -->
    <header>
      <div class="navbar">
        <RouterLink to="/landing" class="btn">iVOTE</RouterLink>
        <nav>
          <ul>
            <li><RouterLink to="/about" class="btn">About</RouterLink></li>
            <li><RouterLink to="/contact" class="btn">Contact</RouterLink></li>
            <li><button @click="logout" class="btn no-border">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- About Section -->
    <section class="about-section">
      <div class="about-content">
        <h2>About</h2>
        <p>
          In today's fast-paced world, efficiency and accuracy are crucial. iVote
          helps modernize the school election system by replacing the traditional
          time-consuming voting process with a seamless, technology-driven
          solution.
        </p>
        <p>
          With iVote, students can cast their votes from anywhere, without the
          hassle of manual voting. Our system ensures secure, real-time results
          while minimizing the potential for human error. In short, iVote saves
          time and makes voting easier for everyone involved.
        </p>
      </div>
      <div class="about-image">
        <img src="@/assets/msTiqui.png" alt="Students at election" />
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <p>&copy; 2024 iVote. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  methods: {
    logout() {
      localStorage.removeItem('account');
      this.$router.push("/"); // Redirects to the login page
    },
  },
};
</script>

<style scoped>
/* Reset and global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: agrandir;
}

body {
  font-family: agrandir;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
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

/* Button styles */
.btn {
  background-color: white;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  transition: 0.3s ease;
  text-decoration: none;
  border: none; /* Removed border */
  border-radius: 5px;
}

.btn:hover {
  border-radius: 8px;
  opacity: 0.3;
}

.no-border {
  background-color: transparent; /* Matches the other buttons' background */
  font-family: inherit;
}

/* About section styles */
.about-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  flex-grow: 1;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  color: white;
  border-radius: 5px;
}

.about-content {
  width: 50%;
  text-align: center;
}

.about-content h2 {
  font-size: 36px;
  margin-bottom: 80px;
}

.about-content p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.about-image {
  width: 40%;
  margin-left: 20%;
}

.about-image img {
  width: 100%;
  box-shadow: 0 0 5px black;
  border-radius: 5px;
}

/* Footer styles */
footer {
  color: #555;
  text-align: center;
  padding: 20px;
  position: relative;
  bottom: 0;
  width: 100%;
}

footer p {
  font-size: 12px;
}
</style>
