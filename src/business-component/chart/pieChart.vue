<template>
  <Pie :series="chart.series" :config="chart.config" ref="pie"></Pie>
</template>

<script>
/**
 * 饼图
 */
import hexToRgba from '@/lib/hexToRgba.js';
import { merge, createChartTemp } from '@/lib/util.js';
import Pie from '@/components/chart/pie.vue';
import { getPieConfig, getPieSeriesConfig, GRADIENTCOLORS, COLORS } from '@/business-component/chart/chart.config.js';
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
  components: { Pie },
  mounted() {
  },
  methods: {
    renderChart() {
      const data = this.data;
      let config = getPieConfig();
      let legendData = [];
      let series = [];
      merge(config, this.config);
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let seriesConfig = getPieSeriesConfig();
        const otherSeriesConfig = Array.isArray(this.other.series) ? this.other.series[i] || {} : this.other.series || {};
        merge(seriesConfig, otherSeriesConfig);

        let valueKeys = (Object.keys(item)).filter((key) => {
          return key.indexOf('value') > -1;
        });
        let seriesData = valueKeys.map((key, index) => {
          const name = item[`name${index + 1}`] || '';
          const value = item[`value${index + 1}`] || 0;
          legendData.push(name);
          //设置渐变色系
          const itemStyle = merge({}, seriesConfig.itemStyle);
          const startColor = config.color[index * 2] || GRADIENTCOLORS[0];
          const endColor = config.color[index * 2 + 1] || GRADIENTCOLORS[0];
          itemStyle.color.colorStops[0].color = startColor.indexOf('rgb') > -1 ? startColor : hexToRgba(startColor, 1);
          itemStyle.color.colorStops[1].color = endColor.indexOf('rgb') > -1 ? endColor : hexToRgba(endColor, 1);
          // set dataLabelColor
          const label = merge({}, seriesConfig.label || {});
          if (label.show) {
            let color = seriesConfig.label.color;
            label.color = color ? color : config.color[index * 2];
            if (label.formatter === undefined) {
              const unit = otherSeriesConfig.label ? otherSeriesConfig.label.unit || '' : '';
              label.formatter = "{b}\n{d}" + unit;
            }
          }
          return {
            name,
            value,
            itemStyle,
            label,
          }
        });

        seriesConfig.data = seriesData;
        series.push(seriesConfig);
      }
      config.legend.data = legendData;
      this.chart.config = config;
      this.chart.series = series;

    }
  }
}
</script>

