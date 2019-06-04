<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <InfoBlock
        :class="$style[`${clsPrefix}${clsName}-label`]"
        v-for="(item,index) in dataList"
        :key="index"
        :number="item.value1"
        :unit="item.unit"
        :dis="item.name1"
      ></InfoBlock>
    </div>
    </BorderBg>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatThousands, convertObjectData, toFixed } from '@/lib/util.js';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import HeaderBar from '@/business-component/headerBar/index.vue';
import InfoBlock from '@/business-component/infoBlock/index.vue';
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: 'cityTotal',
      title: '全市人口总量',
      dataList: []
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    InfoBlock,
    BorderBg
  },
  computed: {
    ...mapState({
      init: state => state.totalPopulation.init,
      cityPopulation: state => state.totalPopulation.cityPopulation
    })
  },
  watch: {
    cityPopulation: function () {
      this.formatData(this.cityPopulation);
    }
  },
  mounted() {
    if (this.init === true || Object.values(this.cityPopulation).length>0) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.cityPopulation);
    },
    formatData(data = {}) {
      if ((Object.keys(data)).length > 0) {
      const dataList = convertObjectData(data, [{
        nameKeys: [],
        nameValues: ['常住人口'],
        valueKeys: ['residentPopulation'],
        valueValues: [],
        unit: '万人'
      }, {
        nameKeys: [],
        nameValues: ['人口密度'],
        valueKeys: ['populationDensity'],
        valueValues: [],
        unit: '人/km²'
      }, {
        nameKeys: [],
        nameValues: ['工作人口'],
        valueKeys: ['workPopulation'],
        valueValues: [],
        unit: '万人'
      }, {
        nameKeys: [],
        nameValues: ['居住人口'],
        valueKeys: ['livePopulation'],
        valueValues: [],
        unit: '万人'
      }]);
      dataList.forEach((item) => {
        if (item.unit.indexOf('万') > -1) {
          item.value1 = formatThousands(item.value1 || 0, 1);
        } else if (item.unit.indexOf('km²') > -1) {
          item.value1 = toFixed(item.value1 || 0, 0);
        }
      });
      this.dataList = dataList;
      }else{
        const dataList= [{
        name1: '常住人口',
        value1: '0',
        unit: '万人'
      }, {
        name1: '人口密度',
        value1: 0,
        unit: '人/km²'
      }, {
        name1: '工作人口',
        value1: 0,
        unit: '万人'
      }, {
        name1: '居住人口',
        value1: 0,
        unit: '万人'
      }];
       this.dataList = dataList;
      }
    }

  },
  beforeDestroy() { },
}
</script>

<style module lang="less">
@import "./cityTotal.less";
</style>
