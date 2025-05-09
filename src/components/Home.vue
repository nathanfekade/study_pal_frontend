<script setup>
import FlashCard from './FlashCard.vue';
import Questionnaire from './Questionnaire.vue';
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const displayText = computed(() => authStore.username || 'Login');

</script>

<template>
    
    <div>
        <FlashCard/>
        <Questionnaire/>
        <button class="upload">Upload File &plus;</button>
    </div>

</template>

<style scoped>

.upload{
  color: #FDFCFE;
  background-color: #1D1E26;
  border: none;
  float: left;
  margin-top: -420px;
  margin-left: 40px;
  font-size: 1.4rem;
  border-radius: 50px;
  height: 30px;
}

</style>

