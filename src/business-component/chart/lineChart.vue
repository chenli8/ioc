<template>
  <Axis :series="chart.series" :config="chart.config"></Axis>
</template>

<script>
/**
 * 折线图
 */
import hexToRgba from '@/lib/hexToRgba.js';
import { merge, createChartTemp } from '@/lib/util.js';
import Axis from '@/components/chart/axis.vue';
import { getIcon, getLineConfig, getLineSeriesConfig, GRADIENTCOLORS, COLORS } from '@/business-component/chart/chart.config.js';
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    other: {
      type: Object,
      default: () => {
        return
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      chart: createChartTemp()
    }
  },
  watch: {
    data: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  },
  components: { Axis },
  mounted() {
  },
  methods: {
    renderChart() {
      const data = this.data;
      let config = getLineConfig();
      let datas = [];
      let xAxisData = [];
      let series = [];
      const firstItem = data[0];
      merge(config, this.config);

      // set legend
      let legendData = [];
      let legendDataLen = 0;
      let legendNames = [];
      // set units;
      let units = [];
      for (let key in firstItem) {
        const name = firstItem[`${key}`];
        if (name !== undefined) {
          if (key.indexOf('name') !== -1 && key !== 'name') {
            legendNames.push(name);
          }
        }
      }
      legendDataLen = legendNames.length;
      for (let i = 0; i < legendDataLen; i++) {
        const name = legendNames[i];
        let item = merge({
          name,
          textStyle: {
            color: config.color[i * 2] || COLORS[0]
          }
        }, config.legend.data[i] || {});

        legendData.push(item);
      }
      // set yAxis
      for (let k = 0; k < config.yAxis.length; k++) {
        const axis = config.yAxis[k];
        axis.axisLabel.formatter = '{value}' + (axis.axisLabel && axis.axisLabel.unit !== undefined ? axis.axisLabel.unit : '');
      }
      if (config.yAxis[0].name !== undefined) {
        config.grid.top += 10;
      }
      // set datas
      for (let i = 0; i < legendDataLen; i++) { datas.push([]) }
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        xAxisData.push(item.label || '');
        //图例数组长度代表数据分组有多少个
        for (let l = 0; l < legendDataLen; l++) {
          const val = item[`value${l + 1}`];
          if (val !== undefined) {
            datas[l].push(val);
          }
        }
      }
      for (let i = 0; i < legendDataLen; i++) {
        let seriesConfig = getLineSeriesConfig();
        const otherSeriesConfig = Array.isArray(this.other.series) ? this.other.series[i] || {} : this.other.series || {};
        merge(seriesConfig, otherSeriesConfig);
        //set units
        let unit =otherSeriesConfig.label?otherSeriesConfig.label.unit || '':'';
        units.push(unit);
        //设置渐变色系
        const startColor = config.color[i * 2] || GRADIENTCOLORS[0];
        const endColor = config.color[i * 2 + 1] || GRADIENTCOLORS[1];
        seriesConfig.itemStyle.color.colorStops[0].color = startColor.indexOf('rgb') > -1 ? startColor : hexToRgba(startColor, 1);
        seriesConfig.itemStyle.color.colorStops[1].color = endColor.indexOf('rgb') > -1 ? endColor : hexToRgba(endColor, 1);
        seriesConfig.areaStyle.color.colorStops[0].color = startColor.indexOf('rgb') > -1 ? startColor : hexToRgba(startColor, 0.5);
        seriesConfig.areaStyle.color.colorStops[1].color = endColor.indexOf('rgb') > -1 ? endColor : hexToRgba(endColor, 0.5);
        if (seriesConfig.label && seriesConfig.label.formatter === undefined) {
          seriesConfig.label.formatter = '{c}' + unit;
        }
        seriesConfig.name = legendData[i]['name'];
        seriesConfig.data = datas[i];
        seriesConfig.smooth = true;//平滑过渡
        series.push(seriesConfig);
      }
      //set tooltip
      if (config.tooltip && config.tooltip.show && config.tooltip.formatter === undefined) {
        config.tooltip.formatter = (par) => {
          let str = '';
          par.forEach((p, index) => {
            const color = typeof (p.color) !== 'string' ? p.color.colorStops[0].color : p.color;
            const icon = getIcon(color);
            if (index === 0) {
              str += `${p.name}<br/>`;
            }
            str += `${icon}${p.seriesName}: ${p.value} ${units[p.seriesIndex] || ''}<br/>`;
          });
          return str;
        }
      }
      config.legend.data = legendData;
      config.xAxis[0].data = xAxisData;
      this.chart.config = config;
      this.chart.series = series;

    }
  }
}
</script>

