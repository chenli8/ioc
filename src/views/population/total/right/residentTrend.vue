<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
     <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <LineChart
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></LineChart>
    </div>
    </BorderBg>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import { createChartTemp, formatThousands,units } from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import LineChart from '@/business-component/chart/lineChart.vue';
import {
  BLUECOLORS
} from '@/business-component/chart/chart.config.js';
import hexToRgba from "@/lib/hexToRgba.js";
import BorderBg from '@/business-component/borderBg/index.vue';

export default {
  data() {
    return {
      clsName: 'residentTrend',
      title: '最近12个月工作与居住人口趋势',
      chart: createChartTemp({
        yAxis: [{
          name: '(万人)'
        }]
      }, [], {
          series: {
            label: {
              show: false,
              unit: units[1]
            }
          }
        })
    }
  },
  mixins: [clsMixin],
  components: { LineChart, HeaderBar,BorderBg },
  computed: {
    ...mapState({
      countyTrend: state => state.totalPopulation.countyTrend,
      countyName: state => state.cityInfo.countyName
    })
  },
  watch: {
    'countyTrend': function () {
      this.formatData(this.countyTrend);
    }
  },
  mounted() {
  },
  methods: {
    formatData(data) {
      if (data&&data.length>0 && this.countyName) {
        let dataList = data.map((item) => {
          return {
            label: item.dateTime,
            name1: '工作人口',
            value1: formatThousands(item.workPopulation || 0),
            name2: '居住人口',
            value2: formatThousands(item.livePopulation || 0),
          }
        });
        this.chart.data = dataList.reverse();
        delete this.chart.config.color ;
        delete this.chart.config.tooltip ;
      }else{
         const dataList = Array(12).fill({
            name1: '',
            name2: '',
            value1: 50,
            value2: 50,
          });
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.chart.config.tooltip = {
            show:false
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
@import "./residentTrend.less";
</style>
