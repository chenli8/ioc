<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <TabLine :class="$style[`${clsPrefix}${clsName}-toolbar`]" :data="tabLine.data" :value="tabLine.value" @change-tab="changeTab"></TabLine>
        <HorizontalBar :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></HorizontalBar>
        <div :class="$style[`${clsPrefix}${clsName}-right-con`]">
          <GeoChart :data="geoChart.data" :config="geoChart.config" :other="geoChart.other" :class="$style[`${clsPrefix}${clsName}-geochart`]"></GeoChart>
          <Timeline :class="$style[`${clsPrefix}${clsName}-timeline`]" :data="timeline.data" :value="timeline.value" @changeTime="changeTime"></Timeline>
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
  import {
    createChartTemp,
    date,
    convertArrayData,
    interceptCityName,
    dateTransition,
    toFixed,
    units,
    getMonthList
  } from '@/lib/util.js';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import {
    BLUECOLORS,
    YELLOWCOLORS,
    REDCOLORS,
    GEOBORDERCOLORS
  } from '@/business-component/chart/chart.config.js';
  import HorizontalBar from '@/business-component/chart/horizontalBar.vue';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import GeoChart from '@/business-component/chart/geoChart.vue';
  import Timeline from '@/business-component/timeline/index.vue';
  import TabLine from '@/business-component/tabLine/index.vue';
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: 'cityInflow',
        title: '全市流入人口分析',
        chart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          grid: {
            right: 25
          }
        }, [], {
          series: {
            barWidth: '40%'
          }
        }),
        geoChart: createChartTemp({
          legend: {
            show: false
          },
          geo: {
            zoom: 1.2,
            itemStyle: {
              borderColor: hexToRgba(GEOBORDERCOLORS, 1)
            }
          }
        }),
        timeline: {
          data: [],
          value: ''
        },
        tabLine: {
          data: [{
            name: '常住人口'
          }, {
            name: '劳动力人口'
          }],
          value: '常住人口'
        },
      }
    },
    mixins: [clsMixin],
    components: {
      HorizontalBar,
      HeaderBar,
      Timeline,
      GeoChart,
      TabLine,
      BorderBg
    },
    computed: {
      ...mapGetters([
        'dateTimeList'
      ]),
      ...mapState({
        init: state => state.populationOverview.init,
        cityFlowResident: state => state.populationOverview.cityFlowResident,
        cityFlowWorker: state => state.populationOverview.cityFlowWorker
      })
    },
    watch: {
      dateTimeList: function() {
        this.setTimeLine(this.dateTimeList);
      },
      cityFlowResident: function() {
        if (this.tabLine.value === this.tabLine.data[0].name) {
          this.formatData(this.cityFlowResident);
        }
      },
      cityFlowWorker: function() {
        if (this.tabLine.value === this.tabLine.data[1].name) {
          this.formatData(this.cityFlowWorker);
        }
      }
    },
    mounted() {
      //set timeline
      this.setTimeLine(this.dateTimeList);
      if (this.init === true) {
        this.initData();
      }
    },
    methods: {
      ...mapActions([
        'updateCityFlowResident',
        'updateCityFlowWorker'
      ]),
      initData() {
        this.formatData(this.cityFlowResident);
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
      formatData(data = []) {
        //barChart 
        let dataList = convertArrayData(data, {
          nameKeys: ['sourceName'],
          valueKeys: ['inflowRatio']
        }, {
          label: 'sourceName'
        });
        dataList.forEach((item) => {
          item.label = interceptCityName(item.label);
        });
        if (dataList.length > 0) {
          //时间轴选中与数据dateTime一致
          this.timeline.value = dataList[0].dateTime;
          //top 10
          if (dataList.length >= 10) {
            dataList.splice(10, dataList.length);
          }
          delete this.chart.config.color;
        } else {
          dataList = Array(10).fill({
            'name1': '',
            'value1': 10,
            'label': ''
          });
          this.chart.config.color = [hexToRgba(BLUECOLORS[0], 0.3), hexToRgba(BLUECOLORS[1], 0.3)];
          this.chart.other.shadow = {
            show: true,
            formatter: (par) => {
              return '0%';
            }
          }
        }
        this.chart.data = dataList.reverse();
        // geoChart
        let from = data.map((item, index) => {
          return {
            name: item.sourceName,
            value: toFixed(item.inflowRatio),
          }
        });
        const firstData = data[0] || {};
        const to = {
          name: firstData.cityName || '',
          value: 99999
        };
        const geoDataList = [{
          from,
          to
        }];
        this.geoChart.other.series = [{
          effect: {
            color: hexToRgba(YELLOWCOLORS[0], 0.15),
            symbolSize: [1, 6]
          },
          lineStyle: {
            width: 0.5,
            color: hexToRgba(REDCOLORS[1], 0.25)
          }
        }, {
          label: {
            show: false,
            unit: units[0]
          },
          showEffectOn: '',
          itemStyle: {
            color: hexToRgba(YELLOWCOLORS[0], 0.65)
          },
          symbolSize: (data, params) => {
            let value = Math.abs((params.value[2] || 0));
            // const size = toFixed(Math.abs((params.value[2] || 0)) / maxValue * 18, 0);
            return value === 99999 ? 8 : 4;
          },
        }];
        this.geoChart.data = geoDataList;
      },
      changeTime(data) {
        this.timeline.value = data.value;
        //判断显示常住人口、劳动力人口
        if (this.tabLine.value === this.tabLine.data[0].name) {
          this.updateCityFlowResident({
            dateTime: this.timeline.value
          });
        } else {
          this.updateCityFlowWorker({
            dateTime: this.timeline.value
          });
        }
      },
      changeTab(data) {
        this.tabLine.value = data.name;
        //判断显示常住人口、劳动力人口
        if (this.tabLine.data[0].name === data.name) {
          this.formatData(this.cityFlowResident);
        } else {
          this.formatData(this.cityFlowWorker);
        }
      }
  
    },
    beforeDestroy() {}
  }
</script>

<style module lang="less">
  @import "./cityInflow.less";
</style>
