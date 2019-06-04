<template>
  <div :class="cls[`${clsContainer}`]">
    <div :class="$style[`${clsPrefix}${clsName}`]">
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
import Center from './center/index.vue';
import Right from './right/index.vue';
import {
  mapMutations,
  mapState,
  mapGetters,
  mapActions
} from 'vuex';
export default {
  data() {
    return {
      cls,
      clsName: 'population'

    }
  },
  mixins: [clsMixin],
  components: {
    Center,
    Right
  },
  mounted() {
    this.updateWorkerFlow().then(data => {
      console.log(data, 'data')
    });
  },
  methods: {
    ...mapActions([
      'updateWorkerFlow'
    ])
  },
  beforeDestroy() { },
}
</script>

<style module lang="less">
@import "./index.less";
</style>
