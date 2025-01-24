// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/login.vue';
import RegisterPage from './components/register.vue';
import VoterComponent from '@/components/voters.vue';
import ContactPage from '@/components/ContactUs.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/voters', component: VoterComponent },
  { path: '/ContactUs', component: ContactPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
