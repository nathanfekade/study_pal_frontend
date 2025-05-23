import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from  './router';
import axios from 'axios';
import { useAuthStore } from './stores/auth';

axios.defaults.baseURL = (`${import.meta.env.VITE_APP_API_URL}`);

const app = createApp(App);
app.use(createPinia());
app.use(router);

router.isReady().then(() => {
    const authStore = useAuthStore();
    if (authStore.token){
        axios.defaults.headers.common['Authorization'] = `Token ${authStore.token}`;
    }
    app.mount('#app')
});

