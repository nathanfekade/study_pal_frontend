<script setup>
import { useAuthStore } from './stores/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const displayText = computed(() => authStore.username );

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Authenticate' });
};

</script>

<template>
  <div class="nav">
    
    <div class="logo">
      <h1>STUDY PAL</h1>
    </div>

    <div class="checkuser">

      <router-link v-if="!authStore.username" :to="{ name: 'Authenticate' }" class="login">
        {{ displayText }}
      </router-link>
      <span v-else class="username">
        {{ authStore.username }}
      </span>
      <button v-if="authStore.username" @click="handleLogout" class="logout">Logout</button>
    </div>

  </div>
  <router-view></router-view>

</template>

<style scoped>
.nav{
  display: flex;
  justify-content: space-between;
  align-items: center;

}
h1 {
  color: #FDFCFE;
  margin-left: 40px;
}

.login {
  background-color: #8965A3;
  width: 90px;
  height: 40px;
  border-radius: 50px;
  margin-right: 25px;
  color: #FDFCFE;
  font-size: 1.3rem;
  border: none;
  text-decoration: none;

}

.checkuser .username{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
  display: inline-block;
  vertical-align: middle;
}

.username {

  margin-right: 25px;
  color: #FDFCFE;
  font-size: 1.3rem;
  }

.logout {
  background-color: #896ba3;
  width: 90px;
  height: 40px;
  border-radius: 50px;
  color: #FDFCFE;
  font-size: 1.3rem;
  border: none;
}
</style>
