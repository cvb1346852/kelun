<template>
    <div>
        <div class="vux-demo">
            <img class="logo" src="../assets/vux_logo.png">
        </div>
        <div style="height:44px;">
            <sticky scroll-box="vux_view_box_body" :offset="0" :check-sticky-support="true">
                <div>哈哈呵呵</div>
            </sticky>
        </div>
        <cell title="title" value="value" v-for="i in 20" key="i">
            {{ i }}
        </cell>
        <affix scroll-box="vux_view_box_body" :offset-bottom="25">
            已上映
        </affix>
        <cell title="title" value="value" v-for="i in 10" key="i">
            {{ i }}
        </cell>
        <affix scroll-box="vux_view_box_body" :offset-bottom="0">
            已上映
        </affix>

        <cell title="title" value="value" v-for="i in 10" key="i">
            {{ i }}
        </cell>
    </div>
</template>

<script lang="babel">
    import { Group, Cell, Sticky } from 'vux';
    import Affix from '@/components/Affix';
    import { execNative } from '@/services/utils';

    export default {
        components: {
            Group,
            Cell,
            Sticky,
            Affix,
        },
        data() {
            return {
                // note: changing this line won't causes changes
                // with hot-reload because the reloaded component
                // preserves its current state and we are modifying
                // its initial state.
                msg: 'Hello World!',
            };
        },
        mounted() {
            execNative('initTopbar', {
                type: 0,
                backCallbackFunc() {
                    // alert(1);
                },
                rightBtnValue: 'aaa',
                rightBtnCallbackFunc() {
                    // alert(2);
                },
                data: {
                    a: 1,
                },
            });
        },
    };
</script>

<style lang="less">
    .vux-demo {
        text-align: center;
    }

    .logo {
        width: 100px;
        height: 100px
    }
</style>
