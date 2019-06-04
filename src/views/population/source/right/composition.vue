<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-sitemap`]" v-for="(chartData,index) in citySourceData" :key="index">
          <pieChartTip :chartData="chartData"></pieChartTip>
        </div>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import pieChartTip from '@/business-component/pieChartTip/index.vue';
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: 'composition',
        title: '全市人口来源地构成',
        citySourceData: []
      }
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      pieChartTip,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.populationSource.init,
        cityPopulationSource: state => state.populationSource.cityPopulationSource
      })
    },
    watch: {
      cityPopulationSource: function() {
        this.formateData(this.cityPopulationSource)
      }
    },
    mounted() {
      if (this.init === true || Object.values(this.cityPopulationSource).length > 0) {
        this.formateData(this.cityPopulationSource);
      }
    },
    methods: {
      formateData(data = {}) {
        if (Object.values(data).length > 0) {
          const dataList = [{
              'name1': '本地',
              'value1': data.localRate,
              'name2': '外来',
              'value2': data.inflowRate
            },
            {
              'name1': '省内外来',
              'value1': data.inflowLocalRate,
              'name2': '省外外来',
              'value2': data.inflowExternalRate
            },
          ];
          this.citySourceData = dataList;
        }
      }
    }
  }
</script>

<style module lang='less'>
  @import "./composition.less";
</style>
