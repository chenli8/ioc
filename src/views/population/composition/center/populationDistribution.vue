<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
    <HeaderBar :title="title"  
    :class="$style[`${clsPrefix}${clsName}-title`]"
    ></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <BarChart
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></BarChart>
    </div>
    </BorderBg>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { createChartTemp, units, formatThousands, toFixed ,convertArrayData} from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import BarChart from '@/business-component/chart/barChart.vue';
import {
  BLUECOLORS
} from '@/business-component/chart/chart.config.js';
import hexToRgba from "@/lib/hexToRgba.js";
import BorderBg from '@/business-component/borderBg/index.vue';

export default {
  data() {
    return {
      clsName: 'populationDistribution',
      title: '全市各区县外来人口排名',
      chart: createChartTemp({
        tooltip: {
          show: true,
          formatter:function(v){
            return `${v[0].name}:${v[0].value}${units[0]}`
          }
        },
        legend:{
          show:true,
        },
        yAxis: [ {
          axisLabel: {
            unit: units[0]
          }
        }]
      }, [], {
          series: {
            label: {
              show: false
            },
            barWidth: '20%'
          }
        })
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, BarChart ,BorderBg},
  computed: {
    ...mapState({
      init: state => state.populationStructure.init,
      countySource: state => state.populationSource.countySource
    })
  },
  watch: {
    countySource: function () {
      this.formatData(this.countySource);
    }
  },
  mounted() {
    if(this.init === true){
      this.formatData(this.countySource)
    }
  },
  methods: {
    formatData(data) {
      if (data && data.length > 0) {
        let dataList =convertArrayData(data,{
           nameValues:['外来人口占比'],
           valueKeys:['inflowRate'],
        },{
          label:'name'
        })
        this.chart.data = dataList.sort(function(a,b){return b.value1-a.value1});
        delete this.chart.config.color;
        this.chart.config.tooltip.show = true;
      } else {
        const dataList = Array(7).fill({
          name1: '',
          value1: 60,
        });
        this.chart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.chart.config.tooltip = {
          show: false
        }
        this.chart.data = dataList;
      }
    }
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./populationDistribution.less";
</style>
