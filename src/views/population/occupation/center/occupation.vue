<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div
        v-for="(item, index) in dataList"
        :class="$style[`${clsPrefix}${clsName}-list`]"
        :key="index"
      >
        <Infospanning
          :title="item.title"
          :dis="item.value1"
          :trend="item.trend"
          :unit="item.value2"
          :target="index"
          :units="item.units"
        ></Infospanning>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatThousands, convertObjectData, units } from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import Infospanning from '@/business-component/Infospanning/index.vue';

export default {
  data() {
    return {
      clsName: 'occupation',
      title: '人口跨区职住',
      dataList: []
    }
  },
  mixins: [clsMixin],
  components: { HeaderBar, Infospanning },
  computed: {
    ...mapState({
      init: state => state.totalPopulation.init,
      cityPopulation: state => state.totalPopulation.cityPopulation,
    })
  },
  mounted() {
    if (this.init === true||Object.keys(this.cityPopulation).length>0) {
      this.initData();
    }
  },
  watch: {
    cityPopulation: function () {
      this.formatData(this.cityPopulation);
    }
  },
  methods: {
    initData() {
      this.formatData(this.cityPopulation);
    },
    formatData(data = {}) {
      if ((Object.keys(data)).length === 0) {
        return false;
      }
      const dataList = convertObjectData(data, [{
        title: '常住人口',
        valueKeys: ['residentPopulation', 'residentPopulationRing'],
        trend: '',
        units: units[1]
      }, {
        title: '工作人口',
        valueKeys: ['workPopulation', 'workPopulationRing'],
        trend: '',
        units: units[1]

      }, {
        title: '居住人口',
        valueKeys: ['livePopulation', 'livePopulationRing'],
        trend: '',
        units: units[1]
      }]);
      dataList.forEach((item) => {
        item.value1 = formatThousands(item.value1 || 0, 1);
        if (item.value2 >= 0) {
          item.trend = 'top';
        } else {
          item.trend = 'bottom';
        }
      })
      this.dataList = dataList;
    }
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./occupation.less";
</style>
