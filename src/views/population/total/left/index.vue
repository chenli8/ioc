<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
      <CityTotal></CityTotal>
      <CountyContrast></CountyContrast>
      <CountyRanking></CountyRanking>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import CityTotal from './cityTotal.vue';
import CountyContrast from './countyContrast.vue';
import CountyRanking from './countyRanking.vue';
export default {
  data() {
    return {
      clsName: 'population-left-con'
    }
  },
  mixins: [clsMixin],
  components: { CityTotal ,CountyContrast, CountyRanking },
  mounted() { },
  methods: {}
}
</script>

<style module lang="less">
@import "./index.less";
</style>
