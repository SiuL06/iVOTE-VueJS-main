<template>
  <div>
    <header>
      <nav>
        <div class="nav-left">
          <ul>
            <li><a href="/landing" style="color: #2D3038; text-decoration: none; font-family: agrandir;" class="homeBtn">iVOTE</a></li>
          </ul>
        </div>
        <div class="nav-right">
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <!-- Update the log out link -->
            <li><a href="#" @click="logout">Logout</a></li>
          </ul>
        </div>
      </nav>
    </header>

    <main>
      <section class="content">
        <div class="left-panel">
          <h2>Enhancing Student Participation Through Modern Voting System in School Elections</h2>
          <p>Cast your vote and make your voice heard!</p>
          <button class="btn" @click="goToLive">Get Started!</button>
        </div>
        <div class="right-panel">
          <img src="@/assets/ivotelogo.png" alt="iVote Logo" class="logo">
        </div>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 iVote. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    goToLive() {
      this.$router.push('/voters');
    },
    logout() {
      localStorage.removeItem('account');
      this.$router.push('/');
    }
  }
}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: agrandir;
}

body {
  font-family: agrandir;
  background-color: #f4f4f4;
  color: #333;
}

header {
  background-color: #fff;
  color: #fff;
  padding: 10px 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  padding-right: 50px;
  font-size: 20px;
}

.homeBtn {
  font-size: 20px;
  font-weight: bold;
  transition: 0.2s ease;
}

.homeBtn:hover {
  cursor: pointer;
  opacity: .3;
}

.nav-left ul li {
  font-size: 30px;
  padding-left: 0px;
  list-style: none;
  text-decoration: none;
  margin: 0;
  color: #2D3038;
}

.nav-right ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-right ul li a {
  color: #2D3038;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-right ul li a:hover {
  color: #ccc;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
  border-radius: 8px;
}

.left-panel {
  flex: 1;
  padding-right: 20px;
}

.left-panel h2 {
  font-size: 25px;
  margin-bottom: 10px;
  color: white;
}

.left-panel p {
  font-size: 18px;
  margin-bottom: 20px;
  color: white;
}

.left-panel .btn {
  background-color: #383C47;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 10px;
}

.left-panel .btn:hover {
  background-color: #2D3038;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-panel .logo {
  max-width: 80%;
  height: auto;
  object-fit: contain;
}

footer {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #555;
}

button {
  padding: 20px;
  background-color: transparent;
  text-decoration: none;
  font-family: agrandir;
  font-size: large;
  color: white;
  box-shadow: 0;
}
</style>
