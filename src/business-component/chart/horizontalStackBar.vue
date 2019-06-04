<template>
  <Axis :series="chart.series" :config="chart.config"></Axis>
</template>

<script>
import { merge, createChartTemp, units } from '@/lib/util.js';
import hexToRgba from '@/lib/hexToRgba.js';
import Axis from '@/components/chart/axis.vue';
import { COLORS, GRADIENTCOLORS, getHorizontalStackBarConfig, getHorizontalStackBarSeriesConfig } from '@/business-component/chart/chart.config.js';
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
        return {};
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
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
    init() {
    },
    renderChart() {
      const data = this.data;
      let config = getHorizontalStackBarConfig();
      let datas = [];
      let yAxisData = [];
      let series = [];
      const firstItem = data[0];
      merge(config, this.config);

      // set legend
      let legendData = [];
      let legendDataLen = 0;
      let legendNames = [];

      for (let key in firstItem) {
        const name = firstItem[`${key}`];
        if (name !== undefined && key.indexOf('name') !== -1&&key!=='name') {
          legendNames.push(name);
        }
      }
      legendDataLen = legendNames.length;

      for (let i = 0; i < legendDataLen; i++) {
        const name = legendNames[i];
        let item = merge({
          name,
          icon: 'circle',
          textStyle: {
            color: config.color[i * 2] || COLORS[0]
          }
        }, config.legend.data[i] || {});

        legendData.push(item);
      }
      // set datas
      for (let i = 0; i < legendDataLen; i++) { datas.push([]) }
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        yAxisData.push(item.label || '');
        //图例数组长度代表数据分组有多少个
        for (let l = 0; l < legendDataLen; l++) {
          const val = item[`value${l + 1}`];
          if (val !== undefined) {
            datas[l].push(val);
          }
        }
      }
      for (let i = 0; i < legendDataLen; i++) {
        let seriesConfig = getHorizontalStackBarSeriesConfig();
        const otherSeriesConfig = Array.isArray(this.other.series) ? this.other.series[i] || {} : this.other.series || {};
        merge(seriesConfig, otherSeriesConfig);
        seriesConfig.label.formatter = '{c}' + (seriesConfig.label.unit !== undefined ? seriesConfig.label.unit : units[0]);
        //设置渐变色系
         const startColor = config.color[i * 2] || GRADIENTCOLORS[0];
        const endColor = config.color[i * 2 + 1] || GRADIENTCOLORS[1];
        seriesConfig.itemStyle.color.colorStops[0].color =startColor.indexOf('rgb') > -1 ? startColor : hexToRgba(startColor, 1);
        seriesConfig.itemStyle.color.colorStops[1].color =endColor.indexOf('rgb') > -1 ? endColor : hexToRgba(endColor, 1);
        seriesConfig.name = legendData[i]['name'];
        seriesConfig.data = datas[i];
        seriesConfig.stack = '总量';
        series.push(seriesConfig);
      }
      config.legend.data = legendData;
      config.yAxis[0].data = yAxisData;
      this.chart.config = config;
      this.chart.series = series;
    }
  }
}
</script>

