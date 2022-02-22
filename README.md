[![Netlify Status](https://api.netlify.com/api/v1/badges/2fdabf04-1402-4ae2-8f80-553025259a6c/deploy-status)](https://app.netlify.com/sites/elated-hypatia-ecf24d/deploys)

# ECharts with External Toolbar

[Apache Echarts](https://echarts.apache.org/) is a powerful JavaScript visualisation library. It has a built-in [toolbox](https://echarts.apache.org/en/option.html#toolbox) and supports customization. However, a toolbar outside the chart may provide more consistent styling with the rest of your application and allows more flexible customization.

This project demonstrates this with a LineChart and [PrimeVue](https://www.primefaces.org/primevue/) toolbar, built with Vue 3 and Vite.

Please visit the [demo online](https://elated-hypatia-ecf24d.netlify.app/).

> The code is written in a way more for demonstration, rather than reusability.

## Features

The first three buttons in the toolbar allow user to switch between three exclusive interaction modes:

- `Navigate`: Scroll mouse wheel to zoom in/out and click-and-drag to pan (if you already zoomed in)
- `Select`: Select lines with a brush box
- `Zoom`: Zoom into a region with a brush box

The other buttons in the toolbar triggers one-time action:

- `Zoom reset`: Reset the zoom rate to view all data
- `Download image`: Download the chart to an image file
- `Other config`: A placeholder to add other custom configurations, like change axis to log scale, change color options, etc.

## Setup

```bash
# install the dependency
npm install

# run the app using Vite
npm run dev

# build the app
npm run build
```

## How it works?

### Navigate

In "Navigate" mode, you may zoom in/out the chart with mouse wheel and pan the chart with click-and-draging. It is the default behavior when you have [dataZoom](https://echarts.apache.org/en/option.html#dataZoom) in your chart options.

The zooming with mouse wheel still works even if "Navigate" mode is not active. This is because the mouse wheel is not used by "Select" and "Zoom" mode, therefore no conflict. The mouse interaction that needs to be exclusive for each modes is the click-and-draging.

### Select

In "Select" mode, you may select one or more lines by click-and-draging a brush box. The lines that are intersecting with the box will be selected. The selected lines are "highlighted" by remaining its color and other lines are faded. Clicking on the chart without dragging reset the selection. This behavior isn't the same as built-in brush-select in Echarts.

With [brush](https://echarts.apache.org/en/option.html#brush) configured in the chart option, interactive brushing can be activated via [action.brush.takeGlobalCursor](https://echarts.apache.org/en/api.html#action.brush.takeGlobalCursor) action. Once user finished the brushing, the [brushEnd](https://echarts.apache.org/en/api.html#events.brushEnd) event is used to get the brush area for a custom selection.

The [series-line.lineStyle.opacity](https://echarts.apache.org/en/option.html#series-line.lineStyle.opacity) for each series are set to differentiate the selected lines from the unselected ones. The [series-line.select.lineStyle.opacity](https://echarts.apache.org/en/option.html#series-line.select.lineStyle) could have been a better option but it does not seem to work.

### Zoom

In "Zoom" mode, you may zoom into an area by click-and-draging a brush box. Although you could still zoom in/out using mouse wheel, zooming with a box is more precise and useful in some particular use cases.

Similar to "Select" mode, the [brushEnd](https://echarts.apache.org/en/api.html#events.brushEnd) event is used to get the brush area and then a [dataZoom](https://echarts.apache.org/en/api.html#action.dataZoom) action is dispatched to performt the zooming programmatically.

The "Zoom reset" button shows the default zoom rate also by dispatching a [dataZoom](https://echarts.apache.org/en/api.html#action.dataZoom) action.

### Download image

The chart image for downloading is obtained via the [echartsInstance.getDataURL](https://echarts.apache.org/en/api.html#echartsInstance.getDataURL) API.

The download is done via a programmatically added anchor tag.
