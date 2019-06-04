
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <span
        :class="$style[`${clsPrefix}${clsName}-title`]"
      >{{countyFlowWorkLiveType===1?'工作人口':'居住人口'}}流入总量(人)</span>
      <MapChart
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="[$style[`${clsPrefix}${clsName}-chart`], animatCls]"
        @changeMap="changeMap"
        ref="map"
      ></MapChart>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { createChartTemp, units, merge } from '@/lib/util.js';
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import MapChart from '@/business-component/chart/mapChart.vue';
export default {
  data() {
    return {
      clsName: 'overallPopulationMap',
      title: '跨区职住人口分布',
      chart: createChartTemp({ legend: { show: false, name: '', unit: '' }, outline: true }, [], { play: true, continuance: true }),
      dataList: [],
      animatCls:''
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    MapChart
  },
  computed: {
    ...mapState({
      init: state => state.workLive.init,
      cityName: state => state.cityInfo.cityName,
      countyName: state => state.cityInfo.countyName,
      countyFlowWorkLiveType: state => state.workLive.countyFlowWorkLiveType,
      countyFlowWorkLive: state => state.workLive.countyFlowWorkLive
    }),
    ...mapGetters([
      'getCountyFencing',
      'getCityFencing'
    ])
  },
  watch: {
    countyFlowWorkLive: function () {
      this.formatData(this.countyFlowWorkLive);
    },
    countyFlowWorkLiveType: function () {
      this.addAnimat();
      this.formatData(this.countyFlowWorkLive);
    },
    countyName: function (newVal, oldVal) {
      this.updateCountyWorkLive();
      this.setStartIndex(this.countyName);
    }
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
    this.$refs.map.$el.addEventListener('animationend', this.removeAnimat);
  },
  methods: {
    ...mapMutations([
      'setCounty',
    ]),
    ...mapActions(['updateCountyWorkLive']),
    initData() {
      this.formatData(this.countyFlowWorkLive);
    },
    formatData(data) {
      if (data && data.length > 0) {
        let dataList = data.map((item) => {
          return {
            name: item.countyName,
            value: this.countyFlowWorkLiveType === 1 ? (item.workInflowPopulation || 0) : (item.liveInflowPopulation || 0),
            unit: units[2],
            _item: item
          }
        });
        //原始数据默认按照workInflowSort降序
        dataList.sort((a, b) => { return b.value - a.value; });
        let geo = merge({}, this.getCountyFencing);
        if (geo.features && geo.features.length > 0) {
          geo.features.unshift(this.getCityFencing.features[0]);
        }
        this.chart.other.series = [{
          zoom:0.96,
          map: this.cityName,
          geo: geo
        }];
        this.chart.data = dataList;
        this.dataList = dataList;
      }
    },
    changeMap(item) {
      if (item._item.countyName !== this.countyName) {
        this.setCounty(item._item);
      }
    },
    setStartIndex(name) {
      const index = this.dataList.findIndex((item) => {
        return item.name === name;
      });
      const map = this.$refs.map;
      if (index > -1 && map&&map.getCurrentIndex()!==index) {
        map.reset(index);
      }
    },
    addAnimat(){
      this.animatCls='fadeInRight animated';
    },
    removeAnimat(){
      this.animatCls='';
    }
  },
  beforeDestroy() {
    this.$refs.map.$el.removeEventListener('animationend', this.removeAnimat);
  }
};
</script>

<style module lang="less">
@import "./overallPopulationMap.less";
</style>
