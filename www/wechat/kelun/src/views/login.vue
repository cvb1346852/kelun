<template>
    <div class="login-form">
        <group gutter="0">
            <x-input class="vux-cell-no-border-intent"
                     title="111用户名"
                     v-model="username"
                     text-align="right"
                     placeholder="请填写用户名"></x-input>
            <x-input class="vux-cell-no-border-intent"
                     title="密码"
                     v-model="keyword"
                     text-align="right"
                     placeholder="请填写密码"></x-input>
        </group>
        <div class="btn-box">
            <x-button class="login-form__btn" type="primary" @click.native="doLogin">登录</x-button>
        </div>
    </div>
</template>
<script lang="babel">
    import { XInput, XButton } from 'vux';
    import { login } from '@/services/api';

    export default {
        components: {
            XInput,
            XButton,
        },
        data() {
            return {
                username: '',
                keyword: '',
            };
        },
        mounted() {
        },
        methods: {
            async doLogin() {
                await login();
                this.$router.replace({ path: this.$route.query.redirect });
            },
        },
    };
</script>
<style lang="less" scoped>
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
</style>
