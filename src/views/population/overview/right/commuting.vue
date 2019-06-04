<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
       <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div :class="$style[`${clsPrefix}${clsName}-description`]">
        <span>平均通勤距离</span>
        <span :class="$style[`${clsPrefix}${clsName}-num`]">{{averageDistance}}</span>
        <span :class="$style[`${clsPrefix}${clsName}-unit`]">公里</span>
        <span :class="$style[`${clsPrefix}${clsName}-ranking`]">排名</span>
        <span :class="$style[`${clsPrefix}${clsName}-ranking-num`]">{{commuterDistanceRank}}/</span>
        <span :class="$style[`${clsPrefix}${clsName}-ranking-count`]">{{childrenNum||''}}</span>
      </div>
      <PieChart
        :config="chart.config"
        :data="chart.data"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></PieChart>
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
  mapMutations,
  mapState,
  mapGetters,
  mapActions
} from 'vuex';
import hexToRgba from "@/lib/hexToRgba.js";
import clsMixin from '@/business-component/mixins/clsMixin.js';
import { COLORS2, BLUECOLORS } from '@/business-component/chart/chart.config.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import PieChart from '@/business-component/chart/pieChart.vue';
import BorderBg from '@/business-component/borderBg/index.vue';
import { merge, createChartTemp, toFixed, convertObjectData } from '@/lib/util.js';
export default {
  data() {
    let COLORS = [];
    COLORS2.forEach((item) => {
      COLORS.push(item, item);
    });

    return {
      colors: COLORS,
      clsName: 'commuting',
      title: '人口通勤分析',
      averageDistance: '',
      commuterDistanceRank: '',
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
            center: ['42%', '50%'],
            radius: ['63%', '80%'],
          }]
        })
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    PieChart,
    BorderBg
  },
  computed: {
    ...mapState({
      init: state => state.populationOverview.init,
      countyName: state => state.cityInfo.countyName,
      childrenNum: state => state.cityInfo.childrenNum
    }),
    ...mapGetters({
      countyCommuting: 'countyCommutingItem'
    })
  },
  watch: {
    countyCommuting: function () {
      this.formatData(this.countyCommuting);
    }
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.countyCommuting);
    },
    formatData(data = {}) {
      let dataList = [];
      let averageDistance = '';
      let commuterDistanceRank = '';
      if (Object.keys(data).length > -1) {
        averageDistance = data.averageDistance;
        commuterDistanceRank = data.commuterDistanceRank;
        const _data = convertObjectData(data, { nameKeys: ['aName', 'bName', 'cName', 'dName', 'eName'], valueKeys: ['aRate', 'bRate', 'cRate', 'dRate', 'eRate'] });
        dataList.push(_data);
        this.averageDistance = averageDistance;
        this.commuterDistanceRank = commuterDistanceRank;
        this.chart.data = dataList;
        this.chart.config.color = this.colors;
        this.show = true;
      } else {
        dataList = Array(1).fill({
          name1: '',
          value1: 10,
          label: ''
        });
        this.chart.config.color = [
          hexToRgba(BLUECOLORS[0], 0.3),
          hexToRgba(BLUECOLORS[1], 0.3)
        ];
        this.averageDistance = 0;
        this.commuterDistanceRank = 0;
        this.chart.data = dataList;
        this.show = false;
      }

    }
  }
}
</script>
<style module lang='less'>
@import "./commuting.less";
</style>
