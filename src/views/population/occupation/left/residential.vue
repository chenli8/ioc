<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <LineChart :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></LineChart>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState,
    mapGetters,
    mapActions
  } from 'vuex';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import LineChart from '@/business-component/chart/lineChart.vue';
  import {
    COLORS,
    REDCOLORS,
    BLUECOLORS
  } from '@/business-component/chart/chart.config.js';
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    createChartTemp,
    units
  } from '@/lib/util.js';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: 'residential',
        title: '各区县跨区职住人口总量对比',
        chart: createChartTemp({
          grid: {
            right: '4%'
          },
          yAxis: [{
            name: `(${units[2]})`,
            nameTextStyle: {
              padding: [0, 0, 0, -50]
            }
          }],
        }, [], {
          series: {
            label: {
              show: false,
              unit: units[2]
            }
          }
        })
      }
    },
    mixins: [clsMixin],
    computed: {},
    components: {
      HeaderBar,
      LineChart,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.workLive.init,
        countyFlowWorkLive: state => state.workLive.countyFlowWorkLive,
      })
    },
    watch: {
      countyFlowWorkLive: function() {
        this.formatData(this.countyFlowWorkLive);
      },
    },
    methods: {
      initData() {
        if (this.init === true) {
          this.formatData(this.countyFlowWorkLive);
        }
      },
      formatData(data = []) {
        if (data.length > 0) {
          const dataList = data.map((item) => {
            return {
              label: item.countyName,
              name1: '工作人口流入总量',
              value1: item.workInflowPopulation,
              name2: '居住人口流入总量',
              value2: item.liveInflowPopulation
            }
          });
          this.chart.data = dataList.reverse();
        } else {
          const dataList = Array(10).fill({
            label: '',
            name1: '工作人口流入量',
            value1: 1.0,
            name2: '居住人口流入量',
            value2: 1.0
          });
          this.chart.data = dataList.reverse();
        }
      }
    },
  
  
    mounted() {
      this.initData();
  
    },
  };
</script>

<style module lang='less'>
  @import "./residential.less";
</style>
