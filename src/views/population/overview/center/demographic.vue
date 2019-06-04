<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
        <HeaderBar :title="title"  :subTitle="countyName"
        :class="$style[`${clsPrefix}${clsName}-title`]"
         ></HeaderBar>
        <div :class="$style[`${clsPrefix}${clsName}-content`]">
          <LineChart
            :data="chart.data"
            :config="chart.config"
            :other="chart.other"
            :class="$style[`${clsPrefix}${clsName}-chart`]"
          ></LineChart>
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
import HeaderBar from '@/business-component/headerBar/index.vue';
import LineChart from '@/business-component/chart/lineChart.vue';
import BorderBg from '@/business-component/borderBg/index.vue';
import {
  createChartTemp,
  units,
  formatThousands
} from '@/lib/util.js';
export default {
  data() {
    return {
      clsName: 'demographic',
      title: '最近12个周人口趋势',
      chart: createChartTemp({
        grid: {
          top: 35
        },
        legend:{
          show:false
        },
        xAxis: [{
          axisLabel: {
            align: 'left'
          }
        }],
        yAxis: [{
          name: '(万人)'
        }]
      }, [], {
          series: [{
            label: {
              show: false,
              unit: units[1]
            }
          }]
        }),
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, LineChart,BorderBg }
  ,
  computed: {
    ...mapState({
      init: state => state.populationOverview.init,
      countyName: state => state.cityInfo.countyName,
      countyWeekTrend: state => state.populationOverview.countyWeekTrend,
    })
  },
  watch: {
    countyWeekTrend: function () {
      this.formatData(this.countyWeekTrend);
    }
  },
  mounted() {
    if(this.init===true){
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.countyWeekTrend);
    },
    formatData(data=[]) {
      if (data.length > 0 && this.countyName) {

        let dataList = data.map((item) => {
          return {
            label: this.formatDate(item.dayStart, item.dayEnd),
            name1: '常住人口',
            value1: formatThousands(item.weekPopulation || 0)
          }
        });
        this.chart.data = dataList.reverse();
      }

    },
    formatDate(start, end) {
      const _start = ((start || '').substring(5, start.length)).replace('-', '');
      const _end = ((end || '').substring(5, end.length)).replace('-', '');
      return `${_start}-${_end}`;
    }
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./demographic.less";
</style>
