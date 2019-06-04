<template>
    <div :class="$style[`${clsPrefix}${clsName}`]">
        <BorderBg>
            <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
            <div :class="$style[`${clsPrefix}${clsName}-content`]">
                <div :class="$style[`${clsPrefix}${clsName}-sitemap`]" v-for="(chartData,index) in citySourceData" :key='index'>
                    <pieChartTip :chartData='chartData' :direction='direction' :pieChartConfig='pieChartConfig'></pieChartTip>
                </div>
            </div>
        </BorderBg>
    
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex';
    import clsMixin from '@/business-component/mixins/clsMixin.js';
    import HeaderBar from '@/business-component/headerBar/index.vue';
    import pieChartTip from '@/business-component/pieChartTip/index.vue';
    import {
        constants
    } from 'fs';
    import BorderBg from '@/business-component/borderBg/index.vue';
    export default {
        data() {
            return {
                clsName: 'residentTrend',
                title: '人口来源地构成',
                citySourceData: [],
                direction: 'column',
                pieChartConfig: {
                    series: [{
                        radius: ["55%", "80%"],
                    }]
                }
            }
        },
        computed: {
            ...mapState({
                init: state => state.populationSource.init,
                countyName: state => state.cityInfo.countyName,
                countySource: state => state.populationSource.countySource
            })
        },
        watch: {
            countySource: function() {
                this.formateData(this.countySource)
            },
            countyName: function() {
                this.formateData(this.countySource)
            },
        },
        mounted() {
            if (this.init === true || this.countySource.length > 0) {
                this.formateData(this.countySource)
            }
        },
        methods: {
            formateData(countySource = []) {
                if (countySource.length > 0 && this.countyName) {
                    const currentList = countySource.find(item => {
                        return item.name === this.countyName
                    });
                    const dataList = [{
                            'name1': '本地',
                            'value1': currentList.localRate,
                            'name2': '外来',
                            'value2': currentList.inflowRate
                        },
                        {
                            'name1': '省内外来',
                            'value1': currentList.inflowLocalRate,
                            'name2': '省外外来',
                            'value2': currentList.inflowExternalRate
                        },
                    ];
                    this.citySourceData = dataList;
                }
            }
        },
        mixins: [clsMixin],
        components: {
            HeaderBar,
            pieChartTip,
            BorderBg
        }
    }
</script>

<style module lang='less'>
    @import './residentTrend.less';
</style>
