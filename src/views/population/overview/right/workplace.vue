<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle="countyName" :index="2"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <HorizontalBar
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></HorizontalBar>
      <div :class="$style[`${clsPrefix}${clsName}-right-con`]">
        <GeoChart
          :data="geoChart.data"
          :config="geoChart.config"
          :other="geoChart.other"
          :class="$style[`${clsPrefix}${clsName}-geochart`]"
        ></GeoChart>
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
import hexToRgba from '@/lib/hexToRgba.js';
import { createChartTemp, dateTransition, convertArrayData, units } from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import { BLUECOLORS,GREENCOLORS } from '@/business-component/chart/chart.config.js';
import HorizontalBar from '@/business-component/chart/horizontalBar.vue';
import HeaderBar from '@/business-component/headerBar/index.vue';
import GeoChart from '@/business-component/chart/geoChart.vue';
import Timeline from '@/business-component/timeline/index.vue';
import BorderBg from '@/business-component/borderBg/index.vue';

export default {
  data() {
    return {
      clsName: 'workplace',
      title: '居住在的人都去哪里工作?',
      chart: createChartTemp({
        color:GREENCOLORS,
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        grid: {
          right: 30
        }
      }, [], {
          series: {
            barWidth: '25%'
          },
          shadow: {
            show: true,
            barWidth: '25%'
          }

        }),
      geoChart: createChartTemp({
        legend: {
          show: false
        }, geo: { aspectScale: 1, zoom: 1.2 }      }, [], {
          series: [{}, {
            label: {
              show: true,
              intercept:false,//是否截取字符串市(如 邹平市=>邹平) 默认true截取
              unit: units[0]
            }
          }]
        }),
      timeline: {
        data: [],
        value: ''
      },
    }
  },
  mixins: [clsMixin],
  components: { HorizontalBar, HeaderBar, Timeline, GeoChart,BorderBg },
  computed: {
    ...mapGetters([
      'dateTimeList',
      'getCountyFencing',
      'getCountyCenter'
    ]),
    ...mapState({
      init: state => state.populationOverview.init,
      cityName: state => state.cityInfo.cityName,
      countyWork: state => state.workLive.countyWork,
      countyName: state => state.cityInfo.countyName,
    })
  },
  watch: {
    dateTimeList: function () {
      this.setTimeLine(this.dateTimeList);
    },
    countyWork: function () {
      this.formatData(this.countyWork);
    }
  },
  mounted() {
    this.setTimeLine(this.dateTimeList);
    //this.countyWork.length>0 由于人口跨区职住页也存在去哪里工作、去哪里居住,有可能先进入人口跨区职住页面已经加载完数据.
    if (this.init === true||this.countyWork.length>0) {
      this.initData();
    }
  },
  methods: {
    ...mapMutations([
      'setCounty'
    ]),
    ...mapActions([
      'updateCountyWork'
    ]),
    initData() {
      this.formatData(this.countyWork);
    },
    setTimeLine(data) {
      const formatData = data.map(item => { return { name: dateTransition(item.desc), value: item.value } });
      this.timeline.data = formatData;
    },
    /**
     * @param {Array} data 居住地
     */
    formatData(data=[]) {
      let dataList = convertArrayData(data, { nameKeys: ['workCountyName'], valueKeys: ['rate'] }, { label: 'workCountyName' });
      if (dataList.length > 0) {
        //时间轴选中与数据dateTime一致
        this.timeline.value = dataList[0].dateTime;
        this.chart.config.color=GREENCOLORS;
        this.chart.other.shadow.formatter;
      } else {
        dataList = Array(10).fill({ 'name1': '', 'value1': 10, 'label': '' });
        this.chart.config.color = [hexToRgba(BLUECOLORS[0], 0.3), hexToRgba(BLUECOLORS[1], 0.3)];
        this.chart.other.shadow = {
          show: true,
          formatter: (par) => {
            return '0%';
          }
        }
      }
      this.chart.data = dataList.reverse();
      //geoChart
      this.geoChart.config.geo.map = this.cityName;
      this.geoChart.config.geo.geo = this.getCountyFencing;
      this.geoChart.other.geoCoord = this.getCountyCenter;
      //set from to
      const to = dataList.map((item) => {
        return {
          code: item.workCountyCode,
          name: item.name1,
          value: item.value1
        };
      });

      const firstData = data[0] || {};
      const from = { code: firstData.countyCode, name: firstData.countyName || '', value: 99999 };
      const geoDataList = [{ from, to }];
      this.geoChart.data = geoDataList;
    },
    changeTime(data) {
      this.timeline.value = data.value;
      this.updateCountyWork({ dateTime: this.timeline.value });

    }
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./workplace.less";
</style>
