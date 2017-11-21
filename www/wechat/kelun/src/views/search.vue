<template>
    <div class="container">
        <div class="have-the-goods-container">
            <div class="yaohuo">
                <div class="form-box clearfix">
                    <div class="form-input-item">
                        <input type="text" class="changeui-input" v-model.trim="val" placeholder="请输入货单号/订单单号">
                        <a href="javascript:;" @click="search" class="weui-btn vl-m weui-btn_primary changeui-weui-btn_primary"
                           style="width:24%; margin-left: 6px; display:inline-block;height: 2rem;line-height: 2rem;bottom: 0px">搜索</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'vux';
    import { consign } from '@/services/api';
    import store from '@/store';

    export default {
        components: {
            Toast,
        },
        data() {
            return {
                val: '',
            };
        },
        mounted() {
            window.document.title = '查货';
        },
        methods: {
            check() {
                if (!this.val) {
                    this.$vux.toast.show({
                        type: 'text',
                        width: '16em',
                        text: '货单号或订单号不能为空'
                    });
                    return false;
                }
                else {
                    return true;
                }
            },
            async search() {
                if (this.check()) {
                    let type = this.val.substr(0, 2).toLowerCase();
                    // 5a 开头为货单号,否则订单号
                    if ('5a' === type ||'so' === type) {
                        const orderList = await consign.erpOrderList({ goods_code: this.val, exact: 'exact' });
                        if (orderList.data.result.length === 0) {
                            this.$vux.toast.show({
                                type: 'text',
                                width: '14em',
                                text: '要货单号有误或未生效'
                            });
                            return false;
                        } else {
                            store.commit('UPDATE_ORDER_LIST', orderList.data.result );
                            this.$router.push({
                                name: 'orderList',
                                query: {
                                },
                            });
                        }

                    }
                    else {
                        const traceData = await consign.getOrderTrace({ order_code: this.val });
                        if (!traceData.data) {
                            this.$vux.toast.show({
                                type: 'text',
                                width: '16em',
                                text: '单号有误或生产基地未启票'
                            });
                            return false;
                        }
                        store.commit('UPDATE_TRACK_DATA', traceData.data || {});
                        this.$router.push({
                            name: 'orderTrackDetail',
                            params: {
                                ordercode: traceData.data.order_code,
                            },
                            query: {
                            },
                        });
                    }
                }
            },
        },
    };
</script>
<style lang="less" scoped>
    .container {
        background: #fff;
    }
    .weui-btn_primary {
        background-color: #125DC7;
        border: 1px solid #125DC7;
    }
    .form-box {
        box-shadow: none;
    }
    .form-input-item{
        display: flex;
        align-items: center;
    }
</style>
