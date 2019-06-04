<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
<HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div :class="$style[`${clsPrefix}${clsName}-label`]">
        <Growth :class="$style[`${clsPrefix}${clsName}-item`]" v-for="(item,index) in topList" :key="index" :number="item.number" :unit="item.unit" :dis="item.dis" :title="item.countyName" :chartData='item.chartData' :chartConfig='item.chartConfig'></Growth>
      </div>
    </div>
    </BorderBg>
    
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import {
    GREENCOLORS,
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import {
    createChartTemp,
    formatThousands,
    convertArrayData,
    toFixed
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import Growth from "@/business-component/growth/index.vue";
  import hexToRgba from "@/lib/hexToRgba.js";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: "countyRanking",
        title: "各区县人口总量及增速排名",
        residentChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          grid: {
            right: "20%"
          }
        }, [], {
          series: [{
            label: {
              unit: ""
            }
          }],
          minus: true
        }),
        chainChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: GREENCOLORS,
          grid: {
            right: "20%"
          }
        }, [], {
          minus: true
        }),
        topList: []
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      HorizontalBar,
      Growth,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.totalPopulation.init,
        countyPopulation: state => state.totalPopulation.countyPopulation
      })
    },
    watch: {
      countyPopulation: function() {
        this.formatData(this.countyPopulation);
      }
    },
    mounted() {
      if (this.init === true) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.countyPopulation);
      },
      formatData(data = []) {
        if (data && data.length > 0) {
          //常住人口
          let residentData = [];
          //环比
          let chainData = [];
          data.forEach(item => {
            const name = item.countyName;
            residentData.push({
              label: name,
              name,
              value: formatThousands(item.residentPopulation || 0)
            });
            chainData.push({
              label: name,
              name,
              value: item.chainRatio || 0
            });
          });
          residentData.sort((a, b) => {
            return (a.value || 0) - (b.value || 0);
          });
          chainData.sort((a, b) => {
            return (a.value || 0) - (b.value || 0);
          });
          const residentDataList = convertArrayData(residentData, {
            nameKeys: ["name"],
            valueKeys: ["value"]
          });
          const chainDataList = convertArrayData(chainData, {
            nameKeys: ["name"],
            valueKeys: ["value"]
          });
          //set top
          const topResident = residentDataList[residentDataList.length - 1];
          const topChain = chainDataList[chainDataList.length - 1];
          const pre = "TOP1";
          this.topList = [{
              countyName: pre + topResident.label,
              number: toFixed(topResident.value1, 1),
              unit: "万人",
              dis: "常住人口",
              chartData: residentDataList,
              chartConfig: {
                other: {
                  series: [
                    {
                      label: {
                        unit: ""
                      },
                    }
                  ]
                },
                grid: {
                  right: "20%"
                }
              }
            },
            {
              countyName: pre + topChain.label,
              number: toFixed(topChain.value1, 1),
              unit: "%",
              dis: "环比",
              chartData: chainDataList,
              chartConfig: {
                color: GREENCOLORS,
                grid: {
                  right: "20%"
                }
              }
            }
          ];
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./countyRanking.less";
</style>