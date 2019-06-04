<template>
  <div
    :class="[$style[`${clsPrefix}${clsName}`],this.direction=== 'column' ? '':  $style[`${clsPrefix}${clsName}-flexbox`]]"
  >
    <PieChart
      :config="pieChart.config"
      :data="pieChart.data"
      :other="pieChart.other"
      :class="[$style[`${clsPrefix}${clsName}-piechart`],this.direction=== 'column' ? $style[`${clsPrefix}${clsName}-columnPiechart`] : '']"
    ></PieChart>
    <div
      :class="[$style[`${clsPrefix}${clsName}-charttip`],this.direction=== 'column' ? $style[`${clsPrefix}${clsName}-columnCharttip`] : '']"
    >
      <div :class="$style[`${clsPrefix}${clsName}-tipItem`]">
        <i :class="$style[`${clsPrefix}${clsName}-circle`]"></i>
        <span>{{chartData.name1}}</span>
        <span :class="$style[`${clsPrefix}${clsName}-radio`]">{{chartData.value1}}%</span>
      </div>
      <div :class="$style[`${clsPrefix}${clsName}-tipItem`]">
        <i :class="$style[`${clsPrefix}${clsName}-circle`]"></i>
        <span>{{chartData.name2}}</span>
        <span :class="$style[`${clsPrefix}${clsName}-radio`]">{{chartData.value2}}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import clsMixin from "@/business-component/mixins/clsMixin.js";
import { createChartTemp, merge } from "@/lib/util.js";
import PieChart from "@/business-component/chart/pieChart.vue";
import hexToRgba from '@/lib/hexToRgba.js';
import { BLUECOLORS, GREENCOLORS } from "@/business-component/chart/chart.config.js";
export default {
  props: {
    chartData: {
      type: Object,
      default: () => { return {}; }
    },
    direction: {
      type: String,
      default: 'row'
    },
    pieChartConfig: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      clsName: "pieChartTip",
      pieChart: createChartTemp(
        {
          tooltip: {
            show: false
          },
          legend: {
            show: false
          }
        },
        [],
        {
          series: [
            {
              radius: ["78%", "95%"],
            }
          ]
        }
      )
    };
  },
  computed: {},
  components: {
    PieChart
  },
  mixins: [clsMixin],
  watch: {
    chartData: function () {
      this.formatData(this.chartData);
    }
  },
  mounted() {
    this.formatData(this.chartData);
  },
  methods: {
    formatData(data) {
      if (Object.values(data).length > 0) {
        merge(this.pieChart.other, this.pieChartConfig);
        this.pieChart.data = [data];
      } else {
        const dataList = Array(1).fill({
          name1: "",
          value1: 0,
        });
        this.pieChart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.1),
          hexToRgba(BLUECOLORS[1], 0.1)
        ];
        this.pieChart.data = dataList;
      }
    }
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
