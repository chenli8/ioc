<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-top`]">
      <div :class="$style[`${clsPrefix}${clsName}-title`]">{{title}}</div>
      <div :class="$style[`${clsPrefix}${clsName}-numberCon`]">
        <span :class="$style[`${clsPrefix}${clsName}-number`]">{{number}}</span>
        <span :class="$style[`${clsPrefix}${clsName}-unit`]">{{unit}}</span>
      </div>
      <div :class="$style[`${clsPrefix}${clsName}-dis`]">{{dis}}</div>
    </div>
    <HorizontalBar
        :config='barChart.config'
        :data='barChart.data'
        :other='barChart.other'
        :class="$style[`${clsPrefix}${clsName}-barchart`]"
    ></HorizontalBar>
  </div>
</template>

<script>
import clsMinxin from "../../business-component/mixins/clsMixin.js";
import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
import { createChartTemp ,merge} from "@/lib/util.js";
import hexToRgba from "@/lib/hexToRgba.js";
import { BLUECOLORS } from "@/business-component/chart/chart.config.js";
import { constants } from 'fs';
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    unit: {
      type: String,
      default: ""
    },
    number: {
      type: Number,
      default: 65.2
    },
    dis: {
      type: String,
      default: ""
    },
    chartData: {
      type: Array,
      default: () => {}
    },
     chartConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      clsName: "growth",
      barChart: createChartTemp({
        tooltip:{
          show:false
        },
      }, [], {
        
      })
    };
  },
  components: { HorizontalBar },
  mixins: [clsMinxin],
  methods: {
    init() {
      if (this.chartData.length > 0) {
        this.barChart.data = this.chartData;
        merge(this.barChart.other,this.chartConfig.other)
        merge(this.barChart.config,this.chartConfig)
      } else {
        const dataList = Array(7).fill({
          name1: "",
          value1: 100
        });
        this.barChart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.barChart.data = dataList;
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
