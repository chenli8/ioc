<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-average`]">
          <div :class="$style[`${clsPrefix}${clsName}-subTitle`]">全市平均通勤距离<b :class="$style[`${clsPrefix}${clsName}-number`]">{{cityCommuting.distance}}</b>公里</div>
          <BarChart :config='barChart.config' :data='barChart.data' :other='barChart.other' :class="$style[`${clsPrefix}${clsName}-barChart`]"></BarChart>
        </div>
        <div :class="$style[`${clsPrefix}${clsName}-popularAverage`]">
          <div :class="$style[`${clsPrefix}${clsName}-subTitle`]">平均通勤距离在10公里以上的人口占比</div>
          <div :class="$style[`${clsPrefix}${clsName}-pieCon`]">
            <PieAverage v-for="(item,index) in dataList" :key='index' :chartData='item' :class="$style[`${clsPrefix}${clsName}-pieChart`]"></PieAverage>
          </div>
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
    convertArrayData,
    createChartTemp,
    merge
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import BarChart from "@/business-component/chart/barChart.vue";
  import PieAverage from "@/business-component/pieAverage/index.vue";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    BLUECOLORS,
    GREENCOLORS,
    REDCOLORS
  } from "@/business-component/chart/chart.config.js";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "cityTotal",
        title: "各区县平均通勤距离排名",
        dataList: [],
        barChart: createChartTemp({
          grid: {
            right: "5%"
          },
          tooltip: {
            formatter: function(v) {
              return `${v[0].name}:${v[0].value}公里`;
            }
          },
          xAxis: [{
            axisLabel: {
              rotate: 50
            }
          }]
        }, [], {
          series: [{
            label: {
              show: false
            },
            markLine: {
              symbol: "none",
              lineStyle: {
                normal: {
                  type: "solid"
                }
              },
              label: {
                show: false
              },
              data: [{
                type: "average",
                valueIndex: 1,
                lineStyle: {
                  type: "dotted",
                  color: '#F67F74'
                }
              }]
            }
          }]
        }),
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      BarChart,
      PieAverage,
      BorderBg
    },
    computed: {
      ...mapState({
        isInit: state => state.commuting.init,
        countyCommuting: state => state.commuting.countyCommuting,
        cityCommuting: state => state.commuting.cityCommuting
      })
    },
    watch: {
      countyCommuting: function() {
        this.formateData(this.countyCommuting);
        this.formatePieData(this.countyCommuting)
      }
    },
    mounted() {
  
      if (this.isInit === true || this.countyCommuting.length > 0) {
        this.init();
      }
    },
    methods: {
      init() {
        this.formateData(this.countyCommuting);
        this.formatePieData(this.countyCommuting)
      },
      formatePieData(data = []) {
        if (data && data.length > 0) {
          const dataList = merge([], data);
          dataList.map((item, index) => {
            item.name1 = '占比';
            item.value1 = item.dRate + item.eRate;
            item.label = item.name;
            item.name2 = '';
            item.value2 = 100 - item.value1;
          });
          this.dataList = (dataList.sort(function(a, b) {
            return b.value1 - a.value1
          })).slice(0, 3);
          this.dataList.map((item, index) => {
            item.top = index + 1;
            if (index === 0) {
              item.chartConfig = {
                color: BLUECOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              }
            } else if (index === 1) {
              item.chartConfig = {
                color: GREENCOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              }
            } else if (index === 2) {
              item.chartConfig = {
                color: REDCOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              }
            }
          })
        }
      },
      formateData(data) {
        if (data && data.length > 0) {
          const dataList = convertArrayData(
            data, {
              nameValues: ["平均通勤距离"],
              valueKeys: ["averageDistance"]
            }, {
              label: "name"
            }
          );
          delete this.barChart.config.color;
          this.barChart.data = dataList;
        } else {
          const dataList = Array(10).fill({
            name1: "",
            value1: 10
          });
          this.barChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.1),
            hexToRgba(BLUECOLORS[1], 0.1)
          ];
          this.barChart.data = dataList;
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./cityTotal.less";
</style>
