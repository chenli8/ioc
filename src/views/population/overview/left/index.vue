<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <CityInflow></CityInflow>
    <CitySource></CitySource>
    <Composition></Composition>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import CitySource from './citySource.vue';
import CityInflow from './cityInflow.vue';
import Composition from './composition.vue';
export default {
  data() {
    return {
      clsName: 'population-left-con'
    }
  },
  mixins: [clsMixin],
  components: { CitySource, CityInflow, Composition },
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
