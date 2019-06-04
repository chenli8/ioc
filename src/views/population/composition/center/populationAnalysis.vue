<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <SubNav
       :navList='navList'
       :currentNav='currentNav'
       :direction ='direction'
       @changeNav="switchNavHandlefun"
       :class="$style[`${clsPrefix}${clsName}-subNav`]"
      ></SubNav>
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
import { mapState, mapMutations, mapGetters } from "vuex";
import { createChartTemp, units, merge } from "@/lib/util.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import MapChart from "@/business-component/chart/mapChart.vue";
import SubNav from "@/business-component/subNav/subNav.vue";
export default {
  data() {
    return {
      clsName: "populationAnalysis",
      title: "人口构成分析",
      chart: createChartTemp(
        {
          legend: { name: "", unit: "%" ,},
          outline: true,
          tooltip: {
            show: true
          }
        },
        [],
        { play: true }
      ),
      navList: [
        { value: 0, name: "男性占比", label: "maleRate" },
        { value: 1, name: "女性占比", label: "femaleRate" },
        { value: 2, name: "0-14岁占比", label: "childrenRatio" },
        { value: 3, name: "15-64对占比", label: "labourRatio" },
        { value: 4, name: "65岁及以上占比", label: "oldRatio" },
        { value: 5, name: "少儿抚养比", label: "childrenDependencyRatio" },
        { value: 6, name: "老年抚养比", label: "oldDependencyRatio" },
        { value: 7, name: "总抚养比", label: "totalDependencyRatio" },
        { value: 8, name: "本地人口占比", label: "localRate" },
        { value: 9, name: "外来人口占比", label: "inflowRate" },
        { value: 10, name: "省内外来占比", label: "inflowLocalRate" },
        { value: 11, name: "省外外来占比", label: "inflowExternalRate" }
      ],
      currentNav: 0,
      direction: "column"
    };
  },
  mixins: [clsMixin],
  components: { HeaderBar, MapChart, SubNav },
  computed: {
    ...mapState({
      init : state => state.populationStructure.init,
      cityName: state => state.cityInfo.cityName,
      countyName: state => state.cityInfo.countyName,
    }),
    ...mapGetters(["getCountyFencing", "getCityFencing",'getRate'])
  },
  watch: {
    getRate:function() {
      this.formatcountyData(this.getRate);
    },
    currentNav:function() {
      this.formatcountyData(this.getRate);
    },
  },
  mounted() {
    if(this.init === true){
      this.formatcountyData(this.getRate)
    }
  },
  methods: {
    ...mapMutations(["setCounty"]),
    formatcountyData(data) {
      if (data && data.length > 0) {
        let _target = this.navList[this.currentNav].label;
        let dataList = data.map(item => {
          return {
            name: item.countyName,
            value: item[_target] || 0,
            unit: units[0],
            _item: item
          };
        });
        let geo = merge({}, this.getCountyFencing);
        if (geo.features && geo.features.length > 0) {
          geo.features.unshift(this.getCityFencing.features[0]);
        }
        this.chart.other.series = [
          {
            map: this.cityName,
            geo: geo
          }
        ];
        this.chart.data = dataList;
      }
    },
    changeMap(item) {
      if (item._item.countyName !== this.countyName) {
        this.setCounty(item._item);
      }
    },
    switchNavHandlefun(current) {
      this.currentNav = current.value;
    }
  },
  beforeDestroy() {}
};
</script>

<style module lang="less">
@import "./populationAnalysis.less";
</style>
