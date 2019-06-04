
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <GeoChart :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></GeoChart>
      </div>
  
  </div>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';
  import hexToRgba from '@/lib/hexToRgba.js';
  import {
    COLORS,
    FONTCOLOR2,
    BORDERCOLOR,
    SHADOWCOLOR
  } from '@/business-component/chart/chart.config.js';
  import {
    createChartTemp,
    units,
    toFixed,
    merge
  } from '@/lib/util.js';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import GeoChart from '@/business-component/chart/geoChart.vue';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      var arr = [];
      return {
        clsName: 'inflowMap',
        title: '人口来源地分析',
        chart: createChartTemp({
          legend: {
            show: false
          },
          visualMap: { //图例值控制
            type: 'continuous',
            min: 0,
            max: 50,
            realtime: false,
            precision: 2,
            calculable: true,
            textStyle: {
              color: FONTCOLOR2
            },
            formatter: '{value}' + units[0],
            color: ['#e81834', '#fb6a7f', '#f4ae72', '#46e695', '#44c9e7']
          },
          geo: {
            zoom: 1.2,
            label: {
              show: true,
              color: FONTCOLOR2
            },
            outline: true,
            itemStyle: {
              areaColor: '#003591',
              borderColor: '#2085f0',
              borderWidth: 1,
            },
            regions: [{
              name: 'China',
              itemStyle: {
                borderWidth: 2,
                borderColor: '#2085f0',
                areaColor: 'transparent',
                shadowColor: hexToRgba(SHADOWCOLOR, 0.25),
                shadowOffsetX: -15,
                shadowOffsetY: 4
              },
              label: {
                show: false
              },
              emphasis: {
                itemStyle: {
                  areaColor: 'transparent'
                }
              }
            }]
          }
        }),
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      GeoChart,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.populationSource.init,
        populationSource: state => state.populationSource.citySourceList
      })
    },
    watch: {
      populationSource: function() {
        this.formatData(this.populationSource);
      }
    },
    mounted() {
      if (this.init === true) {
        this.formatData(this.populationSource);
      }
    },
    methods: {
      formatData(data = []) {
        const _data = merge([], data);
  
        if (_data.length > 0) {
          let from;
          let to;
          let data = [];
          let firstData = {};
          let geoDataList = [];
          let nodeSize = [];
          let maxValue = 0;
          data = _data.sort((a, b) => {
            return (b.inflowPopulation || 0) - (a.inflowRate || 0);
          });
          firstData = data[0] || {};
          from = data.map((item, index) => {
            const value = toFixed(item.inflowRate || 0);
            maxValue = Math.max(maxValue, value);
            return {
              name: item.sourceName,
              value,
            }
          });
          to = {
            name: firstData.cityName || '',
            value: maxValue
          };
          this.chart.config.visualMap.max = maxValue;
  
          this.chart.other.series = [{
            effect: {
              color: '',
              symbolSize: [3, 10],
            },
            lineStyle: {
              width: 0.2,
            }
          }, {
            label: {
              show: false,
              unit: units[0]
            },
            showEffectOn: '',
            itemStyle: {},
            symbolSize: (data, params) => {
              return 8;
            },
          }];
          geoDataList = [{
            from,
            to
          }];
  
          this.chart.data = geoDataList;
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang='less'>
  @import "./inflowMap.less";
</style>
