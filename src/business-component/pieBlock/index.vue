<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <PieChart
      :config="pieChart.config"
      :data="pieChart.data"
      :other="pieChart.other"
      :class="[$style[`${clsPrefix}${clsName}-piechart`],chartCls]"
    ></PieChart>
    <div :class="$style[`${clsPrefix}${clsName}-info`]">
      <span>TOP{{ranking}}&nbsp;&nbsp;{{cityName}}</span>
      <span :class="$style[`${clsPrefix}${clsName}-percent`]">{{percent}}%</span>
    </div>
  </div>
</template>

<script>
import PieChart from "@/business-component/chart/pieChart.vue";
import {
  createChartTemp,
  merge
} from "@/lib/util.js";
import hexToRgba from "@/lib/hexToRgba.js";
import {
  BLUECOLORS,
} from "@/business-component/chart/chart.config.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
export default {
  props: {
    chartData: {
      type: Object,
      default: () => { }
    },
    cityName: {
      type: String,
      default: ""
    },
    ranking: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    },
    chartCls: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      clsName: "pieBlock",
      pieChart: createChartTemp({
        legend: {
          show: false
        },
      }, [], {
          series: [{
            radius: ["78%", "95%"],
            itemStyle: {
              borderWidth: 0
            }
          }]
        })
    };
  },
  mixins: [clsMixin],
  components: {
    PieChart
  },
  methods: {
    init(chartData) {
      if (Object.keys(chartData).length > 0) {
        merge(this.pieChart.config, chartData.config || {});
        chartData.value2 = 100 - (chartData.value1||0);
        this.pieChart.data = [chartData];
      } else {
        const dataList = Array(1).fill({
          'value1': 1
        })
        this.pieChart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.1),
          hexToRgba(BLUECOLORS[1], 0.1)
        ];
        this.pieChart.data = dataList;
      }
    }
  },
  mounted() {
    this.init(this.chartData);
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
