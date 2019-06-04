<template>
  <Axis :series="chart.series" :config="chart.config" ref="axis"></Axis>
</template>

<script>
/**
 * 散点图
 */
import hexToRgba from '@/lib/hexToRgba.js';
import { merge, createChartTemp } from '@/lib/util.js';
import Axis from '@/components/chart/axis.vue';
import { getIcon, getScatterConfig, getScatterSeriesConfig, GRADIENTCOLORS, COLORS } from '@/business-component/chart/chart.config.js';
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
      //data是一个二维数组
      const data = this.data;
      let config = getScatterConfig();
      // set legend
      let legendData = [];
      let legendDataLen = 0;
      let legendNames = [];
      let series = [];
      // set units;
      let units = [];
      merge(config, this.config);
      // set yAxis
      for (let y = 0; y < config.yAxis.length; y++) {
        const axis = config.yAxis[y];
        axis.axisLabel.formatter = '{value}' + (axis.axisLabel && axis.axisLabel.unit !== undefined ? axis.axisLabel.unit : '');
      }
      for (let x = 0; x < config.xAxis.length; x++) {
        const axis = config.xAxis[x];
        axis.axisLabel.formatter = '{value}' + (axis.axisLabel && axis.axisLabel.unit !== undefined ? axis.axisLabel.unit : '');
      }
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const legendName = item[0].legend || '';
        legendNames.push(legendName);
        let seriesConfig = getScatterSeriesConfig();
        const otherSeriesConfig = Array.isArray(this.other.series) ? this.other.series[i] || {} : this.other.series || {};
        merge(seriesConfig, otherSeriesConfig);
        //set units
        const unit = otherSeriesConfig.label ? otherSeriesConfig.label.unit || '' : '';
        units.push(unit);
        let seriesData = [];
        item.forEach((it) => {
          let values = [];
          let names = [];
          let labels = [];
          for (let key in it) {
            const val = it[`${key}`];
            if (val !== undefined) {
              if (key.indexOf('name') !== -1 && key !== 'name') {
                names.push(val);
              }
              if (key.indexOf('value') !== -1 && key !== 'value') {
                values.push(val);
              }
              if (key.indexOf('label') !== -1) {
                labels.push(val);
              }
            }
          }
          seriesData.push(values.concat(names).concat(labels));
        });
        //设置渐变色系
        const startColor = config.color[i * 2] || GRADIENTCOLORS[0];
        const endColor = config.color[i * 2 + 1] || GRADIENTCOLORS[1];
        seriesConfig.itemStyle.color.colorStops[0].color = startColor.indexOf('rgb') > -1 ? startColor : hexToRgba(startColor, 1);
        seriesConfig.itemStyle.color.colorStops[1].color = endColor.indexOf('rgb') > -1 ? endColor : hexToRgba(endColor, 1);
        seriesConfig.name = legendName;
        seriesConfig.data = seriesData;
        series.push(seriesConfig);
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
      //set tooltip
      if (config.tooltip && config.tooltip.show && config.tooltip.formatter === undefined) {

        config.tooltip.formatter = (par) => {
          let str = '';
          par.forEach((p, index) => {
            // const color = typeof (p.color) !== 'string' ? p.color.colorStops[0].color : p.color;
            // const icon = getIcon(color);
            const valLen = p.value.length;
            let values = [];
            let labelName = '';
            //说明有label
            if (valLen % 2 !== 0) {
              labelName = p.value[valLen - 1];
              values = p.value.slice(0, valLen - 1);
            } else {
              values = p.value.slice(0, valLen);
            }
            str += `${labelName}<br/>`;
            //数据分成多少组{name1,value1,name2,value2,name3,value3}
            const group=values.length / 2;
            for (let i = 0; i <group; i++) {
              let unit = units[index] || '';
              const unitType = Array.isArray(unit);
              unit = unitType ? unit[i]||'' : unit;
              const name = values[i + group] || '';
              const val = values[i] || '';
              str += `${name}:${val}${unit}<br/>`;
            }
          });
          return str;
        }
      }
      config.legend.data = legendData;
      this.chart.config = config;
      this.chart.series = series;
    }
  }
}
</script>

