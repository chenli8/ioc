
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
  } from "vuex";
  import hexToRgba from '@/lib/hexToRgba.js';
  import {
    LIGHTGREENCOLOR,
    YELLOWCOLORS,
    FONTCOLOR2,
    SHADOWCOLOR
  } from "@/business-component/chart/chart.config.js";
  import {
    createChartTemp,
    formatThousands,
    units,
    toFixed,
    merge
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import GeoChart from "@/business-component/chart/geoChart.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      var arr = [];
      return {
        clsName: 'inflowMap',
        title: '劳动力人口流动分析',
        chart: createChartTemp({
          legend: {
            show: false
          },
          geo: {
            zoom: 1.2,
            // aspectScale: 0.85,
            label: {
              show: true,
              color: hexToRgba(FONTCOLOR2, 0.75)
            },
            outline: true,
            itemStyle: {
              borderColor: '#1b70a3',
              borderWidth: 1,
            },
            regions: [{
              name: 'China',
              itemStyle: {
                borderWidth: 2,
                borderColor: FONTCOLOR2,
                areaColor: 'transparent',
                // shadowBlur:4,
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
        init: state => state.workerFlow.init,
        cityWorkerFlowType: state => state.workerFlow.cityWorkerFlowType,
        cityWorkerFlowList: state => state.workerFlow.cityWorkerFlowList
      })
    },
    watch: {
      cityWorkerFlowList: function() {
        this.formatData(this.cityWorkerFlowType);
      },
      cityWorkerFlowType: function() {
        this.formatData(this.cityWorkerFlowType);
      }
    },
    mounted() {
      if (this.init === true) {
        this.formatData(this.cityWorkerFlowType);
      }
    },
    methods: {
      formatData(type) {
        const _data = merge([], this.cityWorkerFlowList);
        if (_data.length > 0) {
          let from;
          let to;
          let scatterData = [];
          let data = [];
          let firstData = {};
          let geoDataList = [];
          let nodeSize = [];
          let maxValue = 0;
          switch (type) {
            case 0:
              data = _data.sort((a, b) => {
                return (b.inflow || 0) - (a.inflow || 0);
              }).slice(0, 50);
              firstData = data[0] || {};
              from = data.map((item, index) => {
                const value = toFixed(item.inflowRatio || 0);
                maxValue = Math.max(maxValue, value);
                return {
                  name: item.sourceName,
                  value,
                }
              });
              to = {
                name: firstData.cityName || '',
                value: 99999,
                series: {
                  label: {
                    show: true
                  }
                }
              };
              //拆分飞线、散点
              //取第30(不含)条以后的数据作为散点数据
              scatterData = from.slice(0, 30);
              //飞线取top30
              from = from.slice(0, 30);
  
              this.chart.other.series = [{
                effect: {
                  color: hexToRgba(YELLOWCOLORS[0], 0.35),
                  symbolSize: [3, 10],
                },
                lineStyle: {
                  width: 0.5,
                  color: hexToRgba(YELLOWCOLORS[0], 0.15)
                }
              }, {
                label: {
                  show: false,
                  unit: units[0]
                },
                showEffectOn: '',
                itemStyle: {
                  color: hexToRgba(YELLOWCOLORS[0], 0.8)
                },
                symbolSize: (data, params) => {
                  let value = Math.abs((params.value[2] || 0));
                  // const size = toFixed(Math.abs((params.value[2] || 0)) / maxValue * 18, 0);
                  return value === 99999 ? 16 : 8;
                },
              }];
              geoDataList = [{
                from,
                to,
                scatterData
              }];
              break;
            case 1:
              data = _data.sort((a, b) => {
                return (b.outflow || 0) - (a.outflow || 0);
              }).slice(0, 50);
              firstData = data[0] || {};
              to = data.map((item, index) => {
                const value = toFixed(item.outflowRatio || 0);
                maxValue = Math.max(maxValue, value);
                return {
                  name: item.sourceName,
                  value,
                };
              });
              from = {
                name: firstData.cityName || '',
                value: 99999,
                series: {
                  label: {
                    show: true
                  }
                }
              };
              //拆分飞线、散点
              //取第10(不含)条以后的数据作为散点数据
              scatterData = to.slice(0, 30);
              //飞线取top10
              to = to.slice(0, 30);
  
              this.chart.other.series = [{
                effect: {
                  color: hexToRgba(LIGHTGREENCOLOR, 0.35),
                  symbolSize: [3, 10],
                },
                lineStyle: {
                  width: 0.5,
                  color: hexToRgba(LIGHTGREENCOLOR, 0.15)
                }
              }, {
                label: {
                  show: false,
                  unit: units[0]
                },
                showEffectOn: '',
                itemStyle: {
                  color: hexToRgba(LIGHTGREENCOLOR, 0.8)
                },
                symbolSize: (data, params) => {
  
                  let value = Math.abs((params.value[2] || 0));
                  // const size = toFixed(Math.abs((params.value[2] || 0)) / maxValue * 18, 0);
                  return value === 99999 ? 16 : 8;
                },
              }];
              geoDataList = [{
                from,
                to,
                scatterData
              }];
              break;
            default:
              data = _data.sort((a, b) => {
                return (b.netInflow || 0) - (a.netInflow || 0);
              });
              //取前15作为流入,取后15作为流出
              const topData = data.slice(0, 15);
              const bottomData = data.slice((data.length - 15), data.length);
              const topFirstData = topData[0] || {};
              let topMaxValue = 0;
              let bottomMaxValue = 0;
              const topFrom = topData.map((item, index) => {
                const value = toFixed(item.netInflowRatio || 0);
                topMaxValue = Math.max(topMaxValue, value);
                return {
                  name: item.sourceName,
                  value,
                }
              });
  
              const topTo = {
                name: topFirstData.cityName || '',
                value: 99999,
                series: {
                  label: {
                    show: true
                  }
                }
              };
              //bottom data
              const bottomFirstData = bottomData[0] || {};
              const bottomTo = bottomData.map((item, index) => {
                const value = toFixed(item.netInflowRatio || 0);
                bottomMaxValue = Math.max(bottomMaxValue, value);
                return {
                  name: item.sourceName,
                  value,
                };
              });
              const bottomFrom = {
                name: bottomFirstData.cityName || '',
                value: 99999,
                series: {
                  label: {
                    show: true
                  }
                }
              };
              //set color
              this.chart.other.series = [{
                effect: {
                  color: hexToRgba(YELLOWCOLORS[0], 0.35),
                  symbolSize: [3, 10],
                },
                lineStyle: {
                  width: 0.5,
                  color: hexToRgba(YELLOWCOLORS[0], 0.15)
                }
              }, {
                itemStyle: {
                  color: hexToRgba(YELLOWCOLORS[0], 0.8)
                },
                label: {
                  show: false,
                  unit: units[0]
                },
                showEffectOn: '',
                symbolSize: (data, params) => {
                  let value = Math.abs((params.value[2] || 0));
                  // const size = toFixed(Math.abs((params.value[2] || 0)) / maxValue * 18, 0);
                  return value === 99999 ? 16 : 8;
                }
              }, {
                effect: {
                  color: hexToRgba(LIGHTGREENCOLOR, 0.35),
                  symbolSize: [3, 10],
                },
                lineStyle: {
                  width: 0.5,
                  color: hexToRgba(LIGHTGREENCOLOR, 0.15)
                }
              }, {
                itemStyle: {
                  color: hexToRgba(LIGHTGREENCOLOR, 0.8)
                },
                label: {
                  show: false,
                  unit: units[0]
                },
                showEffectOn: '',
                symbolSize: (data, params) => {
                  let value = Math.abs((params.value[2] || 0));
                  // const size = toFixed(Math.abs((params.value[2] || 0)) / maxValue * 18, 0);
                  return value === 99999 ? 16 : 8;
                },
              }];
              geoDataList = [{
                from: topFrom,
                to: topTo
              }, {
                from: bottomFrom,
                to: bottomTo
              }];
              break;
          }
          this.chart.data = geoDataList;
        }
      }
    },
    beforeDestroy() {},
  };
</script>

<style module lang="less">
  @import "./inflowMap.less";
</style>
