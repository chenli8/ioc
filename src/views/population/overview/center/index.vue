<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <OverallPopulation></OverallPopulation>
    <Demographic></Demographic>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import OverallPopulation from './overallPopulation.vue';
import Demographic from './demographic.vue';
export default {
  data() {
    return {
      clsName: 'population-center-con'
    }
  },
  mixins: [clsMixin],
  components: { Demographic, OverallPopulation },
  mounted() {

  },
  methods: {
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./index.less";
</style>
