<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-subTitle`]">
          <span>该区职住比</span>
          <span :class="$style[`${clsPrefix}${clsName}-ratioNum`]">{{workLiveRatio}}</span>
          <span>排名</span>
          <span :class="$style[`${clsPrefix}${clsName}-rankingTotal`]">
            <span :class="$style[`${clsPrefix}${clsName}-rankingNum`]">{{workLiveRatioSort}}/</span> {{childrenNum}}
          </span>
        </div>
        <BarChart :config="barchart.config" :data="barchart.data" :other="barchart.other" :class="$style[`${clsPrefix}${clsName}-barChartCon`]"></BarChart>
        <div :class="$style[`${clsPrefix}${clsName}-totalNum`]">
          <div :class="$style[`${clsPrefix}${clsName}-totaltip`]" v-for="(item,index) in totalList" :key="index">
            <div>{{item.name}}</div>
            <span>
              <b :class="$style[`${clsPrefix}${clsName}-popularTotal`]">{{item.totalNum}}</b>
              {{item.unit}}
            </span>
            <span :class="$style[`${clsPrefix}${clsName}-rank`]">
              排名
              <b
                :class="$style[`${clsPrefix}${clsName}-popularrankNum`]"
              >{{item.ranking}}/{{childrenNum}}</b>
            </span>
          </div>
        </div>
        <div :class="$style[`${clsPrefix}${clsName}-pieChartCon`]">
          <div :class="$style[`${clsPrefix}${clsName}-place`]">
            <div>工作人口的居住地</div>
            <div :class="$style[`${clsPrefix}${clsName}-cityName`]">TOP1{{liveTopName}}</div>
            <PieChart :config="pieLiveChart.config" :data="pieLiveChart.data" :other="pieLiveChart.other" :class="$style[`${clsPrefix}${clsName}-piechart`]"></PieChart>
          </div>
          <div :class="$style[`${clsPrefix}${clsName}-place`]">
            <div>居住人口的工作地</div>
            <div :class="$style[`${clsPrefix}${clsName}-cityName`]">TOP1{{workTopName}}</div>
            <PieChart :config="pieWorkChart.config" :data="pieWorkChart.data" :other="pieWorkChart.other" :class="$style[`${clsPrefix}${clsName}-piechart`]"></PieChart>
          </div>
        </div>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from "vuex";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    createChartTemp,
    convertObjectData,
    units,
    toFixed,
    formatThousands
  } from "@/lib/util.js";
  import {
    BLUECOLORS,
    REDCOLORS,
    FONTCOLOR
  } from "@/business-component/chart/chart.config.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import BarChart from "@/business-component/chart/barChart.vue";
  import PieChart from "@/business-component/chart/pieChart.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: "occu-demographic",
        title: "跨区职住概况",
        totalList: [],
        workTopName: "",
        liveTopName: "",
        transparent: true,
        workLiveRatio: 0,
        workLiveRatioSort: 0,
        pieWorkChart: createChartTemp({
          color: [REDCOLORS[1], REDCOLORS[0]].concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]),
          tooltip: {
            show: false
          },
          legend: {
            show: false
          }
        }, [], {
          series: [{
            itemStyle: {
              borderWidth: 0
            },
            label: {
              show: true,
              position: 'center',
              formatter: (par) => {
                return par.name === '占比' ? `${par.value}%` : '';
              },
              textStyle: {
                color: FONTCOLOR
              }
            },
            radius: ["65%", "85%"],
          }]
        }),
        pieLiveChart: createChartTemp({
          color: [BLUECOLORS[1], BLUECOLORS[0]].concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]),
          tooltip: {
            show: false
          },
          legend: {
            show: false
          }
        }, [], {
          series: [{
            itemStyle: {
              borderWidth: 0
            },
            label: {
              show: true,
              position: 'center',
              formatter: (par) => {
                return par.name === '占比' ? `${par.value}%` : '';
              },
              textStyle: {
                color: FONTCOLOR
              }
            },
            radius: ["65%", "85%"],
          }]
        }),
        barchart: createChartTemp({
          color: BLUECOLORS.concat(BLUECOLORS).concat(BLUECOLORS),
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          grid: {
  
          },
          xAxis: [{
            label: {
              show: true,
            },
            axisLabel: {
              interval: 0
            },
          }],
          yAxis: [{
            name: `(${units[1]})`,
            nameTextStyle: {
              padding: [0, 0, 0, -10]
            }
          }]
        }, [], {
          series: {
            barWidth: "20%",
            barGap: "200%"
          }
        })
      };
    },
    computed: {
      ...mapState({
        childrenNum: state => state.cityInfo.childrenNum,
        countyName: state => state.cityInfo.countyName,
        countyFlowWorkLive: state => state.workLive.countyFlowWorkLive,
        countyPopulation: state => state.totalPopulation.countyPopulation,
        countyWork: state => state.workLive.countyWork,
        countyLive: state => state.workLive.countyLive
      }),
      ...mapGetters(["countyPopulationSorted"])
    },
    watch: {
      countyFlowWorkLive: function() {
        this.formatTotalData(this.countyFlowWorkLive);
      },
      countyPopulationSorted: function() {
        this.formatBarChartData(this.countyPopulationSorted);
      },
      countyWork: function() {
        this.formatWorkData(this.countyWork);
      },
      countyLive: function() {
        this.formatLiveData(this.countyLive);
      },
      countyName() {
        this.formatBarChartData(this.countyPopulationSorted);
        this.formatTotalData(this.countyFlowWorkLive);
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.formatBarChartData(this.countyPopulation);
        this.formatTotalData(this.countyFlowWorkLive);
        this.formatWorkData(this.countyWork);
        this.formatLiveData(this.countyLive);
      },
      formatBarChartData(data = []) {
        if (!this.countyName) {
          return;
        }
        if (data.length > 0) {
          const currentData = data.find(item => {
            return item.countyName === this.countyName;
          });
          if (!currentData) return;
          const dataList = [{
              label: "常住人口",
              name1: '常住人口',
              value1: formatThousands(currentData.residentPopulation),
            },
            {
              label: "工作人口",
              name1: '工作人口',
              value1: formatThousands(currentData.workPopulation),
            },
            {
              label: "居住人口",
              name1: '居住人口',
              value1: formatThousands(currentData.livePopulation),
            }
          ];
          this.workLiveRatio = currentData.workLiveRatio;
          this.workLiveRatioSort = currentData.workLiveRatioSort;
          this.barchart.config.color = BLUECOLORS.concat(BLUECOLORS).concat(
            BLUECOLORS
          );
          this.barchart.data = dataList;
        } else {
          const dataList = Array(3).fill({
            name1: "",
            value1: 10
          });
          this.barchart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.barchart.data = dataList;
        }
      },
      formatTotalData(data = []) {
        if (!this.countyName) {
          return;
        }
        if (data.length > 0) {
          const currentObj = data.find(item => {
            return item.countyName === this.countyName;
          });
          if (!currentObj) {
            return;
          }
          const totalList = [{
              name: "工作人口流入总量",
              totalNum: currentObj.workInflowPopulation,
              unit: units[2],
              ranking: currentObj.workInflowSort
            },
            {
              name: "居住人口流入总量",
              totalNum: currentObj.liveInflowPopulation,
              unit: units[2],
              ranking: currentObj.liveInflowSort
            }
          ];
          this.totalList = totalList;
        }
      },
      formatWorkData(data = []) {
        if (data.length > 0) {
          const firstData = data[0];
          const workTop = convertObjectData(firstData, {
            nameValues: ["占比", "剩余占比"],
            valueKeys: ["rate"]
          });
          workTop.value2 = toFixed(100 - firstData.rate, 2);
          this.workTopName = firstData.workCountyName;
          this.pieWorkChart.config.color = REDCOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]);
          this.pieWorkChart.data = [workTop];
        } else {
          const dataList = Array(1).fill({
            name1: "",
            value1: 10,
            label: ""
          });
          this.pieWorkChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.pieWorkChart.data = dataList;
        }
      },
      formatLiveData(data) {
  
        if (data.length > 0) {
          const firstData = data[0];
          const liveTop = convertObjectData(firstData, {
            nameValues: ["占比", "剩余占比"],
            valueKeys: ["rate"]
          });
          liveTop.value2 = toFixed(100 - firstData.rate, 2);
          this.liveTopName = firstData.liveCountyName;
          this.pieLiveChart.config.color = BLUECOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]);
          this.pieLiveChart.data = [liveTop];
        } else {
          const dataList = Array(1).fill({
            name1: "",
            value1: 10,
            label: ""
          });
          this.pieLiveChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.pieLiveChart.data = dataList;
        }
      }
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      BarChart,
      PieChart,
      BorderBg
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./demographic.less";
</style>
