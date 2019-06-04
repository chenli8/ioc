
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <Card :numberData="cityTotalPopulation" :class="$style[`${clsPrefix}${clsName}-card`]"></Card>
      <div :class="$style[`${clsPrefix}${clsName}-chartCon`]">
        <InfoBlock
          :class="$style[`${clsPrefix}${clsName}-num`]"
          :number="population"
          :dis="countyName"
          :position="position"
        ></InfoBlock>
        <MapChart
          :data="chart.data"
          :config="chart.config"
          :other="chart.other"
          :class="$style[`${clsPrefix}${clsName}-chart`]"
          @changeMap="changeMap"
        ></MapChart>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { createChartTemp, formatThousands, units, delimiter, merge } from "@/lib/util.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import MapChart from "@/business-component/chart/mapChart.vue";
import InfoBlock from '@/business-component/infoBlock/index.vue';
import Card from '@/business-component/card/index.vue';
export default {
  data() {
    return {
      clsName: 'overallMap',
      title: '人口运行总览',
      population: '',//区县人口
      position:'bottom',
      chart: createChartTemp(
        {
          legend: {
            name: '',
            unit: '万'
          },
          outline: true
        },
        [],
        {
          play: true
        }
      ),
      timer: null
    };
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    MapChart,
    InfoBlock,
    Card
  },
  computed: {
    ...mapState({
      cityName: state => state.cityInfo.cityName,
      countyName: state => state.cityInfo.countyName,
      cityTotalPopulation: state => state.populationOverview.cityTotalPopulation,
      countyTotalPopulation: state => state.populationOverview.countyTotalPopulation,
    }),
    ...mapGetters([
      'getCountyFencing',
      'getCityFencing'
    ])
  },
  watch: {
    countyTotalPopulation: function () {
      this.formatData(this.countyTotalPopulation);
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations(['setCounty']),
    ...mapActions(['updateCountyData', 'updateCityTotalPopulation']),
    initData() {
      this.start();
      //解决其它页面(人口构成分析)已经加载过countyName,引起切换到此页面未加载右侧区县数据
      if(this.countyName!==''){
        this.updateCountyData();
      }
    },
    /**
     * 更新翻牌
     */
    start() {
      this.timer = setTimeout(() => {
        this.updateCityTotalPopulation();
        this.start();
      }, 5000);
    },
    stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    formatData(data) {
      if (data && data.length > 0) {
        let dataList = data.map(item => {
          return {
            name: item.name,
            value: formatThousands(item.population || 0),
            unit: units[1],
            _item: item
          };
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
        this.population = delimiter(data[0].population || 0);
      }
    },
    changeMap(item) {
      if (item._item.name !== this.countyName) {
        item._item.countyName = item._item.name;
        item._item.countyCode = item._item.code;
        this.population = delimiter(item._item.population || 0);
        this.setCounty(item._item);
        this.updateCountyData();
      }
    }
  },
  beforeDestroy() {
    this.stop();
  }
};
</script>

<style module lang="less">
@import "./overallPopulation.less";
</style>
