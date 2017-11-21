<template>
    <div class="page-loading-wrapper" v-transfer-dom>
        <popup v-model="isLoading" position="top" :hide-on-blur="false" :show-mask="false">
            <div class="page-loading">
                <i class="page-loading-icon"></i>
                <span class="page-loading-text">加载中</span>
            </div>
        </popup>
        <a href="javascript:" class="page-loading-mask" v-show="isLoading && block"></a>
    </div>
</template>
<script lang="babel">
    import { mapState } from 'vuex';
    import { TransferDom, Popup } from 'vux';

    export default {
        props: {
            block: {
                type: Boolean,
                default: false,
            },
        },
        directives: {
            TransferDom,
        },
        components: {
            Popup,
        },
        computed: {
            ...mapState({
                isLoading: state => state.page.isLoading,
            }),
        },
    };
</script>
<style lang="less" scoped>
    .vux-popup-dialog {
        background: none;
    }
    .page-loading-wrapper {
        position: relative;
        z-index: 1001;
    }

    .page-loading {
        margin: 10px 15px;
        padding: 11px 5px 12px;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 4px;
        text-align: center;
        color: @C9;
        font-size: 14px;

        .page-loading-icon {
            display: inline-block;
            vertical-align: middle;
            width: 22px;
            height: 22px;
            background: url(../assets/ic_toast_loading.png);
            animation: pageLoading 1s linear infinite;
            -webkit-background-size: 100%;
            background-size: 100%;
        }
        .page-loading-text {
            display: inline-block;
            vertical-align: middle;
        }

        .page-loading-text {
            margin-left: 5px;
        }
    }

    .page-loading-mask {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
    }

    @-webkit-keyframes pageLoading {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes pageLoading {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>
