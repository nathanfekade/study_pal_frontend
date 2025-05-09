<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isLogin = ref(true);
const username = ref('');
const password = ref('');
const error = ref('');

const submit = async () => {
    try {
        const credentials = { username: username.value, password: password.value };
        if (isLogin.value){
            await authStore.login(credentials);
        } else {
            await authStore.signup(credentials);
        }
        router.push({ name: 'Home'});
    } catch (err){
        error.value = isLogin.value? 'Login failed. Check credentials.' : 'Signup failed';
    }
};

const  toggleMode = () => {
    isLogin.value = !isLogin.value;
    error.value = '';
};

</script>

<template>

<div class="auth-container">
    <h2>{{ isLogin? 'Login' : 'Sign Up' }}</h2>
    <div class="form">
        <input v-model="username" placeholder="Username"/>
        <input v-model="password" type="password" placeholder="Password">
        <button @click="submit">{{ isLogin? 'Login' : 'Sign Up' }}</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>
            {{ isLogin ? 'Need an account?' : 'Already have an account?'
             }}
             <a href="#" @click.prevent="toggleMode">{{ isLogin? 'Sign Up' : 'Login' }}</a>
        </p>

    </div>
</div>

</template>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #1D1E26;
    color: #fdfcfe;

}

.form{
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
}

input{
    padding: 10px;
    border-radius: 5px;
    border: none;
    font-size: 1rem;
}

button{
    background-color: #8965A3;
    padding: 10PX;
    border-radius: 50PX;
    border: none;
    color: #fdfcfe;
    font-size: 1.3rem;
    cursor: pointer;
}

.error {
    color: red;
}

a{
    color: #8965A3;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

</style>
