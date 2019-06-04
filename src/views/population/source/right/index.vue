<template>
    <div :class="$style[`${clsPrefix}${clsName}`]">
        <Composition></Composition>
        <ForeignCity></ForeignCity>
        <ForeigPopular></ForeigPopular>
    </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import Composition from './composition.vue';
import ForeignCity from './foreignCity.vue';
import ForeigPopular from './foreigpopular.vue';

export default {
 data(){
     return{
      clsName:'source-home-right',
     }
 },
 mixins:[clsMixin],
 components:{Composition,ForeignCity,ForeigPopular,}
}
</script>

<style module lang='less'>
@import './index.less';
</style>
