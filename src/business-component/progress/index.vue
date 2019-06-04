<template>
    <div :class="$style[`${clsPrefix}${clsName}`]">
        <div :class="$style[`${clsPrefix}${clsName}-percent`]" 
             :style="'width:'+clientWidth+'%'"
        ></div>
    </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import {toFixed} from '@/lib/util.js';
export default {
 props:{
  percent:{
      type:Number,
      default:0
  },
  progressMax:{
      type:Number,
      default:0
  }
 },
 data(){
     return{
        clsName:'progress',
        clientWidth:0,
     }
 },
 watch: {
   percent:function(){
       this.formatWidth()
   }  
 }
 ,
 methods:{
  formatWidth(){
    //  console.log(this.percent,'this.percent');
    //  console.log(this.progressMax,'this.progressMax') 
    //  console.log((this.percent/this.progressMax)*100,'this.percent/this.progressMax')
     this.clientWidth=((this.percent/this.progressMax)*100)||0;
  }
 },
 mixins:[clsMixin],
 mounted () {
     this.formatWidth()
 }
}
</script>

<style module lang='less'>
@import './index.less';
</style>
