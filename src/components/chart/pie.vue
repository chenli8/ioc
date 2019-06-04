<template>
  <div class="ui-chart-container" ref="chart"></div>
</template>
<script>
import chartMixin from './mixins/chartMixins.js';
import pieMixins from './mixins/pieMixins.js';
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
  mixins: [chartMixin, pieMixins],
  methods: {}
}
</script>
<style>
@import "../style/chart.css";
</style>