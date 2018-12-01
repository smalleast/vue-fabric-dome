<template>
  <div class="input-number">
    <i class="iconfont icon-numjian" @click="handleMinusOne"></i>
    <span>{{value}}</span>
    <i class="iconfont icon-num" @click="handlePlusOne"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: Number
  },

  methods: {
    handleMinusOne () {
      if (this.value === 1) return

      this.$emit('input', this.value - 1)
    },

    handlePlusOne () {
      this.$emit('input', this.value + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-number {
  line-height: 40px;
  display: inline-flex;
  align-items: center;

  span {
    margin: 0 20px;
  }
}

i.icon-num,
i.icon-numjian {
  color: #f3a534;
  font-size: 25px;
  cursor: pointer;
}
</style>
