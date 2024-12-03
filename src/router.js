// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/login.vue';
import LandingPage from './components/landing.vue';
import AboutPage from './components/about.vue';
import RegisterPage from './components/register.vue';
import VoterComponent from '@/components/voters.vue';
import DetailsPage from '@/components/details.vue';
import ContactPage from '@/components/ContactUs.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/landing', component: LandingPage },
  { path: '/about', component: AboutPage },
  { path: '/register', component: RegisterPage },
  { path: '/contact', component: ContactPage },
  { path: '/voters', component: VoterComponent },
  { path: '/details', component: DetailsPage },
  { path: '/ContactUs', component: ContactPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
