<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
     <HeaderBar 
     :title="title"  ></HeaderBar>
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
import { mapState } from 'vuex';
import { createChartTemp, units, formatThousands, toFixed } from '@/lib/util.js';
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
      clsName: 'populationDistribution',
      title: '各区县人口分布',
      chart: createChartTemp({
        tooltip: {
          show: true
        },
        legend:{
          show:true
        },
        yAxis: [{
          name: '(万人)'
        }, {
          axisLabel: {
            unit: units[0]
          }
        }]
      }, [], {
          series: [
            {
              label: {
                unit: units[1]
              }
            },
            {
              label: {
                unit: units[1]
              }
            },
            {
              label: {
                unit: units[1]
              }
            },
            {
              label: {
                unit: units[0]
              }
            }
          ]
        })
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, LineBar ,BorderBg},
  computed: {
    ...mapState({
      countyPopulation: state => state.totalPopulation.countyPopulation
    })
  },
  watch: {
    countyPopulation: function () {
      this.formatData(this.countyPopulation);
    }
  },
  mounted() {
  },
  methods: {
    formatData(data) {
      if (data && data.length > 0) {
        let dataList = data.map((item) => {
          return {
            label: item.countyName,
            name1: '常住人口',
            value1: formatThousands(item.residentPopulation || 0),
            name2: '工作人口',
            value2: formatThousands(item.workPopulation || 0),
            name3: '居住人口',
            value3: formatThousands(item.livePopulation || 0),
            name4: '常住人口-环比',
            value4: toFixed(item.chainRatio || 0),
          }
        });
        this.chart.data = dataList;
        delete this.chart.config.color;
        this.chart.config.tooltip.show = true;
      } else {
        const dataList = Array(7).fill({
          name1: '',
          name2: '',
          name3: '',
          name4: '',
          value1: 60,
          value2: 60,
          value3: 60,
          value4: 60
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
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./populationDistribution.less";
</style>
