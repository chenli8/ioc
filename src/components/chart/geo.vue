<template>
  <div class="ui-chart-container" ref="chart"></div>
</template>
<script>
import chartMixin from './mixins/chartMixins.js';
import geoMixins from './mixins/geoMixins.js';
export default {
  data() {
    return {
    }
  },
  watch: {
    series: {
      handler() {
        this.initChart();
      },
      deep: true
    }
  },
  mixins: [chartMixin, geoMixins],
  methods: {}
}
</script>
<style>
@import "../style/chart.css";
</style>