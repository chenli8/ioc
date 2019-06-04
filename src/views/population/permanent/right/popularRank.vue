
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :index="2"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <LineBar :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></LineBar>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  import {
    createChartTemp,
    convertArrayData,
    interceptCityName
  } from '@/lib/util.js';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import LineBar from '@/business-component/chart/lineBar.vue';
  import {
    getIcon,
    REDCOLORS,
    BLUECOLORS,
    GREENCOLORS
  } from '@/business-component/chart/chart.config.js';
  import hexToRgba from "@/lib/hexToRgba.js";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: 'popularRank',
        title: '省内各市常住流动人口指数排名',
        chart: createChartTemp({
          tooltip: {
            show: true
          },
          color: [].concat(BLUECOLORS).concat(GREENCOLORS).concat(REDCOLORS),
          xAxis: [{
            axisLabel: {
              rotate: 50,
              interval: 0
            }
          }],
          yAxis: [{}, {
            axisLabel: {
              show: true
            }
          }]
        }, [], {
          series: {
            label: {
              show: false
            },
            barWidth: '70%',
            barGap: '10%'
          }
        })
      }
    },
    mixins: [clsMixin],
    components: {
      LineBar,
      HeaderBar,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.residentFlow.init,
        cityResidentFlowIndex: state => state.residentFlow.cityResidentFlowIndex
      })
    },
    watch: {
      cityResidentFlowIndex: function() {
        this.formatData(this.cityResidentFlowIndex);
      }
    },
    mounted() {
      if (this.init === true) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.cityResidentFlowIndex);
      },
      formatData(data = []) {
        let dataList = [];
        if (data.length > 0) {
          dataList = convertArrayData(data, {
            nameValues: ['流入人口指数', '流出人口指数', '净流入人口指数'],
            valueKeys: ['inflowPopulationIndex', 'outflowPopulationIndex', 'netInflowPopulationIndex']
          }, {
            label: 'name'
          })
          dataList.forEach((item) => {
            item.label = interceptCityName(item.label || '')
          });
  
          delete this.chart.config.color;
          this.chart.config.tooltip.show = true;
        } else {
          dataList = Array(17).fill({
            name1: '',
            name2: '',
            name3: '',
            value1: 12,
            value2: 12,
            value3: 12,
          });
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.chart.config.tooltip = {
            show: false
          }
        }
        this.chart.data = dataList;
      }
    }
  }
</script>

<style module lang="less">
  @import "./popularRank.less";
</style>