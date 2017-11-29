<template>
    <div class="have-the-goods-container">
        <div class="changeui-weui-panel bid-car-detail-container orderlist order-track-detail">
            <div class="changeui-list-title">
                订单号:{{ detail.order_code }}
            </div>
            <div class="changeui-signle-line g-line-item"></div>

            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">发货方</span>
                <span class="single-right-item item">{{ detail.from_name }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">出发地</span>
                <span class="single-right-item-3 item">{{ detail.fromlocation }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">目的地</span>
                <span class="single-right-item item">{{ detail.tolocation }}</span>
            </div>
            <div class="changeui-list-inner-item single">
                <span class="text-right text-right-item item">收货方</span>
                <span class="single-right-item item">{{ detail.to_name }}</span>
            </div>
            <div class="changeui-list-inner-item single" style="position: relative">
                <span class="text-right text-right-item item">件数</span>
                <span class="single-right-item item">{{ detail.quality }}</span>
                <a @click="getDetail(detail.id)" style="    text-align: center;
    height: 25px;
    line-height: 25px;
    width: 54px;
    border-radius: 4px;
    background: #005ec2;
    color: #fff;
    font-size: 12px;
    position: absolute;
    right: 20px;
    top: 0;">详情</a>
            </div>
        </div>
        <div class="times-wrap">
            <div class="times">
                <ul>
                    <b class="head-mask"></b>
                    <li>
                        <b ></b>
                        <span class="title" >计划审批</span>
                        <p ><span class="time">{{ detail.shenpi }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b :class="{act:detail.status === null}"></b>
                        <span class="title" :class="{act:detail.status === null}">基地起票</span>
                        <p><span class="time">{{ detail.qipiao }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b :class="{act:detail.status === '1'||detail.status === '2'||detail.status === '3'}"></b>
                        <span class="title" :class="{act:detail.status === '1'||detail.status === '2'||detail.status === '3'}">调车中</span>
                        <p><span class="time">{{ detail.diaoche }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b :class="{act:detail.status === '4'}"></b>
                        <span class="title" :class="{act:detail.status === '4'}">定车</span><span class="title act" v-if="detail.carnum&&detail.driver_name&&detail.driver_phone">{{ detail.carnum }}, {{ detail.driver_name }}, <a
                        :href="`tel:${detail.driver_phone}`" style="color: #125DC7">{{ detail.driver_phone }}</a></span>
                        <p><span class="time">{{ detail.dispatch_time }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b :class="{act:detail.status === '6'}"></b>
                        <span class="title" :class="{act:detail.status === '6'}">进厂装车</span>
                        <p><span class="time">{{ detail.arrivewh_time }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b ></b>
                        <span class="title" >出厂</span>
                        <p><span class="time">{{ detail.leavewh_time }}</span></p>
                        <i></i>
                    </li>
                    <li>
                        <b :class="{act:detail.status === '7'}"></b>
                        <div class="zaitu" >
                            <span class="title" :class="{act:detail.status === '7'}">在途</span>
                            <x-button mini :disabled="showLoading"
                                     @click.native="gotoMap(detail)"
                                     v-if="detail.status === '7'||detail.status === '8'">车辆追踪</x-button>
                        </div>
                        <!--<p><span class="time">{{ detail.quality }}</span></p>-->
                        <i ></i>
                    </li>
                    <li class="none-border">
                        <b :class="{act:detail.status === '8'}"></b>
                        <span class="title" :class="{act:detail.status === '8'}">运抵</span>
                        <p><span class="time">{{ detail.arrival_date }}</span></p>
                        <i></i>
                    </li>
                    <b class="tail-mask"></b>
                </ul>
            </div>
        </div>
        <alert v-model="show" title="商品明细">
            <div class="detail_wrap">
                <div v-for="content in contents" style="margin-bottom: 10px">
                    <p>{{content.serial}} {{content.specification}}</p>
                    <p>{{content.product_name}} {{content.quality}}{{content.unit_name}}</p>
                </div>
            </div>
        </alert>
    </div>
</template>
<script>
    import { XInput, XButton, Alert } from 'vux';
    import { login, consign } from '@/services/api';
    import store from '@/store';

    export default {
        components: {
            XInput,
            XButton,
            Alert,
        },
        data() {
            return {
                detail: {},
                username: '',
                keyword: '',
                contents: [],
                showLoading: false,
                show: false,
            };
        },
        activated() {
            this.getTrackData(this.$route.params.ordercode);
        },
        mounted() {
        },
        methods: {
            async getDetail(id) {
                const d = await consign.getDetail({ order_id: id });
                this.contents = d.data.data;
                this.show = true;
            },
            async getTrackData(code) {
                const d = await consign.getOrderTrace({ order_code: code });
                this.detail = d.data;
            },
            async doLogin() {
                await login();
                this.$router.replace({ path: this.$route.query.redirect });
            },
            async gotoMap(detail) {
                this.showLoading = true;
                const d = await consign.getDingWei({shipment_id:detail.shipment_id,shipment_method:detail.shipment_method});
                store.commit('UPDATE_TRACK_DATA', d.data || {});
                localStorage.setItem('mapData', JSON.stringify(d.data));
                this.showLoading = false;
                this.$router.push({
                    name: 'map',
                    params: {
                        orderid: detail.id,
                    },
                    query: {
                        time1: detail.time1,
                        time2: detail.time2,
                    },
                }, 600);
            },
        },
    };
</script>
<style lang="less" scoped>
    .detail_wrap{
        max-height: 120px;
        overflow-y: auto;
    }
    .login-form {
        margin: 10px 0;

        &__btn {
            height: 44px;
            font-size: 16px;
            background: @C1;
        }
    }

    .btn-box {
        margin: 30px 15px;
    }
    .zaitu{
        display: flex;
        justify-content: space-between;
        .weui-btn_mini{
            text-align: center;
            height: 25px;
            line-height: 25px;
            border-radius: 4px;
            margin-right: 10px;
            background: #005ec2;
            color: #fff;
            font-size: 12px;
        }
    }
</style>
