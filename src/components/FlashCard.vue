<script setup>
import { ref } from 'vue'


</script>

<template>
  <div class="box">
    <div class="card">
      <p id="question">What is computer security most associated with</p>
      <button id="answer">Answer</button>
    </div>

    <button id="previous">
      <p>&larr; Previous</p>
    </button>

    <button id="next">
      <p>Next &rarr;</p>
    </button>

  </div>


</template>

<style scoped>
.box{
  /* background-color: red; */
  width: 580px;
  height: 440px;
  margin-left: 300px;
  margin-top: 50px;
}
.card{
    width: 380px;
    height: 310px;
    padding: 20px;
    background-color: #222226;
    color: #FDFCFE;
    border-radius: 50px;
    margin-left: 80px;

}

#question{
  margin-top: 40px;
  font-size: 1.5rem;
}

#answer{
  background-color: #8965A3;
  color: #FDFCFE;
  border-radius: 50px;
  width: 120px;
  height: 45px;
  font-size: 1.1rem;
  margin-top: 110px;
  border: none;
}

#previous{
  background-color: #1D1E26;
  width: 100px;
  height: 40px;
  margin-top: 10px;
  margin-left: 0px;
  color: #8E929D;
  border-radius: 50px;
  border-style: solid;
}

#previous p{
  display: inline-block;
  font-size: 1rem;
  margin-top:10% ;
}

#next{
  background-color: #1D1E26;
  width: 100px;
  height: 40px;
  margin-top: 10px;
  margin-left: 200px;
  color: #8E929D;
  border-radius: 50px;
  border-style: solid;
}

#next p{
  display: inline-block;
  font-size: 1rem;
  margin-top:10% ;
}


</style>
