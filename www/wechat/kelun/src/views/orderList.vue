<template>
    <div class="have-the-goods-container">
        <div class="yaohuo order-list">
            <div class="form-box clearfix">
                <div class="form-input-item">
                    <search :auto-fixed="false" v-model="val" placeholder="请输入订单单号查询"></search>
                    <!--<label>-->
                        <!--<input type="text" v-model="val" class="changeui-input">-->
                        <!--<a href="javascript:;" class="weui-btn vl-m weui-btn_primary changeui-weui-btn_primary" style="width:24%; margin-left: 6px; display:inline-block;">查询</a>-->
                    <!--</label>-->
                </div>
            </div>
        </div>

        <div class="changeui-weui-panel bid-car-detail-container orderlist"
             v-for="(item, index) in filterList(list)" :key="item.id">
            <div class="changeui-list-title">
                订单号: <span style="font-size: 12px">{{ item.order_code }}</span>
                <a class="order-track-link" @click="goTrackDetail(item.order_code)">订单跟踪详情</a>
            </div>
            <div class="changeui-signle-line g-line-item"></div>

            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">承运方</span>
                <span class="single-right-item item">{{ item.carrier_name }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">出发地</span>
                <span class="single-right-item item">{{ item.fromlocation }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">目的地</span>
                <span class="single-right-item item">{{ item.tolocation }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">收货方</span>
                <span class="single-right-item item">{{ item.to_name }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">件数</span>
                <span class="single-right-item item">{{ item.quality }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { XInput, XButton, Search } from 'vux';
    import { consign } from '@/services/api';
    import store from '@/store';

    export default {
        components: {
            XInput,
            XButton,
            Search,
        },
        data() {
            return {
                val: '',
                list: [],
                openid: '',
            };
        },
        activated() {
            this.getOrderList();
        },
        mounted() {
            this.openid = localStorage.getItem('openId');
        },
        methods: {
            gFilter(ele) {
                if (ele.order_code.indexOf(this.val) > -1) {
                    return ele;
                }
            },
            filterList(list) {
                console.log(list.filter(this.gFilter));
                return list.filter(this.gFilter);
            },
            async getOrderList() {
                if (this.$route.query.goods_code) {
                    const orderList = await consign.erpOrderList({
                        goods_code: this.$route.query.goods_code,
                        exact: 'exact',
                    });
                    this.list = orderList.data.result;
                }
                else {
                    this.list = store.state.consign.orderList || [];
                    console.log(this.list);
                }
                if (this.list.length < 1) {
                    this.$vux.toast.show({
                        type: 'text',
                        width: '17em',
                        text: '生产基地未启票，无订单信息',
                    });
                }
            },
            goTrackDetail(code) {
                this.$router.push({
                    name: 'orderTrackDetail',
                    params: {
                        ordercode: code,
                    },
                });
            },
        },
    };
</script>
<style lang="less" scoped>
    .weui-btn_primary {
        background-color: #125DC7;
        border: 1px solid #125DC7;
    }
    .order-list .vux-search-box {
        width: 100%;
    }
    .order-list {
        padding: 0 !important;
    }
    .order-list .form-input-item {
        margin: 0;
    }
</style>
<style>
    .changeui-list-title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
