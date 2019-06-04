<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
      <PopulationAnalysis></PopulationAnalysis>
      <PopulationDistribution></PopulationDistribution>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import PopulationDistribution from './populationDistribution.vue';
import PopulationAnalysis from './populationAnalysis.vue';
export default {
  data() {
    return {
      clsName: 'population-center-con'
    }
  },
  mixins: [clsMixin],
  components: { PopulationAnalysis ,PopulationDistribution },
  mounted() { },
  methods: {}
}
</script>

<style module lang="less">
@import "./index.less";
</style>
