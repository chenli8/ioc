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
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    createChartTemp,
    convertArrayData,
    units,
  } from '@/lib/util.js';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "occu-workLiveRatio",
        title: "职住比",
        chart: createChartTemp({
          grid: {
            right: '4%'
          },
        }, [], {
          series: {
            label: {
              show: false,
              unit: units[0]
            }
          }
        })
      }
    },
    watch: {
      countyPopulation: function() {
        this.formatData(this.countyPopulation);
      },
    },
    mixins: [clsMixin],
    computed: {
      ...mapState({
        countyPopulation: state => state.totalPopulation.countyPopulation,
      })
    },
    components: {
      HeaderBar,
      LineChart,
      BorderBg
    },
    mounted() {
      if (this.countyPopulation.length > 0) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.countyPopulation);
      },
      formatData(data = []) {
        if (data.length > 0) {
          let dataList = convertArrayData(data, {
            nameValues: ['职住比'],
            valueKeys: ['workLiveRatio']
          }, {
            label: 'countyName'
          });
          dataList.sort((a, b) => {
            return (a.value1 || 0) - (b.value1 || 0);
          });
          this.chart.data = dataList;
        } else {
          let dataList = Array(7).fill({
            label: '',
            value1: 0,
            name1: '职住比'
          });
          this.chart.data = dataList;
        }
      }
    }
  };
</script>

<style module lang='less'>
  @import "./workLiveRatio.less";
</style>