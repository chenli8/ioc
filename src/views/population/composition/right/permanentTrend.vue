<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
       <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div :class="$style[`${clsPrefix}${clsName}-agePieCon`]">
        <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
          <PieChart :data="totalChart.data" :config="totalChart.config" :other="totalChart.other" :class="$style[`${clsPrefix}${clsName}-agePieChart`]"></PieChart>
          <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
            <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">总抚养比</span>
            <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{totalRatio}}%</span>
          </div>
        </div>
        <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
          <PieChart :data="ageChildrenChart.data" :config="ageChildrenChart.config" :other="ageChildrenChart.other" :class="$style[`${clsPrefix}${clsName}-agePieChart`]"></PieChart>
          <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
            <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">少儿抚养比</span>
            <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{childrenRatio}}%</span>
          </div>
        </div>
        <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
          <PieChart :data="ageOldChart.data" :config="ageOldChart.config" :other="ageOldChart.other" :class="$style[`${clsPrefix}${clsName}-agePieChart`]"></PieChart>
          <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
            <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">老年抚养比</span>
            <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{oldRatio}}%</span>
          </div>
        </div>
      </div>
      <BarChart :data="ageBarChart.data" :config="ageBarChart.config" :other="ageBarChart.other" :class="$style[`${clsPrefix}${clsName}-ageBar`]"></BarChart>
    </div>
    </BorderBg>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters,
  } from "vuex";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    createChartTemp,
    units,
    convertObjectData,
    toFixed
  } from "@/lib/util.js";
  import {
    BLUECOLORS,
    GREENCOLORS,
    REDCOLORS
  } from "@/business-component/chart/chart.config.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import BarChart from "@/business-component/chart/barChart.vue";
  import PieChart from "@/business-component/chart/pieChart.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: "permanentTrend",
        title: "人口构成分析",
        totalRatio: "",
        childrenRatio: "",
        oldRatio: "",
        sexRatio: 0,
        sexRatioLabel: "性别比",
        totalChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: BLUECOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ])
        }, [], {
          series: [{
            itemStyle: {
              borderWidth: 0
            },
            center: ["47%", "50%"],
            radius: ["70%", "90%"]
          }]
        }),
        ageChildrenChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: GREENCOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ])
        }, [], {
          series: [{
            itemStyle: {
              borderWidth: 0
            },
            center: ["47%", "50%"],
            radius: ["70%", "90%"]
          }]
        }),
        ageOldChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: REDCOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ])
        }, [], {
          series: [{
            itemStyle: {
              borderWidth: 0
            },
            center: ["47%", "50%"],
            radius: ["70%", "90%"]
          }]
        }),
        ageBarChart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          xAxis: [{
            axisLabel: {
              interval: 0
            }
          }],
          yAxis: [{
            axisLabel: {
              unit: units[0]
            }
          }]
        }, [], {
          series: {
            label: {
              unit: units[0]
            },
            barWidth: "30%"
          }
        }),
        num: null
      };
    },
    mixins: [clsMixin],
    computed: {
      ...mapState({
        init: state => state.populationStructure.init,
        countyName: state => state.cityInfo.countyName
      }),
    ...mapGetters([
      'countyStructureItem'
    ])
    },
    watch: {
    countyStructureItem: function () {
      this.fromatData(this.countyStructureItem);
    },
      countyName: function() {
        this.fromatData(this.countyStructureItem);
      },
    },
    components: {
      HeaderBar,
      BarChart,
      PieChart,
      BorderBg
    },
    mounted() {
      if (this.init === 'true' || Object.values(this.countyStructureItem).length > 0) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.fromatData(this.countyStructureItem);
      },
      fromatData(data = {}) {
        if (Object.values(data).length > 0) {
        this.childrenRatio = toFixed(data.childrenDependencyRatio || 0, 0);
        this.oldRatio = toFixed(data.oldDependencyRatio || 0, 0);
        this.totalRatio = toFixed(this.childrenRatio + this.oldRatio, 0);
        this.totalChart.data = [{
          name1: "总",
          value1: this.totalRatio,
          name2: "--",
          value2: 100 - this.totalRatio
        }];
        this.ageChildrenChart.data = [{
          name1: "儿童",
          value1: this.childrenRatio,
          name2: "--",
          value2: 100 - this.childrenRatio
        }];
        this.ageOldChart.data = [{
          name1: "老人",
          value1: this.oldRatio,
          name2: "--",
          value2: 100 - this.oldRatio
        }];
       this.totalChart.config.color = BLUECOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]);
        this.ageChildrenChart.config.color =  GREENCOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]);
        this.ageOldChart.config.color =  REDCOLORS.concat([
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ]);

        }else{
          this.totalChart.data = [{
          name1: "",
          value1: 10,
        }];
        this.ageChildrenChart.data = [{
          name1: "",
          value1: 10,
        }];
        this.ageOldChart.data = [{
          name1: "",
          value1: 10,
        }];
        this.totalChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.ageChildrenChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.ageOldChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
        ];
        }
        // set bar
        if (Object.values(data).length > 0) {
          const dataList = convertObjectData(data, [{
              label: "0-14岁",
              nameValues: ["0-14岁"],
              valueKeys: ["childrenRatio"]
            },
            {
              label: "15-64岁",
              nameValues: ["15-64岁"],
              valueKeys: ["labourRatio"]
            },
            {
              label: "65岁及以上",
              nameValues: ["65岁及以上"],
              valueKeys: ["oldRatio"]
            }
          ]);
          this.ageBarChart.data = dataList;
          this.ageBarChart.other.series.label.show = true;
          delete this.ageBarChart.config.color;
        } else {
          const dataList = Array(3).fill({
            name1: '',
            value1: 10,
            label: ''
          });
          this.ageBarChart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.ageBarChart.other.series.label.show = false;
          this.ageBarChart.data = dataList;
        }
      }
    }
  };
</script>

<style module lang='less'>
  @import "./permanentTrend.less";
</style>
