<template>
    <div :style="$style[`${clsPrefix}${clsName}`]">
     <ul 
      :class="[$style[`${clsPrefix}${clsName}-nav`],direction === 'column' ? $style[`${clsPrefix}${clsName}-rowNav`] : '' ]" 
     >
        <li 
        :class="[$style[`${clsPrefix}${clsName}-navitem`],currentNav === navItem.value ? $style[`${clsPrefix}${clsName}-navActive`] : '' , direction === 'column' ? $style[`${clsPrefix}${clsName}-rownavitem`] : '' ]" 
        v-for="(navItem,index) in navList" 
        :key='index' 
        @click="switchNavHandlefun(navItem)">
        {{navItem.name}}
        </li>
      </ul>
    </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
export default {
 props:{
  navList:{
      type:Array,
      default:()=>{}
  },
  currentNav:{
      type:Number,
      default:0
  },
  direction:{
      type:String,
      default:'row'
  }
 },
 data(){
     return{
      clsName:'subNav'
     }
 },
 mixins:[clsMixin],
 methods:{
     switchNavHandlefun(navItem){
      this.$emit('changeNav',navItem)
     }
 }
}
</script>

<style module lang='less'>
@import './subNav.less';
</style>
