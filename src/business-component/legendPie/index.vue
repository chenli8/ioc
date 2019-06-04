<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <PieChart :config="chart.config" :data="chart.data" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></PieChart>
    <div :class="$style[`${clsPrefix}${clsName}-legendCon`]">
      <div v-show="show" v-for="(item,index) in  chart.data" :key="index">
        <template v-for=" (val,key) in  item">
                <div
                  v-if="key.indexOf('name')>-1&&key!=='name'"
                  :key="key+Math.random()"
                  :class="$style[`${clsPrefix}${clsName}-legend`]"
                >
                  <i
                    :class="$style[`${clsPrefix}${clsName}-circle`]"
                    :style="{borderColor:colors[(Number(key.substring(4,5))-1)*2]}"
                  ></i>
                  <span :class="$style[`${clsPrefix}${clsName}-legend-name`]">{{val}}</span>
                  <span>{{item[`value${key.substring(4,5)}`]}}%</span>
                </div>
     </template>
        </div>
      </div>
  </div>
</template>

<script>
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import {
    createChartTemp,
  } from "@/lib/util.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import PieChart from "@/business-component/chart/pieChart.vue";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    BLUECOLORS,
    COLORS,
    COLORS2
  } from "@/business-component/chart/chart.config.js";
  export default {
    props: {
      chartData: {
        type: Array,
        default: () => {
          return {};
        }
      }
    },
    data() {
      let COLORS = [];
      COLORS2.forEach(item => {
        COLORS.push(item, item);
      });
      return {
        colors: COLORS,
        clsName: "legendPie",
        chart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: COLORS
        }, [], {
          series: [{
            center: ["42%", "50%"],
            radius: ["60%", "80%"]
          }]
        })
      };
    },
    computed: {

    },
    watch:{
      chartData:function(){
        this.formateData(this.chartData);
    }
    },
    components: {
      HeaderBar,
      PieChart
    },
    mixins: [clsMixin],
    mounted() {
      this.formateData(this.chartData);
    },
    methods: {
      formateData(data) {
        let dataList = [];
        if (data.length > 0) {
          this.chart.data = data;
          this.show = true;
          this.chart.config.color = this.colors;
        } else {
          dataList = Array(1).fill({
            name1: "",
            value1: 10,
            label: ""
          });
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.averageDistance = 0;
          this.commuterDistanceRank = 0;
          this.chart.data = dataList;
          this.show = false;
        }
      }
    }
  };
</script>

<style module lang='less'>
  @import "./index.less";
</style>
