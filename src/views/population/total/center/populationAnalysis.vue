<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <MapChart
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
        @changeMap="changeMap"
      ></MapChart>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { createChartTemp, formatThousands, units, merge } from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import MapChart from '@/business-component/chart/mapChart.vue';
export default {
  data() {
    return {
      clsName: 'populationAnalysis',
      title: '人口总量分析',
      chart: createChartTemp({ legend: { name: '常住人口', unit: '万' }, outline: true }, [], { play: true })
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, MapChart },
  computed: {
    ...mapState({
      cityName: state => state.cityInfo.cityName,
      countyName: state => state.cityInfo.countyName,
      countyPopulation: state => state.totalPopulation.countyPopulation
    }),
    ...mapGetters([
      'getCountyFencing',
      'getCityFencing'
    ])
  },
  watch: {
    countyPopulation: function () {
      this.formatData(this.countyPopulation);
    }
  },
  mounted() {

  },
  methods: {
    ...mapMutations([
      'setCounty'
    ]),
    formatData(data) {
      if (data && data.length > 0) {
        let dataList = data.map((item) => {
          return {
            name: item.countyName,
            value: formatThousands(item.residentPopulation || 0),
            unit: units[1],
            _item: item
          }
        });
        let geo = merge({}, this.getCountyFencing);
        if (geo.features && geo.features.length > 0) {
          geo.features.unshift(this.getCityFencing.features[0]);
        }
        this.chart.other.series = [{
          map: this.cityName,
          geo: geo
        }];
        this.chart.data = dataList;
      }
    },
    changeMap(item) {
      if (item._item.countyName !== this.countyName) {
        this.setCounty(item._item);
      }
    }
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./populationAnalysis.less";
</style>
