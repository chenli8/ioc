<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <Occupation></Occupation>
    <OverallPopulationMap></OverallPopulationMap>
    <OverallPopulationGeo></OverallPopulationGeo>
    <Demographic></Demographic>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import OverallPopulationGeo from './overallPopulationGeo.vue';
import OverallPopulationMap from './overallPopulationMap.vue';
import Demographic from './demographic.vue';
import Occupation from './occupation.vue';

export default {
  data() {
    return {
      clsName: 'population-center-con'
    }
  },
  mixins: [clsMixin],
  components: { Occupation, Demographic, OverallPopulationGeo, OverallPopulationMap },
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
