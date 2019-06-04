<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
     <p :class="$style[`${clsPrefix}${clsName}-subTitle`]">
       <span>全市城镇比重</span>
       <span :class="[$style[`${clsPrefix}${clsName}-rate`],$style[`${clsPrefix}${clsName}-disMargin`]]">{{urbanRate}}%</span>
       <!-- <span>排名</span>
       <span :class="$style[`${clsPrefix}${clsName}-rate`]">{{ranking}}/{{siblingsNum}}</span> -->
     </p>
     <div :class="$style[`${clsPrefix}${clsName}-chartCon`]">
      <div  :class="$style[`${clsPrefix}${clsName}-pieCon`]">
   <PieChart
      :config='piechart.config'
      :data='piechart.data'
      :other='piechart.other'
      :class="$style[`${clsPrefix}${clsName}-piechart`]"
     ></PieChart>
      </div>
     <LineChart
      :config='lineChart.config'
      :data='lineChart.data'
      :other='lineChart.other'
      :class="$style[`${clsPrefix}${clsName}-linechart`]"
     ></LineChart>
     </div>
    </div>
    </BorderBg>
    
  </div>
</template>

<script>
import { mapState } from "vuex";
import { BLUECOLORS } from "@/business-component/chart/chart.config.js";
import hexToRgba from "@/lib/hexToRgba.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import {
  createChartTemp,
  convertArrayData,
  convertObjectData,
  units
} from "@/lib/util.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import PieChart from "@/business-component/chart/pieChart.vue";
import LineChart from "@/business-component/chart/lineChart.vue";
import BorderBg from '@/business-component/borderBg/index.vue';

export default {
  data() {
    return {
      clsName: "countyContrast",
      title: "全市人口城镇比重近10年趋势",
      piechart: createChartTemp(
        {
          tooltip: {
            show: true
          },
          legend: {
            show: false
          }
        },
        [],
        {
          series: [
            {
              radius:['55%','75%'],
              label: {
                show: true,
                unit: units[0]
              }
            }
          ]
        }
      ),
      lineChart: createChartTemp({
         grid:{
          right:'4%'
        },
        xAxis: [{
          axisLabel: {
            rotate: 60,
            interval: 0
          }
        }],
        tooltip: {
          show: true,
          formatter:function(v){
            return `${v[0].name}<br/>${v[0].seriesName}:${v[0].value}${units[0]}`
          }
        },
      }),
      urbanRate: 0,
      ranking: 0
    };
  },
  mixins: [clsMixin],
  components: { HeaderBar, PieChart, LineChart,BorderBg },
  computed: {
    ...mapState({
      init: state => state.populationStructure.init,
      siblingsNum: state => state.cityInfo.siblingsNum,
      cityStructureTrend: state => state.populationStructure.cityStructureTrend
    })
  },
  watch: {
    cityStructureTrend: function(val, oldVal) {
      this.formatData(this.cityStructureTrend);
    }
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.cityStructureTrend);
    },
    formatData(data = {}) {
      if (Object.keys(data).length > 0) {
        //17年城镇比例值
        const current = data[0];
        this.urbanRate = current.urbanRate;
        this.ranking = this.childrenNum;
        //pie
        const pieData = [
          {
            name1: "农村",
            value1: current.ruralRate,
            label1: "农村",
            name2: "城镇",
            label2: "城镇",
            value2: current.urbanRate
          }
        ];
        this.piechart.data = pieData;
        delete this.lineChart.config.color;
        this.piechart.other.series = {
              radius:['55%','75%'],
              label: {
                show: true,
                unit: units[0]
              }
            };
        //linechart
        const dataList = convertArrayData(
          data,
          {
            nameValues: ["城镇比重"],
            valueKeys: ["urbanRate"]
          },
          {
            label: "dateTime"
          }
        );
        this.lineChart.data = dataList.reverse();
        delete this.lineChart.config.color;
        this.lineChart.config.tooltip.show = true;
      } else {
        //piechart
        const pieData = Array(1).fill({
          name1: "",
          value1: 60
        });
        this.piechart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.piechart.data = pieData;
        this.piechart.other.series = {
          label: {
            show: false
          }
        };
        //linechart
        const dataList = Array(10).fill({
          name1: "",
          value1: 60
        });
        this.lineChart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.lineChart.config.tooltip = {
          show: false
        };
        this.lineChart.data = dataList;
      }
    }
  },
  beforeDestroy() {}
};
</script>

<style module lang="less">
@import "./countyContrast.less";
</style>
