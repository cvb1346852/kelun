<template>
    <div class="page">
        <box gap="10px 10px">
            <divider>单个请求</divider>
            <x-button @click.native="get1"
                      :disabled="sending1"
                      :text="sending1 ? 'Loading' : '显示Loading'">
            </x-button>
            <x-button @click.native="get2"
                      :disabled="sending2"
                      :text="sending2 ? 'Loading' : '不显示Loading'">
            </x-button>

            <divider>多个请求</divider>
            <x-button @click.native="get3">并发loading</x-button>
            <x-button @click.native="get4">串行loading</x-button>
        </box>
    </div>
</template>
<script lang="babel">
    import { XButton, Box, Divider } from 'vux';
    import { demo } from '@/services/api';

    export default {
        components: {
            XButton,
            Box,
            Divider,
        },
        data() {
            return {
                sending1: false,
                sending2: false,
            };
        },
        mounted() {
            demo.get1().then(() => {
                this.sending1 = false;
            }, () => {
                this.sending1 = false;
            });
        },
        methods: {
            get1() {
                this.sending1 = true;
                demo.get1().then(() => {
                    this.sending1 = false;
                }, () => {
                    this.sending1 = false;
                });
            },
            get2() {
                this.sending2 = true;
                demo.get2().then(() => {
                    this.sending2 = false;
                }, () => {
                    this.sending2 = false;
                });
            },
            get3() {
                demo.get1();
                demo.get1();
                demo.get1();
            },
            get4() {
                // console.log(1);
                demo.get1().then(() => {
                    // console.log(2);
                    demo.get1().then(() => {
                        // console.log(3);
                        demo.get1().then(() => {
                        });
                    });
                });
            },
        },
    };
</script>
<style lang="less">
</style>
