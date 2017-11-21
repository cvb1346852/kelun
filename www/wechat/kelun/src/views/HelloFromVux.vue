<template>
    <div>
        <div class="vux-demo">
            <img class="logo" src="../assets/vux_logo.png">
            <h1></h1>
        </div>
        <group title="cell demo">
            <router-link to="todo">
                <cell title="Vux" value="Cool" is-link></cell>
            </router-link>
        </group>
    </div>
</template>

<script lang="babel">
    import { Group, Cell } from 'vux';
    import { execNative } from '@/services/utils';

    export default {
        components: {
            Group,
            Cell,
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
                    // backcallback
                },
                rightBtnValue: 'aaa',
                rightBtnCallbackFunc() {
                    // rightcallback
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
