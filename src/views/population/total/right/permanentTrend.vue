<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
       <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <LineBar
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></LineBar>
    </div>
    </BorderBg>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex';
import {
  createChartTemp,
  units,
  formatThousands,
  toFixed
} from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import LineBar from '@/business-component/chart/lineBar.vue';
import {
  BLUECOLORS
} from '@/business-component/chart/chart.config.js';
import hexToRgba from "@/lib/hexToRgba.js";
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: 'permanentTrend',
      title: '最近12个月常住人口趋势',
      chart: createChartTemp({
        tooltip: {
          show: true
        },
        yAxis: [{
          name: '(万人)'
        }, {
          axisLabel: {
            unit: units[0]
          }
        }]
      }, [], {
          series: [{
            label: {
              unit: units[1]
            }
          }, {
            label: {
              unit: units[0]
            }
          }]
        }),
      showCity: true,
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    LineBar,
    BorderBg
  },
  computed: {
    ...mapState({
      countyTrend: state => state.totalPopulation.countyTrend,
      countyName: state => state.cityInfo.countyName
    })
  },
  watch: {
    'countyTrend': function () {
      this.formatData(this.countyTrend);
    }
  },
  mounted() { },
  methods: {
    formatData(data) {
      if (data && data.length > 0 && this.countyName) {
        let dataList = data.map((item) => {
          return {
            label: item.dateTime,
            name1: '常住人口',
            value1: formatThousands(item.residentPopulation || 0),
            name2: '环比',
            value2: toFixed(item.chainRatio || 0),
          }
        });
        this.chart.data = dataList.reverse();
        delete this.chart.config.color;
        this.chart.config.tooltip.show = true;
      } else {
        const dataList = Array(12).fill({
          name1: '',
          name2: '',
          value1: 50,
          value2: 50,
        });
        this.chart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.chart.config.tooltip = {
          show: false
        }
        this.chart.data = dataList;
      }
    }
  },
  beforeDestroy() { }
}
</script>

<style module lang="less">
@import "./permanentTrend.less";
</style>
