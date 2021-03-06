<script setup lang="ts">
import { ref, computed } from 'vue'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import VChart from "vue-echarts"

import { use, ComposeOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import type { Interaction } from '../types'
import { isPolyLineIntersectsBox } from '../utils/IntersectionUtil'

import {
  TitleComponent,
  TitleComponentOption,
  GridComponent,
  GridComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
  BrushComponent,
  BrushComponentOption,
  ToolboxComponent,
  ToolboxComponentOption
} from 'echarts/components'

type ECOption = ComposeOption<
  | TitleComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | BrushComponentOption
  | ToolboxComponentOption
>

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  DataZoomComponent,
  BrushComponent,
  ToolboxComponent
])

const chart = ref<InstanceType<typeof VChart> | null>(null)
let interaction = ref<Interaction>('NAVIGATE')
const rawData = ref([
  [150, 230, 224, 218, 135, 147, 260],
  [120, 210, 169, 198, 105, 127, 190],
  [80, 130, 109, 128, 89, 76, 100]
])

const colors = ['#5470c6', '#91cc75', '#fac858']

const series = computed(() => {
  return rawData.value.map((s, i) => {
    return {
      name: '' + i,
      data: s.map((v, i) => [i + 1, v]),
      type: 'line',
    }
  })
})

function _getLineOpacity(selected: number[]) {
  return rawData.value.map((d, i) => {
    const color = selected.length === 0 || selected.includes(i) ? colors[i] : 'lightgrey'
    return {
      lineStyle: { color },
      itemStyle: { color }
    }
  })
}

const option = computed<ECOption>(() => {
  return {
    title: {
      text: 'My Line Chart',
      left: 'center',
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'value',
    },
    brush: {
      xAxisIndex: 0,
      throttleType: 'debounce',
      throttleDelay: 100,
      outOfBrush: {
        colorAlpha: 1
      },
      inBrush: {
        colorAlpha: .3
      },
    },
    toolbox: {
      show: false // to hide the brush toolbox
    },
    series: series.value,
    dataZoom: [
      {
        id: 'dataZoomX',
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        id: 'dataZoomY',
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none'
      },
    ],
  }
})

function handleBrushEnd(params: any) {
  const { areas } = params
  const { coordRange } = areas[0]
  if (interaction.value === 'ZOOM') {
    if (areas && areas.length === 1) {
      // zoom to the brush area
      chart.value?.dispatchAction({
        type: 'dataZoom',
        batch: [{
          startValue: coordRange[0][0],
          endValue: coordRange[0][1]
        }, {
          dataZoomIndex: 1,
          startValue: coordRange[1][0],
          endValue: coordRange[1][1]
        }]
      })
    }
  } else if (interaction.value === 'SELECT') {
    const seriesSelected: number[] = []
    if (areas && areas.length === 1) {
      const p1 = { x: coordRange[0][0], y: coordRange[1][1] }
      const p2 = { x: coordRange[0][1], y: coordRange[1][0] }
      rawData.value.forEach((s, i) => {
        if (isPolyLineIntersectsBox(s, p1, p2)) {
          seriesSelected.push(i)
        }
      })
    }
    chart.value?.setOption({
      series: _getLineOpacity(seriesSelected)
    })
  }
  // remove the brush area
  chart.value?.dispatchAction({
    type: 'brush',
    areas: []
  })
}

function handleClick(params: any) {
  if (interaction.value === 'SELECT') {
    // clear the selection, alternatively may select a single serie close to the click point
    chart.value?.setOption({
      series: _getLineOpacity([])
    })
  }
}

function activateZoom() {
  chart.value?.dispatchAction({
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: {
      brushType: 'rect',
      brushMode: 'single'
    }
  })
  interaction.value = 'ZOOM'
}

function activateSelect() {
  chart.value?.dispatchAction({
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: {
      brushType: 'rect',
      brushMode: 'single'
    }
  })
  interaction.value = 'SELECT'
}

function activateNavigate() {
  chart.value?.dispatchAction({
    type: 'takeGlobalCursor'
  })
  chart.value?.dispatchAction({
    type: 'brush',
    areas: []
  })
  interaction.value = 'NAVIGATE'
}

function resetZoom() {
  // zoom to the full range
  chart.value?.dispatchAction({
    type: 'dataZoom',
    batch: [
      {
        start: 0,
        end: 100
      }, {
        dataZoomIndex: 1,
        start: 0,
        end: 100
      }
    ]
  })
}

function downloadImage() {
  const source = chart.value?.getDataURL({
    type: 'png',
    backgroundColor: 'white'
  })
  if (source) {
    const el = document.createElement("a")
    el.setAttribute("href", source)
    el.setAttribute("download", 'Chart-download')
    document.body.appendChild(el)
    el.click()
    el.remove()
  }
}
</script>

<template>
  <div class="flex flex-column">
    <Toolbar class="flex-none">
      <template #end>
        <Button icon="pi pi-compass" v-tooltip.bottom="'Navigate'" @click="activateNavigate"
          class="p-button-rounded p-button-text" :class="{ 'p-button-plain': interaction != 'NAVIGATE' }" />
        <Button icon="pi pi-check-square" v-tooltip.bottom="'Select'" @click="activateSelect"
          class="p-button-rounded p-button-text" :class="{ 'p-button-plain': interaction != 'SELECT' }" />
        <Button icon="pi pi-search-plus" v-tooltip.bottom="'Zoom'" @click="activateZoom"
          class="p-button-rounded p-button-text" :class="{ 'p-button-plain': interaction != 'ZOOM' }" />
        <Button icon="pi pi-search-minus" v-tooltip.bottom="'Zoom reset'" @click="resetZoom"
          class="p-button-rounded p-button-text p-button-plain" />
        <Button icon="pi pi-image" v-tooltip.bottom="'Download image'" @click="downloadImage"
          class="p-button-rounded p-button-text p-button-plain" />
        <Button icon="pi pi-cog" v-tooltip.bottom="'Other config'"
          class="p-button-rounded p-button-text p-button-plain" />
      </template>
    </Toolbar>
    <div class="flex-grow-1 relative">
      <v-chart ref="chart" class="h-full" :option="option" @zr:click="handleClick" @brushEnd="handleBrushEnd"
        autoresize />
      <!-- <GlassPane/> -->
    </div>
  </div>
</template>
