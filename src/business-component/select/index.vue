<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-countySelect`]">
      <span
        :class="$style[`${clsPrefix}${clsName}-county`]"
        @click="selectcounty(countyflug)"
      >{{currentCounty}}</span>
      <div :class="$style[`${clsPrefix}${clsName}-countyList`]" v-show="countyflug">
        <input 
        placeholder='请输入区县名称' ref='searchCounty'  @input="searchCounty"
        :class="[$style[`${clsPrefix}${clsName}-listItem`],$style[`${clsPrefix}${clsName}-text`]]"
        />
        <div
          :class="[currentCounty === county.name ? $style[`${clsPrefix}${clsName}-active`] : '',$style[`${clsPrefix}${clsName}-listItem`]]"
          v-for="(county,index) in countyList"
          :key="index"
          @click="changeCounty(county)"
        >{{county.name}}</div>
        <div
         :class="$style[`${clsPrefix}${clsName}-listItem`]"
         v-show="countyList.length===0"
        >
        没有搜索到相关信息
        </div>
      </div>
    </div>
    <div :class="$style[`${clsPrefix}${clsName}-countySelect`]">
      <span
        :class="$style[`${clsPrefix}${clsName}-county`]"
        @click="selectstreet(streetflug)"
      >{{currentStreet}}</span>
      <div :class="$style[`${clsPrefix}${clsName}-countyList`]" v-show="streetflug">
        <input 
        placeholder='请输入街道名称' ref='search' @input="changeInput"
        :class="[$style[`${clsPrefix}${clsName}-listItem`],$style[`${clsPrefix}${clsName}-text`]]"
        />
        <div
          :class="[$style[`${clsPrefix}${clsName}-listItem`],currentStreet === street.name ? $style[`${clsPrefix}${clsName}-active`] : '']"
          v-for="(street,index) in resultList"
          :key="index"
          @click="changeStreet(street)"
        >{{street.name}}</div>
        <div
         :class="$style[`${clsPrefix}${clsName}-listItem`]"
         v-show="resultList.length===0"
        >
        没有搜索到相关信息
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clsMixin from "@/business-component/mixins/clsMixin.js";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  props: {
    seletList: {
      type: Array,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      clsName: "select",
      currentCounty: "",
      currentCountyCode: 0,
      currentStreet: "",
      currentStreetCode: 0,
      countyflug: false,
      streetflug: false,
      streetList: [],
      countyList: [],
      resultList: [],
      allCountyList:[]
    };
  },
  computed: {
    ...mapState({
      countyName: state => state.cityInfo.countyName,
      streetName: state => state.cityInfo.streetName
    })
  },
  watch: {
    countyName() {
      this.setcount(this.countyName);
    },
    streetName() {
      this.setstreet(this.streetName);
    },
    seletList() {
      this.formateStreetData(this.seletList);
    }
  },
  methods: {
    /**
     * 查询街道
     */
    searchCounty(dom){
      const search = this.$refs.searchCounty.value;
      if(search){
        const list = this.allCountyList.filter(item => {
          return item.name.indexOf(search) !== -1;
       });
      this.countyList = list;
      }else{
        this.countyList = this.allCountyList;
      }
    },
    changeInput(a, val) {
      const search = this.$refs.search.value;
      if(search){
        const list = this.streetList.filter(item => {
          return item.name.indexOf(search) !== -1;
       });
      this.resultList = list;
      }else{
        this.resultList = this.streetList;
      }
    },
    setcount(count) {
      this.currentCounty = count;
    },
    setstreet(street) {
      this.currentStreet = street;
    },
    fiilterName(list, name) {
      let indexOf = 1;
      list.map(item => {
        if (item.name === name) {
          indexOf = 0;
        }
      });
      return indexOf;
    },
    formateStreetData(data) {
      const dataList = [];
      data.map(item => {
        if (this.fiilterName(dataList, item.properties.district)) {
          dataList.push({
            name: item.properties.district,
            code: item.properties.code_district,
            child: []
          });
        }
      });
      dataList.map(target => {
        data.map(item => {
          if (target.name === item.properties.district) {
            target.child.push({
              name: item.properties.street,
              code: item.properties.code_street
            });
          }
        });
      });
      this.countyList = dataList;
      this.allCountyList=JSON.parse(JSON.stringify(dataList));
      if (this.countyName) {
        const item = dataList.find(item => {
          return item.name === this.countyName;
        });
        this.streetList = item.child;
        this.resultList = item.child;
      }
    },
    selectcounty(flug) {
      this.countyflug = !flug;
    },
    selectstreet(flug) {
      if (this.streetList.length > 0) {
        this.streetflug = !flug;
        this.$refs.search.value = "";
        this.resultList = this.streetList;
      }
    },
    changeCounty(county) {
      this.currentCounty = county.name;
      this.currentCountyCode = county.code;
      this.countyflug = !this.countyflug;
      this.streetList = county.child;
      this.resultList = county.child;
      this.$emit("changeCounty", {
        countyCode: county.code,
        countyName: county.name
      });
      this.changeStreet(county.child[0]);
    },
    changeStreet(street) {
      this.currentStreet = street.name;
      this.streetflug = false;
      const currentCountyCode = this.currentCountyCode;
      const currentCounty = this.currentCounty;
      this.$emit("changeCurrentStreet", {
        countyCode: currentCountyCode,
        countyName: currentCounty,
        streetCode: street.code,
        streetName: street.name
      });
    }
  },
  mounted() {
    if (this.countyName) {
      this.setcount(this.countyName);
    }
    if (this.streetName) {
      this.setstreet(this.streetName);
    }
  },
  mixins: [clsMixin]
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
