<script setup>
import FlashCard from './components/FlashCard.vue'
import Authenticate from './components/authenticate.vue';
import Questionnaire from './components/Questionnaire.vue';
</script>

<template>
  <div class="nav">
    <h1>STUDY PAL</h1>
    <Authenticate/>
  </div>
  <FlashCard/>
  <Questionnaire/>
  <button class="upload">Upload File &plus;</button>


</template>

<style scoped>
h1{
  color: #FDFCFE;
  margin-left: 40px;
  text-align: left;
}

.upload{
  /* margin-left: -400px; */
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
