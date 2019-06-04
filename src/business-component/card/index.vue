<template>
    <div>
        <div class="number-item" v-for='(item,index) in  numberList' :key='index'>
            <i class="number-spot" v-show="item.spot"></i>
            <div class="number-wrap">
                <div class="number-item-wrap" :style="'transform:translateY(-'+(item.num)* 64+'px)' ">
                    <span v-for="(nums,index)  in 10" :key='index'>{{nums-1}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            numberData: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                numberList: null
            }
        },
        watch: {
            'numberData': function() {
                this.formatSpotPosition(this.numberData)
            }
        },
        methods: {
            formatSpotPosition(number) {
                const numbers = Math.abs(number);
                const data = String(numbers).split('').map((item) => {
                    return {
                        num: item,
                        spot: false
                    }
                });
                let target = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    let a = data[i];
                    target++;
                    if (target % 3 === 0 && target !== data.length) {
                        a.spot = true;
                    }
                }
                this.numberList = data;
            },
        },
        mounted() {
            if (this.numberData) {
                this.formatSpotPosition(this.numberData);
            }
        }
    }
</script>

<style lang='less'>
    @import './index.less';
</style>
