<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <HorizontalStackBar
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></HorizontalStackBar>
    </div>
    </BorderBg>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import { merge, createChartTemp, toFixed, convertArrayData } from '@/lib/util.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import HorizontalStackBar from '@/business-component/chart/horizontalStackBar.vue';
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: 'countyContrast',
      title: '各功能区人口总量对比',
      chart: createChartTemp({
        tooltip: {
          show: false
        }
      })
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, HorizontalStackBar,BorderBg },
  computed: {
    ...mapState({
      init: state => state.totalPopulation.init,
      countyPopulation: state => state.totalPopulation.countyPopulation
    })
  },
  watch: {
    countyPopulation: function (val, oldVal) {
      this.formatData(this.countyPopulation);
    }
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.countyPopulation);
    },
    formatData(data = []) {
      if (data.length > 0) {
        let _data = merge([], data);
        //按照(城区、郊区...)排序
        _data.sort((a, b) => {
          return a.functionCode - b.functionCode;
        });
        //计算(城区、郊区...)有多少分区,计算每个分组(常住人口、工作人口、居住人口)总数
        let group = {};
        _data.forEach((item) => {
          const code = item.functionCode;
          const name = item.functionName;
          if (!group[code]) {
            group[code] = {
              name,
              residentPopulation: 0,
              workPopulation: 0,
              livePopulation: 0,
            };
          }
          group[code].residentPopulation += item.residentPopulation || 0;
          group[code].workPopulation += item.workPopulation || 0;
          group[code].livePopulation += item.livePopulation || 0;
        });
        //计算每个指标(常住人口、工作人口、居住人口)在所有分区下的总和
        let total = { residentPopulation: 0, workPopulation: 0, livePopulation: 0 };
        for (let key in group) {
          const item = group[key];
          total.residentPopulation += (item.residentPopulation || 0);
          total.workPopulation += (item.workPopulation || 0);
          total.livePopulation += (item.livePopulation || 0);
        }
        //计算三个指标在各区的占比
        for (let key in group) {
          const item = group[key];
          item.residentPopulation = toFixed((((item.residentPopulation || 0) / (total.residentPopulation || 0)) * 100));
          item.workPopulation = toFixed((((item.workPopulation || 0) / (total.workPopulation || 0)) * 100));
          item.livePopulation = toFixed((((item.livePopulation || 0) / (total.livePopulation || 0) * 100)));
        }
        let dataList = convertArrayData(Object.values(group),
          [
            { label: '居住人口', nameKeys: ['name'], valueKeys: ['livePopulation'] },
            { label: '工作人口', nameKeys: ['name'], valueKeys: ['workPopulation'] },
            { label: '常住人口', nameKeys: ['name'], valueKeys: ['residentPopulation'] },
          ]
        );
        this.chart.data = dataList;
      }
    }
  },
  beforeDestroy() { }
}
</script>

<style module lang="less">
@import "./countyContrast.less";
</style>
