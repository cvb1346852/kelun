<template>
    <div id="app" style="height:100%;">
        <view-box ref="viewBox" body-padding-bottom="0">
            <transition :name="transitionName">
                <keep-alive>
                    <router-view class="router-view"></router-view>
                </keep-alive>
            </transition>

            <!-- 非手机管车需要以下 -->
            <!--<page-loading block></page-loading>-->
        </view-box>
    </div>
</template>

<script>
//    import { mapState } from 'vuex';
    import { TransferDom, ViewBox } from 'vux';
    // import PageLoading from '@/components/PageLoading';

    export default {
        name: 'app',
        directives: {
            TransferDom,
        },
        components: {
            ViewBox,
            // PageLoading,
        },
        computed: {
//            ...mapState({
//                direction: state => state.page.direction,
//            }),
            transitionName() {
                if (this.direction) {
                    return `vux-pop-${this.direction === 'forward' ? 'in' : 'out'}`;
                }
            },
        },
    };
</script>

<style lang="less">
    @import "./assets/index";
    .vux-pop-out-enter-active,
    .vux-pop-out-leave-active,
    .vux-pop-in-enter-active,
    .vux-pop-in-leave-active {
        will-change: transform;
        transition: all 500ms;
        height: 100%;
        top: 0;
        position: absolute;
        backface-visibility: hidden;
        perspective: 1000;

        + .router-view {
            position: relative;
            width: 100%;
            height: 100%;
            top: 0;
            background: @C8;
            z-index: 1;
        }
    }
    .vux-pop-out-enter {
        /*opacity: 0;*/
        transform: translate3d(-100%, 0, 0);
    }
    .vux-pop-out-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
        transition-delay: 1s;
    }
    .vux-pop-in-enter {
        /*opacity: 0;*/
        transform: translate3d(100%, 0, 0);
    }
    .vux-pop-in-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
        transition-delay: 1s;
    }
</style>
