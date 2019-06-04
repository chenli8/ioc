
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <span
        :class="$style[`${clsPrefix}${clsName}-title`]"
      >{{countyFlowWorkLiveType===1?'工作人口':'居住人口'}}流入占比(%)</span>
      <div :class="$style[`${clsPrefix}${clsName}-icoCon`]" >
        <div :class="$style[`${clsPrefix}${clsName}-arrowsCon`]" @click="changeType">
        </div>
      </div>
      <GeoChart
        :data="geoChart.data"
        :config="geoChart.config"
        :other="geoChart.other"
        :class="[$style[`${clsPrefix}${clsName}-chart`],animatCls]"
        @changeGeo="changeGeo"
        ref="geo"
      ></GeoChart>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import hexToRgba from '@/lib/hexToRgba.js';
import { createChartTemp, formatThousands, units, merge, toFixed } from '@/lib/util.js';
import { FONTCOLOR2, SHADOWCOLOR, GEOCOLORS2 } from "@/business-component/chart/chart.config.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import GeoChart from "@/business-component/chart/geoChart.vue";
export default {
  data() {
    
    return {
      clsName: "overallPopulationGeo",
      title: "跨区职住人口流向",
      animatCls: '',
      geoChart: createChartTemp(
        {
          legend: {
            show: false
          },
          geo: {
            aspectScale: 1,
            zoom: 1.2,
            outline: true,
            itemStyle: {
              areaColor:hexToRgba(GEOCOLORS2, 0.5),
              borderWidth: 2
            },
            emphasis: {
              itemStyle: {
                areaColor:GEOCOLORS2,
                borderWidth: 3
              }
            },
            regions: [
              {
                name: "",
                itemStyle: {
                  borderWidth: 2,
                  borderColor: FONTCOLOR2,
                  areaColor: "transparent",
                  shadowColor: hexToRgba(SHADOWCOLOR, 0.25),
                  shadowOffsetX: -15,
                  shadowOffsetY: 4
                },
                label: {
                  show: false
                },
                emphasis: {
                  itemStyle: {
                    areaColor: "transparent"
                  }
                }
              }
            ]
          }
        },
        [], {
          click: true// geo ClickEvent
        })
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    GeoChart
  },
  computed: {
    ...mapState({
      init: state => state.workLive.init,
      cityName: state => state.cityInfo.cityName,
      countyName: state => state.cityInfo.countyName,
      countyFlowWorkLiveType: state => state.workLive.countyFlowWorkLiveType,
      countyWork: state => state.workLive.countyWork, //去哪里工作
      countyLive: state => state.workLive.countyLive //去哪里居住
    }),
    ...mapGetters(["getCountyFencing", "getCountyCenter", "getCityFencing"])
  },
  watch: {
    countyWork: function () {
      if (this.countyFlowWorkLiveType === 1) {
        this.formatData(this.countyWork);
      }
    },
    countyLive: function () {
      if (this.countyFlowWorkLiveType === 2) {
        this.formatData(this.countyLive);
      }
    },
    countyFlowWorkLiveType: function () {
      this.addAnimat();
      if (this.countyFlowWorkLiveType === 1) {
        this.formatData(this.countyWork);
      } else {
        this.formatData(this.countyLive);
      }
    }
  },
  mounted() {
    //this.countyWork.length>0 由于人口运行概览页也存在去哪里工作、去哪里居住,有可能先进入概览页面已经加载完数据.
    if (this.init === true || this.countyWork.length > 0) {
      this.initData();
    }
    //解决其它页面(人口构成分析)已经加载过countyName,引起切换到此页面未加载右侧区县数据
      if(this.countyName!==''){
        this.updateCountyData();
      }
    this.$refs.geo.$el.addEventListener('animationend', this.removeAnimat);
  },
  methods: {
    ...mapMutations(["setCountyFlowWorkLiveType", "setCounty"]),
    ...mapActions(['updateCountyData']),
    initData() {
      if (this.countyFlowWorkLiveType === 1) {
        this.formatData(this.countyWork);
      } else {
        this.formatData(this.countyLive);
      }
      
    },
    formatData(data = []) {
      if (data && data.length > 0) {
        // geoChart
        this.geoChart.config.geo.map = this.cityName;
        this.geoChart.other.geoCoord = this.getCountyCenter;
        let geo = merge({}, this.getCountyFencing);
        let maxValue = 0;
        if (geo.features && geo.features.length > 0) {
          const cityFeature = this.getCityFencing.features[0];
          this.geoChart.config.geo.regions[0].name =
            cityFeature.properties.name;
          geo.features.unshift(this.getCityFencing.features[0]);
        }
        this.geoChart.config.geo.geo = geo;
        //set from to
        const from = data.map((item) => {
          const value = item.rate || 0;
          maxValue = Math.max(maxValue, value);
          return {
            code: this.countyFlowWorkLiveType === 1 ? item.workCountyCode : item.liveCountyCode,
            name: this.countyFlowWorkLiveType === 1 ? item.workCountyName : item.liveCountyName,
            value
          };
        });
        const firstData = data[0] || {};
        const to = {
          code: firstData.countyCode,
          name: firstData.countyName || "",
          value: 99999,
          series: {
            label: {
              show: true
            }
          }
        };
        this.geoChart.other.series = [{}, {
          label: {
            show: true,
            intercept: false,//是否截取字符串市(如 邹平市=>邹平) 默认true截取
            unit: units[0]
          },
          symbolSize: (data, params) => {
            const value = Math.abs((params.value[2] || 0));
            const size = value === 99999 ? 10 : toFixed(value / maxValue * 18, 0);
            return size <= 3 ? 8 : size;
          },
        }];
        const geoDataList = [{ from, to }];

        this.geoChart.data = geoDataList;
      }
    },
    changeType() {
      this.setCountyFlowWorkLiveType(this.countyFlowWorkLiveType === 1 ? 2 : 1);
    },
    changeGeo(item) {
      if (item.name !== this.countyName) {
        this.setCounty({ countyCode: item.code, countyName: item.name });
      }
    },
    addAnimat() {
      this.animatCls = 'fadeInRight animated';
    },
    removeAnimat() {
      this.animatCls = '';
    }
  },
  beforeDestroy() {
    this.$refs.geo.$el.removeEventListener('animationend', this.removeAnimat);
  }
};
</script>

<style module lang="less">
@import "./overallPopulationGeo.less";
</style>
