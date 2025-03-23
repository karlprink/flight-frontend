import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import SeatPlan from './views/SeatPlan.vue';

const routes = [
    { path: '/', component: Home },
    { name: "SeatPlan", path: "/flight/:flightId/seatplan", component: SeatPlan, props: true},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;