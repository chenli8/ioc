<template>
  <div class="ui-chart-container" ref="chart"></div>
</template>
<script>
import chartMixin from './mixins/chartMixins.js';
import mapMixins from './mixins/mapMixins.js';
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
  mixins: [chartMixin, mapMixins],
  methods: {}
}
</script>
<style>
@import "../style/chart.css";
</style>