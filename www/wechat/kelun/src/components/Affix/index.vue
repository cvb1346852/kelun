<template>
    <div :style="placeholderStyle" :class="{'affix-sticky': isSupportSticky}">
        <div :class="{'affix-fixed': isAffix}" :style="affixStyle">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less">
    .affix-fixed {
        position: fixed;
        z-index: 10;
    }

    .affix-sticky {
        position: sticky;
        z-index: 10;
    }
</style>
<script lang="babel">
    export default {
        name: 'Affix',
        props: {
            offsetTop: {
                type: Number,
                default: 0,
            },
            offsetBottom: {
                type: Number,
            },
            scrollBox: String,
        },
        data() {
            return {
                sbox: '',
                isTop: true,
                isAffix: false,
                isSupportSticky: (() => {
                    const userAgent = window.navigator.userAgent;
                    const ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_.]+)/);
                    return ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) >= 6);
                })(),
            };
        },
        mounted() {
            this.isTop = this.offsetBottom === undefined;

            this.$nextTick(() => {
                if (!this.isSupportSticky) {
                    this.sbox = typeof this.scrollBox === 'string'
                        ? document.getElementById(this.scrollBox)
                        : window;

                    this.handleScroll();
                    this.sbox.addEventListener('scroll', this.handleScroll);
                    this.sbox.addEventListener('resize', this.handleScroll);
                }
            });
        },
        beforeDestroy() {
            if (!this.isSupportSticky) {
                this.sbox.removeEventListener('scroll', this.handleScroll);
                this.sbox.removeEventListener('resize', this.handleScroll);
            }
        },
        computed: {
            placeholderStyle() {
                let style = null;
                if (this.isSupportSticky) {
                    style = {};
                    if (this.isTop) {
                        style.top = `${this.offsetTop}px`;
                    } else {
                        style.bottom = `${this.offsetBottom}px`;
                    }
                } else if (this.isAffix) {
                    style = {
                        width: `${this.$el.offsetWidth}px`,
                        height: `${this.$el.offsetHeight}px`,
                    };
                }
                return style;
            },
            affixStyle() {
                let style = null;
                if (this.isSupportSticky) {
                    // support sticky
                } else if (this.isAffix) {
                    style = {
                        left: `${this.$el.getBoundingClientRect().left}px`,
                        width: `${this.$el.offsetWidth}px`,
                    };
                    if (this.isTop) {
                        style.top = `${this.offsetTop}px`;
                    } else {
                        style.bottom = `${this.offsetBottom}px`;
                    }
                }
                return style;
            },
        },
        watch: {
            isAffix(val) {
                this.$emit('change', val);
            },
        },
        methods: {
            handleScroll() {
                let isAffix = false;
                const elemOffset = this.$el.getBoundingClientRect();

                if (this.isTop) {
                    if (elemOffset.top < this.offsetTop) {
                        isAffix = true;
                    }
                } else {
                    const clientH = document.documentElement.clientHeight;
                    if (clientH - elemOffset.bottom < this.offsetBottom) {
                        isAffix = true;
                    }
                }
                this.isAffix = isAffix;
            },
        },
    };
</script>
