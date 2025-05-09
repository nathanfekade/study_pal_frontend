import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from  './router';
import axios from 'axios';

axios.defaults.baseURL = 'https://nathanfekade.pythonanywhere.com';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app')
