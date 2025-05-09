import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Authenticate from "../components/Authenticate.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/auth',
        name: 'Authenticate',
        component: Authenticate,
    },
];

const router = createRouter({
        history: createWebHistory(),
        routes,
});

export default router;






