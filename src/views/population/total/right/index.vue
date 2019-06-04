<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
      <CountyTotal></CountyTotal>
      <PermanentTrend></PermanentTrend>
      <ResidentTrend></ResidentTrend>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import CountyTotal from './countyTotal.vue';
import PermanentTrend from './permanentTrend.vue';
import ResidentTrend from './residentTrend.vue';
export default {
  data() {
    return {
      clsName: 'population-right-con'
    }
  },
  mixins: [clsMixin],
  components: { CountyTotal,PermanentTrend,ResidentTrend },
  mounted() { },
  methods: {}
}
</script>

<style module lang="less">
@import "./index.less";
</style>
