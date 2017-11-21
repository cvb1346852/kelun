<template>
    <scroller lock-x use-pullup scrollbar-y
              @on-pullup-loading="getList"
              v-model="scrollerStatus"
              ref="scroller">

        <div class="have-the-goods-container">
            <div class="yaohuo">
                <div class="form-box clearfix">


                    <div class="select-input-box">
                        <div class="select-input">
                            <span class="changeui-input has-select weui-cell_access none-border mid-sel">
                                <select class="weui-select" name="start-select" v-model="selVal">
                                    <option value="" >全部</option>
                                    <option v-for="(item, index) in options" :key="item.code" :value="item.name">{{ item.name }}</option>
                                </select>
                                 <span class="weui-cell__ft"></span>
                            </span>
                            <div class="q">
                                <div class="q1">
                                    <group class="calendar" style="">
                                        <calendar placeholder="起始日期" title=""  v-model="begin_time" :popup-header-title="'请选择日期'"
                                                  disable-future></calendar>
                                    </group>
                                </div>
                                -
                                <div class="q2">
                                    <group  class="calendar" style="">
                                        <calendar placeholder="结束日期" title=""v-model="end_time" :popup-header-title="'请选择日期'"
                                                  disable-future></calendar>
                                    </group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-input-item">
                       <!-- <search
                                @result-click="resultClick"
                                @on-change="getResult"
                                :results="results"
                                v-model="inputVal"
                                @on-focus="onFocus"
                                @on-cancel="onCancel"
                                ref="search"></search>-->
                        <div class="search_container">
                            <div class="search">
                                <input placeholder="请输入要货单号查询" type="search" v-model="inputVal" @input="getResult">
                            </div>
                            <ul class="result" v-show="results.length > 0 && openResult">
                                <li v-for=" item in results" @click="setInputVal(item.title)">{{item.title}}</li>
                            </ul>
                        </div>
                        <a href="javascript:;" class="weui-btn vl-m weui-btn_primary changeui-weui-btn_primary query"
                           @click="getAuthOrders">查询</a>
                    </div>
                </div>
            </div>
            <div v-for="item in list" @click="goOrderList(item.order_code)" class="changeui-weui-panel bid-car-detail-container" style="position: relative">
                <div class="changeui-list-title">
                    要货单号:{{ item.order_code }}
                    <!--<span class="history-mission-item-time">2016-9-10</span>-->
                </div>
                <div class="changeui-signle-line g-line-item"></div>

                <div class="changeui-list-inner-item single">
                    <span class="text-right text-right-item item">要货详情：</span>
                    <span class="single-right-item item">{{ item.detail }}</span>
                </div>
                <div class="changeui-list-inner-item single">
                    <span class="text-right text-right-item item">收货单位：</span>
                    <span class="single-right-item item">{{ item.desc.receiving_party }}</span>
                </div>
                <div class="changeui-signle-line g-line-item"></div>

                <div class="changeui-list-inner-item single">
                    <span class="text-right text-right-item item">审核通过：</span>
                    <span class="single-right-item item">{{ item.create_time }}</span>
                </div>
                <div class="img_yin">
                   <img  :src="item.qipiao === 1? img1: img2"/>
                </div>
            </div>

        </div>
        <!--pullup slot-->
        <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up scroller-loading"
             style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="scrollerStatus.pullupStatus === 'default'"></span>
            <span class="pullup-content" v-show="scrollerStatus.pullupStatus === 'down' || scrollerStatus.pullupStatus === 'up'"
                  :class="{'rotate': scrollerStatus.pullupStatus === 'up'}">上拉加载更多</span>
            <span v-show="scrollerStatus.pullupStatus === 'loading'">
                <LoadingMoreLayer></LoadingMoreLayer>
            </span>
        </div>
    </scroller>
</template>
<script>
    import { Group, Calendar, Selector, Toast, Search, Scroller } from 'vux';
    import { consign } from '@/services/api';
    import store from '@/store';
    import LoadingMoreLayer from '@/components/vLoadingMore';
    import img1 from '../../static/img/mark_1.png';
    import img2 from '../../static/img/mark_no.png';

    const moment = require('moment');

    export default {
        components: {
            Calendar,
            Group,
            Selector,
            Toast,
            Search,
            Scroller,
            LoadingMoreLayer,
        },
        data() {
            return {
                img1,
                img2,
                begin_time: '',
                end_time: '',
                autoFixed: false,
                results: [],
                selVal: '',
                inputVal: '',
                openResult: false,
                options: [],
                pageSize: 5,
                pageNo: 1,
                isLastPage: false,
                list: [],
                fixTop: false,
                userInfo: {},
                openid: '',
                scrollerStatus: {
                    pullupStatus: 'default',
                },
            };
        },
        mounted() {
            window.document.title = '要货计划';
            this.getUserInfo();
            this.$nextTick(() => {
                this.$refs.scroller.disablePullup();
            });
        },
        activated() {
//            this.getBase();
//            this.getList();
        },
        methods: {
            setInputVal(v) {
                this.inputVal = v;
                this.openResult = false;
            },
            async getUserInfo() {
                const me = this;
                const search = window.location.search;
                let code = '';
                let openid = localStorage.getItem('openId');
                if (!openid) {
                    if (!search) {
                        openid = this.$route.query.openid;
                    } else {
                        const query = search.slice(1).split('&');
                        const queryObj = {};
                        if (query.length > 0) {
                            query.forEach((v) => {
                                const key = v.split('=')[0];
                                const val = v.split('=')[1];
                                queryObj[key] = val;
                            })
                        }
                        code = queryObj.code;
                        if (code) {
                            const data1 = await consign.getUserInfoByCode({ code });
                            me.userInfo = data1.data;
                            openid = me.openid = data1.data.openid;
                            localStorage.setItem('openId', me.openid);
                            if (data1.data.openid) {
                                if (!data1.data.phone) {
                                    window.location = window.location.origin + '/wechat/login.html?weChatType=consign&openid=' + data1.openid;
                                }
                                me.getBase();
                                me.getList();
                            } else {
                                if (openid) {
                                    me.openid = openid;
                                    const data2 = await consign.getUserInfoByOpenid({openid:me.openid});
                                    me.userInfo = data2.data;
                                    me.openid = data2.data.openid;
                                    if (!data2.data.phone) {
                                        window.location = window.location.origin + '/wechat/login.html?weChatType=consign&openid=' + data2.openid;
                                    }
                                    me.getBase();
                                    me.getList();
                                } else {
                                    me.$vux.toast.show({
                                        type: 'text',
                                        width: '12em',
                                        text: '无法取得用户信息'
                                    });
                                    return false;
                                }
                            }
                        } else {
                            me.$vux.toast.show({
                                type: 'text',
                                width: '12em',
                                text: '无法取得用户信息'
                            });
                        }

                    }
                } else {
                    me.openid = openid;
                    const data3 = await consign.getUserInfoByOpenid({openid:me.openid});
                    me.userInfo = data3.data;
                    if ( !data3.data.phone ) {
                        window.location = window.location.origin + '/wechat/login.html?weChatType=consign&openid=' + data3.openid;
                    }
                    me.getBase();
                    me.getList();
                }
            },
            async getBase() {
                const baseData = await consign.getBase({ openid: this.openid });
                console.log(baseData);
                this.options = baseData.data;
            },
            goOrderList(id) {
                this.$router.push({
                    name: 'orderList',
                    query: {
                        goods_code: id,
                    },
                });
            },
            async getList() {
                const list = await consign.getGoodsList({
                    openid: this.openid,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                });
                this.pageNo++;
                console.log(list);
                const len = list.data.data.result.length;
                if (len > 0) {
                    this.list = this.list.concat(list.data.data.result);
                } else {
                    this.$vux.toast.show({
                        type: 'text',
                        width: '16em',
                        text: '计划未审批或输入要货单号有误',
                    });
                }
                // 表明分页取数据完毕
                if (len < this.pageSize) {
                    this.isLastPage = true;
                }

                this.$nextTick(() => {
                    this.$refs.scroller.reset();

                    if (!this.isLastPage) {
                        this.$refs.scroller.enablePullup();
                    } else {
                        this.$refs.scroller.disablePullup();
                    }
                });
            },
            async getAuthOrders() {
                this.openResult = false;
                const list = await consign.getAuthOrders({
                    goods_code: this.inputVal,
                    openid: this.openid,
                    plat_form_name: this.selVal || '',
                    begin_time: this.begin_time,
                    end_time: this.end_time,
                });
                const len = list.data.data.result.length;
                if (len > 0) {
                    this.$nextTick(() => {
                        this.list = list.data.data.result;
                    });
                } else {
                    this.list = [];
                    this.$vux.toast.show({
                        type: 'text',
                        width: '16em',
                        text: '计划未审批',
                    });
                }
                // 表明分页取数据完毕
                if (len < this.pageSize) {
                    this.isLastPage = true;
                }
                this.$nextTick(() => {
                    this.$refs.scroller.reset();

                    if (!this.isLastPage) {
                        this.$refs.scroller.enablePullup();
                    } else {
                        this.$refs.scroller.disablePullup();
                    }
                });
            },
            checkDate() {
                if (this.dates.length != 2 && this.dates.length != 0) {
                    this.$vux.toast.show({
                        type: 'text',
                        width: '12em',
                        text: '只能选择起止日期',
                    });
                    return false;
                }
                if (this.dates.length === 2) {
                    const date1 = this.dates[0];
                    const date1Stamp = moment(date1).unix();
                    const date2 = this.dates[1];
                    const date2Stamp = moment(date2).unix();

                    if (date1Stamp > date2Stamp) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '开始日期不能晚于结束日期'
                        });
                        return false;
                    }
                }
                return true;
            },
            setFocus () {
                this.$refs.search.setFocus()
            },
            resultClick (item) {
                this.fixTop = false;
                this.inputVal = item.title;
            },
            async getResult () {
                console.log(this.inputVal);
                const val = this.inputVal;
                const goodsCodes = await consign.getErpGoodsCodes({
                    goods_code: val,
                    openid: this.openid,
                });
                if ( val ) {
                    this.openResult = true;
                    this.$nextTick(() => {
                        this.results = [];
                        let i = goodsCodes.data.length;
                        while (i--) {
                            this.results.push({
                                title: goodsCodes.data[i].order_code,
                                other: i
                            });
                        }
                    })
                }
                else {
                    this.results = [];
                }
            },
            onFocus () {
                this.fixTop = true;
                this.results = [];
                console.log('on focus')
            },
            onCancel () {
                this.fixTop = false;
                console.log('on cancel')
            },
        },
    };
</script>
<style>
    .img_yin img{
        width: 4.6rem;
        height: 4.6rem;
        position: absolute;
        bottom: .5rem;
        right: 1rem;
        z-index: 3;
    }
    .q{
        display: flex;
        flex: 1;
        align-items: center;
    }
    .q1,.q2{
       flex: 1;
        font-size: 12px;
    }
    .have-the-goods-container .vux-cell-value{
        font-size: 12px;
    }
    .yaohuo .select-input-box .select-input{
       display: flex;
    }
    .have-the-goods-container .weui-cells{
        margin-top: 0!important;
    }
    .have-the-goods-container .weui-cell_access .weui-cell__ft:after{
        display: none;
    }
    .have-the-goods-container .calendar:after,.have-the-goods-container .calendar:before{
        display: none;
    }
    .vux-cell-placeholder{
        font-size: 13px;
    }
</style>
<style lang="less">
    .calendar {
        .weui-cell_access .weui-cell__ft {
            position: absolute !important;
        }
        .weui-cell {
            min-height: 44px;
        }
        .weui-cell__ft {
            top: 0.7rem;
        }
        .vux-calendar:before, .weui-cells:after, .weui-cells:before {
            height: 0;
            border: none;
        }
        .weui-cells {
            max-height: 42px;
            line-height: 17px;
        }
    }
    .yaohuo {
        .wtop {
            width: 100% !important;
        }
        .vux-search-box {
            width: 73%;
            display: inline-block;
        }
        .weui-search-bar:before, .weui-search-bar:after {
            border: none;
        }
        .weui-search-bar {
            background: none;
            height: 40px;
            padding: 0;
        }
        .weui-search-bar__box .weui-icon-search {
            top: 6px;
        }
        .weui-search-bar__box {
            background: #fff;
        }
        .weui-search-bar__form {
            border-radius: 5px;
        }
        .weui-search-bar__box {
            border: 1px solid #96A1A7;
        }
        .weui-search-bar .weui-search-bar__input {
            margin-top: 3px;
        }
        .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn{
            display: none;
        }
        .weui-cells.vux-search_show {
            min-height: 100%;
        }
        .weui-search-bar .weui-search-bar__cancel-btn {
            line-height: 38px;
            padding-left: 5px;
        }
        .weui-btn {
            bottom: 3px;
        }
    }
    .form-input-item {
        display: flex;
        .search_container{
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
           .search{
               height: 39px;
               border: 1px solid #93adad;
               border-radius: 6px;
               input{
                   width: 100%;
                   height: 100%;
                   text-indent: 2em;
                   outline: none;
                   border: none;
               }
           }
            .result{
                position: absolute;
                display: flex;
                flex-direction: column;
                width: 100%;
                top: 42px;
                z-index: 10;
                li{
                    padding-left: 20px;
                    line-height: 40px;
                    font-size: 14px;
                    list-style: none;
                    border-bottom: 1px solid #eee;
                    background: #fff;

                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .weui-btn_primary {
        background-color: #125DC7;
        border: 1px solid #125DC7;
    }


    /*.calendar {
        position: absolute;
        top: -6px;
        width: 58%;
        max-height: 24px;
        left: 35%;
        z-index: 1;
        .weui-cell_access .weui-cell__ft {
            position: absolute !important;
        }
    }*/
    .query {
        width:24%;
        margin-left: 6px;
        display:inline-block;
    }
</style>
