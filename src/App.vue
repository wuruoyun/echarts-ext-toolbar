<script setup lang="ts">
import MyLineChart from './components/MyLineChart.vue'
</script>

<template>
  <h1>Echarts with External toolbar</h1>
  <div class="border-1 border-400 border-round">
    <MyLineChart style="height:500px"/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  max-width: 800px;
}
</style>
