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
import { mapState,mapActions } from 'vuex';
import cls from '@/assets/css/public.less';
import clsMixin from '@/business-component/mixins/clsMixin.js';
import Left from './left/index.vue';
import Center from './center/index.vue';
import Right from './right/index.vue';

export default {
  data() {
    return {
      cls,
      clsName: 'population'

    }
  },
  mixins: [clsMixin],
  components: {
    Left, Center, Right,
  },
  computed: {
    ...mapState({
      countyName: state => state.cityInfo.countyName
    })
  },
  watch:{
    'countyName':function(){
      this.updateCountyTrend();
    }
  },
  mounted() {
    this.updatePopulationStructure().then( data => console.log('updatePopulationStructure', data));
  },
  methods: {
    ...mapActions([
      'updatePopulationStructure',
      'updateCountyTrend'
    ])
  }
}
</script>
<style module lang="less">
@import "./index.less";
</style>
