<script setup lang="ts">
import MyLineChart from './components/MyLineChart.vue'
</script>

<template>
  <h1>Echarts with External Toolbar</h1>
  <div class="border-1 border-400 border-round">
    <MyLineChart style="height:500px" />
  </div>
  <h2>Usage</h2>
  <ul>
    <li>Use mouse wheel for zoom in/out</li>
    <li>Select <i class="pi pi-compass"></i> to pan by dragging (if you've zoomed in)</li>
    <li>Select <i class="pi pi-check-square"></i> to select lines by brushing</li>
    <li>Select <i class="pi pi-search-plus"></i> to zoom by brushing</li>
    <li>Click <i class="pi pi-search-minus"></i> to zoom out to full view</li>
    <li>Click <i class="pi pi-image"></i> to download chart as image</li>
  </ul>
  <hr />
  <p>Built from <a href="https://github.com/wuruoyun/echarts-ext-toolbar">Github</a></p>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: auto;
  max-width: 800px;
}
</style>
