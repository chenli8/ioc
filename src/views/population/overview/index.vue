<template>
  <div :class="cls[`${clsContainer}`]">
    <div :class="$style[`${clsPrefix}${clsName}`]">
      <div :class="$style[`${clsPrefix}${clsName}-left`]">
        <Left></Left>
      </div>
      <div :class="$style[`${clsPrefix}${clsName}-center`]">
        <Center></Center>
      </div>
      <div :class="$style[`${clsPrefix}${clsName}-right`]">
        <Right></Right>
      </div>
    </div>
  </div>
</template>

<script>
import cls from '@/assets/css/public.less';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import Left from './left/index.vue';
import Center from './center/index.vue';
import Right from './right/index.vue';
import {
  mapMutations,
  mapState,
  mapGetters,
  mapActions
} from 'vuex';
export default {
  name: 'OverView',
  data() {
    return {
      cls,
      clsName: 'population'

    }
  },
  mixins: [clsMixin],
  components: {
    Left,
    Center,
    Right
  },
  mounted() {
    this.updatePopulationOverview().then(data => {
      // console.log('data', data);
    });
  },
  methods: {
    ...mapActions([
      'updatePopulationOverview'
    ])
  },
  computed: {
    ...mapGetters([
      'dateTimeList'
    ])
  },
  beforeDestroy() { },
}
</script>

<style module lang="less">
@import "./index.less";
</style>
