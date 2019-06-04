<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
      <CityTotal></CityTotal>
      <CountyContrast></CountyContrast>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import CityTotal from './cityTotal.vue';
import CountyContrast from './countyContrast.vue';
export default {
  data() {
    return {
      clsName: 'population-left-con'
    }
  },
  mixins: [clsMixin],
  components: { CityTotal ,CountyContrast },
  mounted() { },
  methods: {}
}
</script>

<style module lang="less">
@import "./index.less";
</style>
