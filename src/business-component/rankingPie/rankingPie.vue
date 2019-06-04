<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="chartData.title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div :class="$style[`${clsPrefix}${clsName}-subTitle`]">
        <div>
          <span>{{chartData.totalName}}</span>
          <div :class="$style[`${clsPrefix}${clsName}-distance`]">
            {{chartData.total}}
            <span :class="$style[`${clsPrefix}${clsName}-unit`]">{{chartData.unit}}</span>
          </div>
        </div>
        <div>
          <span>省内排名</span>
          <div :class="$style[`${clsPrefix}${clsName}-average`]">
            <b>{{chartData.ranking}}/</b>
            {{siblingsNum}}
          </div>
        </div>
      </div>
      <PieChart
        :config="chart.config"
        :data="chart.data"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-piechart`]"
      ></PieChart>
    </div>
  </div>
</template>

<script>
import clsMixin from "@/business-component/mixins/clsMixin.js";
import {
  createChartTemp,
  units
} from "@/lib/util.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import PieChart from "@/business-component/chart/pieChart.vue";
import hexToRgba from "@/lib/hexToRgba.js";
import {
  BLUECOLORS
} from "@/business-component/chart/chart.config.js";
export default {
  props: {
    chartData: {
      type: Object,
      default: () => { }
    },
    siblingsNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      clsName: "rankingPie",
      chart: createChartTemp({
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
      }, [], {
          series: [{
            radius: ["60%", "80%"],
            label: {
              show: true,
              unit: units[0]
            },
          }]
        })
    };
  },
  computed: {

  },
  components: {
    HeaderBar,
    PieChart
  },
  mixins: [clsMixin],
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.chartData.inflowData.length > 0) {
        this.chart.data = this.chartData.inflowData;
        delete this.chart.config.color;
        this.chart.other.series[0].label.show = true;
      } else {
        const dataList = Array(3).fill({
          name1: "",
          value1: 10,
        });
        this.chart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.1),
          hexToRgba(BLUECOLORS[1], 0.1)
        ];
        this.chart.other.series = {
          label: {
            show: false
          }
        };
        this.chart.data = dataList;
      }

    }
  }
};
</script>

<style module lang='less'>
@import "./rankingPie.less";
</style>
