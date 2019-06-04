<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle="streetName"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-description`]">
          <span>平均通勤距离</span>
          <span :class="$style[`${clsPrefix}${clsName}-num`]">{{averageDistance}}</span>
          <span :class="$style[`${clsPrefix}${clsName}-unit`]">公里</span>
          <span :class="$style[`${clsPrefix}${clsName}-ranking`]">全区排名</span>
          <span :class="$style[`${clsPrefix}${clsName}-ranking-num`]">{{commuterDistanceRank}}/</span>
          <span :class="$style[`${clsPrefix}${clsName}-ranking-count`]">{{childrenNum||0}}</span>
        </div>
        <PieChart :config="chart.config" :data="chart.data" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></PieChart>
        <div :class="$style[`${clsPrefix}${clsName}-legendCon`]">
          <div v-show="show" v-for="(item,index) in  chart.data" :key="index">
            <template v-for=" (val,key) in  item">
                    <div
                      v-if="key.indexOf('name')>-1&&key!=='name'"
                      :key="key+Math.random()"
                      :class="$style[`${clsPrefix}${clsName}-legend`]"
                    >
                      <i
                        :class="$style[`${clsPrefix}${clsName}-circle`]"
                        :style="{borderColor:colors[(Number(key.substring(4,5))-1)*2]}"
                      ></i>
                      <span :class="$style[`${clsPrefix}${clsName}-legend-name`]">{{val}}</span>
                      <span>{{item[`value${key.substring(4,5)}`]}}%</span>
                    </div>
</template>
        </div>
      </div>
    </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from "vuex";
  import hexToRgba from "@/lib/hexToRgba.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import {
    COLORS2,
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import PieChart from "@/business-component/chart/pieChart.vue";
  import {
    merge,
    createChartTemp,
    toFixed,
    convertObjectData
  } from "@/lib/util.js";
  import {
    debug
  } from 'util';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      let COLORS = [];
      COLORS2.forEach(item => {
        COLORS.push(item, item);
      });
  
      return {
        colors: COLORS,
        clsName: "countyTotal",
        title: "通勤分析",
        averageDistance: 0,
        commuterDistanceRank: 0,
        show: true,
        chart: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          color: COLORS
        }, [], {
          series: [{
            center: ["42%", "50%"],
            radius: ["63%", "80%"]
          }]
        })
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      PieChart,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.commuting.init,
        streetName: state => state.cityInfo.streetName,
      }),
      ...mapGetters(["streetCommutingItem", "streetCommutingOfCounty"]),
      childrenNum: function() {
        return this.streetCommutingOfCounty.length;
      }
    },
    watch: {
      streetName: function() {
        this.formatData(this.streetCommutingItem);
        this.getRanking(this.streetCommutingOfCounty);
      },
      streetCommutingItem: function() {
        this.formatData(this.streetCommutingItem);
      },
      streetCommutingOfCounty: function() {
        this.getRanking(this.streetCommutingOfCounty);
      },
    },
    mounted() {
      if (this.init === true || Object.keys(this.streetCommutingItem).length > 0) {
        this.initData();
      }
    },
    methods: {
      getRanking(data) {
        data.sort(function(a, b) {
          return b.averageDistance - a.averageDistance
        });
        const streetName = this.streetName;
        const that = this;
        data.map((item, index) => {
          if (item.name === streetName) {
            this.commuterDistanceRank = index + 1;
          }
        })
      },
      initData() {
        this.formatData(this.streetCommutingItem);
      },
      formatData(data = {}) {
        let dataList = [];
        if (Object.keys(data).length > 1) {
          this.averageDistance = data.averageDistance;
          const _data = convertObjectData(data, {
            nameKeys: ["aName", "bName", "cName", "dName", "eName"],
            valueKeys: ["aRate", "bRate", "cRate", "dRate", "eRate"]
          });
          dataList.push(_data);
          this.chart.config.color = this.colors;
          this.show = true;
          this.chart.data = dataList;
        } else {
          dataList = Array(1).fill({
            name1: "",
            value1: 10,
            label: ""
          });
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.chart.data = dataList;
          this.show = false;
        }
      }
    }
  };
</script>

<style module lang='less'>
  @import "./countyTotal.less";
</style>
