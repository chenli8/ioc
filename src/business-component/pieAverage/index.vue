<template>
  <div 
 :class="$style[`${clsPrefix}${clsName}`]"
  >
    <span 
    :class="[$style[`${clsPrefix}${clsName}-title`],chartData.top === 1 ? $style[`${clsPrefix}${clsName}-one`] : '',chartData.top === 2 ? $style[`${clsPrefix}${clsName}-second`] : '',chartData.top === 3 ? $style[`${clsPrefix}${clsName}-three`] : '']"
    >TOP{{chartData.top}}{{chartData.name}}</span>
    <PieChart
      :config="pieChart.config"
      :data="pieChart.data"
      :other="pieChart.other"
      :class="$style[`${clsPrefix}${clsName}-piechart`]"
    ></PieChart>
    
  </div>
</template>

<script>
import clsMixin from "@/business-component/mixins/clsMixin.js";
import { createChartTemp ,merge,toFixed} from "@/lib/util.js";
import PieChart from "@/business-component/chart/pieChart.vue";
import hexToRgba from '@/lib/hexToRgba.js';
import { BLUECOLORS, GREENCOLORS ,FONTCOLOR} from "@/business-component/chart/chart.config.js";
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {return {} }
    }
  },
  data() {
    return {
      clsName: "pieAverage",
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
              radius: ["65%", "85%"],
              label: {
                show: true,
                position: 'center',
                formatter: (par)=>{
                   const value =toFixed(par.value,2);
                   return par.name==='占比'?`${value}%`:'';
                },
                textStyle: {
                  color: FONTCOLOR,
                  fontSize:'16'
                }
              },
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.chartData && Object.keys(this.chartData).length > 0) {
        this.pieChart.data = Array(1).fill(this.chartData);
        merge(this.pieChart.config,this.chartData.chartConfig);
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
