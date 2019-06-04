<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
        <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <PieChart
        :data="sourceChart.data"
        :config="sourceChart.config"
        :other="sourceChart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></PieChart>
      <div :class="$style[`${clsPrefix}${clsName}-right-con`]">
        <div :class="$style[`${clsPrefix}${clsName}-label`]">外来人口来源城市TOP10</div>
        <BarChart
          :data="barChart.data"
          :config="barChart.config"
          :other="barChart.other"
          :class="$style[`${clsPrefix}${clsName}-barChart`]"
        ></BarChart>
        <Timeline
          :class="$style[`${clsPrefix}${clsName}-timeline`]"
          :data="timeline.data"
          :value="timeline.value"
          @changeTime="changeTime"
        ></Timeline>
      </div>
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
import hexToRgba from '@/lib/hexToRgba.js';
import {
  BLUECOLORS
} from '@/business-component/chart/chart.config.js';
import {
  merge,
  createChartTemp,
  toFixed,
  convertArrayData,
  convertObjectData,
  units,
  dateTransition,
  interceptCityName
} from '@/lib/util.js';
import Timeline from '@/business-component/timeline/index.vue';
import HeaderBar from '@/business-component/headerBar/index.vue';
import PieChart from '@/business-component/chart/pieChart.vue';
import BarChart from '@/business-component/chart/barChart.vue';
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: 'citySource',
      title: '全市人口来源地分析',
      timeline: {
        data: [],
        value: ''
      },
      sourceChart: createChartTemp({
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
      }, [], {
          series: [{
            radius: ['39%', '52%'],
            labelLine: {
              length: 4,
            },
            label: {
              show: true,
              unit: units[0]
            }
          }]
        }),
      barChart: createChartTemp({
        tooltip: {
          show: true,
          formatter: '{b}: {c}' + units[0]
        },
        legend: {
          show: false
        },
        grid: {
          top: 20
        },
        xAxis: [{
          axisLabel: {
            rotate: 60,
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
              show: false
            },
            barWidth: '40%'
          }
        })
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    PieChart,
    BarChart,
    Timeline,
    BorderBg
  },
  computed: {
    ...mapGetters({
      dateTimeList: 'dateTimeList',
      citySourceList: 'citySourceListTopTen'
    }),
    ...mapState({
      init: state => state.populationOverview.init,
      cityPopulationSource: state => state.populationSource.cityPopulationSource, // 城市人口来源分析(本地、外来）
    })
  },
  watch: {
    dateTimeList: function () {
      this.setTimeLine(this.dateTimeList);
    },
    citySourceList: function () {
      this.formatData(this.citySourceList);
    },
    cityPopulationSource: function () {
      this.formatSourceData(this.cityPopulationSource);
    },
  },
  mounted() {
    console.log(this.timeline,'timeline')
    console.log(this.cityPopulationSource,'cityPopulationSource')
    console.log(this.citySourceList,'citySourceList')
    this.setTimeLine(this.dateTimeList);
    if (this.init === true || (Object.values(this.cityPopulationSource).length>0 || this.citySourceList.length>0)) {
      this.initData();
    }
  },
  methods: {
    ...mapActions([
      'updateCityPopulationSource',
      'updateCitySourceList'
    ]),
    initData() {
      this.formatData(this.citySourceList);
      this.formatSourceData(this.cityPopulationSource);
    },
    setTimeLine(data) {
      const formatData = data.map(item => {
        return {
          name: dateTransition(item.desc),
          value: item.value
        }
      });
      this.timeline.data = formatData;
    },
    /**
     * 外来人口来源城市TOP10
     * @param {Array} data 原数据
     */
    formatData(data = []) {
      if (data.length > 0) {
        const dataList = convertArrayData(data, {
          nameKeys: ['sourceName'],
          valueKeys: ['inflowRate']
        }, {
            label: 'sourceName'
          });
        dataList.forEach((item) => {
          item.label = interceptCityName(item.label);
        });
        this.barChart.data = dataList;
        //时间轴选中与数据dateTime一致
        if (dataList.length > 0) {
          this.timeline.value = dataList[0].dateTime;
        }
        delete this.barChart.config.color;
        this.barChart.config.tooltip.show = true;
      } else {
        const dataList = Array(10).fill({ 'name1': '', 'value1': 10, 'label': '' });
        this.barChart.config.color = [hexToRgba(BLUECOLORS[0], 0.3), hexToRgba(BLUECOLORS[1], 0.3)];
        this.barChart.config.tooltip = {
          show: false
        }
        this.barChart.data = dataList;
      }
    },
    /**
     * 城市人口来源分析(本地、外来）
     * @param {object} data 原数据
     */
    formatSourceData(data = {}) {
      const dataList = convertObjectData(data, [{
        nameValues: ['外来', '本地'],
        valueKeys: ['inflowPopulation', 'localPopulation']
      }]);
      if (dataList.length === 0) {
        this.sourceChart.other.series[0].label.show = false;
        this.sourceChart.config.color = [hexToRgba(BLUECOLORS[0], 0.3), hexToRgba(BLUECOLORS[1], 0.3)];
        dataList.push({
          'name1': '',
          'value1': 100
        });
      } else {
        this.sourceChart.other.series[0].label.show = true;
        delete this.sourceChart.config.color;
      }
      this.sourceChart.data = dataList;
    },
    changeTime(data) {
      this.timeline.value = data.value;
      this.updateCityPopulationSource({
        dateTime: this.timeline.value
      });
      this.updateCitySourceList({
        dateTime: this.timeline.value
      });
    }
  },
  beforeDestroy() { }
}
</script>

<style module lang="less">
@import "./citySource.less";
</style>
