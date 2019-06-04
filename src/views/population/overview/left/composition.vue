<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
  <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <TabLine
        :data="tabLine.data"
        :value="tabLine.value"
        @change-tab="changeTab"
        :class="$style[`${clsPrefix}${clsName}-toolbar`]"
      ></TabLine>
      <div
        v-show="tabLine.value===tabLine.data[0].name"
        :class="$style[`${clsPrefix}${clsName}-tabCon`]"
      >
        <div :class="$style[`${clsPrefix}${clsName}-agePieCon`]">
          <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
            <PieChart
              :data="totalChart.data"
              :config="totalChart.config"
              :other="totalChart.other"
              :class="$style[`${clsPrefix}${clsName}-agePieChart`]"
            ></PieChart>
            <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
              <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">总抚养比</span>
              <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{totalRatio}}%</span>
            </div>
          </div>
          <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
            <PieChart
              :data="ageChildrenChart.data"
              :config="ageChildrenChart.config"
              :other="ageChildrenChart.other"
              :class="$style[`${clsPrefix}${clsName}-agePieChart`]"
            ></PieChart>
            <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
              <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">少儿抚养比</span>
              <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{childrenRatio}}%</span>
            </div>
          </div>
          <div :class="$style[`${clsPrefix}${clsName}-agePieItem`]">
            <PieChart
              :data="ageOldChart.data"
              :config="ageOldChart.config"
              :other="ageOldChart.other"
              :class="$style[`${clsPrefix}${clsName}-agePieChart`]"
            ></PieChart>
            <div :class="$style[`${clsPrefix}${clsName}-ageDesCon`]">
              <span :class="$style[`${clsPrefix}${clsName}-ageDes`]">老年抚养比</span>
              <span :class="$style[`${clsPrefix}${clsName}-ageNum`]">{{oldRatio}}%</span>
            </div>
          </div>
        </div>
        <BarChart
          :data="ageBarChart.data"
          :config="ageBarChart.config"
          :other="ageBarChart.other"
          :class="$style[`${clsPrefix}${clsName}-ageBar`]"
        ></BarChart>
      </div>
      <div
        v-show="tabLine.value===tabLine.data[1].name"
        :class="$style[`${clsPrefix}${clsName}-tabCon`]"
      >
        <div :class="$style[`${clsPrefix}${clsName}-sexCon`]">
          <InfoBlock
            :class="$style[`${clsPrefix}${clsName}-sexDes`]"
            :number="sexRatio"
            :dis="sexRatioLabel"
          ></InfoBlock>
        </div>
        <PieChart
          :data="sexChart.data"
          :config="sexChart.config"
          :other="sexChart.other"
          :class="$style[`${clsPrefix}${clsName}-sexChart`]"
          ref="sex"
        ></PieChart>
      </div>
    </div>
    </BorderBg>
   
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters
} from "vuex";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import hexToRgba from "@/lib/hexToRgba.js";
import {
  createChartTemp,
  units,
  convertArrayData,
  convertObjectData,
  toFixed
} from "@/lib/util.js";
import {
  BLUECOLORS,
  GREENCOLORS,
  REDCOLORS
} from "@/business-component/chart/chart.config.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import TabLine from "@/business-component/tabLine/index.vue";
import InfoBlock from "@/business-component/infoBlock/index.vue";
import BarChart from "@/business-component/chart/barChart.vue";
import PieChart from "@/business-component/chart/pieChart.vue";
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: "composition",
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
      sexChart: createChartTemp({
        tooltip: {
          show: false
        },
        legend: {
          show: false
        }
      }, [], {
          series: [{
            radius: ["32%", "43%"],
            label: {
              show: true,
              unit: units[0]
            }
          }]
        }),
      tabLine: {
        data: [{
          name: "年龄"
        },
        {
          name: "性别"
        }
        ],
        value: "年龄"
      },
      num: null
    };
  },
  mixins: [clsMixin],
  computed: {
    ...mapState({
      init: state => state.populationOverview.init,
      countyName: state => state.cityInfo.countyName
    }),
    ...mapGetters([
      'countyStructureItem'
      ])
  },
  watch: {
    countyStructureItem: function () {
      this.fromatAgeData(this.countyStructureItem);
      this.fromatSexData(this.countyStructureItem);
    }
  },
  components: {
    HeaderBar,
    TabLine,
    InfoBlock,
    BarChart,
    PieChart,
    BorderBg
  },
  mounted() {
    if (this.init === true||(Object.keys(this.countyStructureItem)).length>0) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.fromatAgeData(this.countyStructureItem);
      this.fromatSexData(this.countyStructureItem);
    },
    changeTab(data) {
      this.tabLine.value = data.name;
      //判断显示年龄、性别
      if (this.tabLine.data[0].name === data.name) { } else {
        this.$nextTick(() => {
          const chart = this.$refs.sex.$refs.pie;
          if (chart) {
            const {
              echartObj
            } = chart.getChart();
            if (echartObj) {
              echartObj.resize();
            }
          }
        });
      }
    },
    fromatAgeData(data = {}) {
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
    },
    fromatSexData(data = {}) {
      if (Object.values(data).length > 0) {
        const dataList = convertObjectData(data, [{
          nameValues: ["男性", "女性"],
          valueKeys: ["maleRate", "femaleRate"]
        }]);
        this.sexRatio = toFixed(
          ((data.maleRate || 0) / (data.femaleRate || 0) || 0) * 100,
          2
        );
        this.sexChart.data = dataList;
        delete this.sexChart.config.color;
      } else {
        const dataList = Array(1).fill({
          name1: "",
          value1: 10,
          label: ""
        });
        this.sexChart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.sexChart.data = dataList;
      }
    }
  }
};
</script>

<style module lang='less'>
@import "./composition.less";
</style>
