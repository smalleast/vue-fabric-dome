<template>
  <div class="fabric-filters">
    <div class="filter">
      <span>亮度</span>
      <el-slider v-model="state.brightness" :min="-1" :max="1" :step="0.01"></el-slider>
    </div>
    <div class="filter">
      <span>对比度</span>
      <el-slider v-model="state.contrast" :min="-1" :max="1" :step="0.01"></el-slider>
    </div>
    <div class="filter">
      <span>饱和度</span>
      <el-slider v-model="state.saturation" :min="-1" :max="1" :step="0.01"></el-slider>
    </div>
    <div class="filter">
      <span>清晰度</span>
      <el-slider v-model="state.blur" :min="0" :max="1" :step="0.01"></el-slider>
    </div>
    <div class="filter">
      <span>色彩</span>
      <el-slider v-model="state.rotation" :min="-2" :max="2" :step="0.01"></el-slider>
    </div>
  </div>
</template>

<script>
import { calcFilterState } from './filter'

export default {
  props: ['value'],

  data () {
    return {
      state: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
        rotation: 0,
        opacity: 0
      }
    }
  },

  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler (val, oldVal) {
        this.state = calcFilterState(val)
      }
    },
    'state.brightness' (value) {
      this.$emit('change', 'brightness', value)
    },
    'state.contrast' (value) {
      this.$emit('change', 'contrast', value)
    },
    'state.saturation' (value) {
      this.$emit('change', 'saturation', value)
    },
    'state.blur' (value) {
      this.$emit('change', 'blur', value)
    },
    'state.rotation' (value) {
      this.$emit('change', 'rotation', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.fabric-filters {
  .filter {
    overflow: hidden;
    font-size: 12px;

    span {
      line-height: 38px;
    }
  }
}
</style>

<style lang="scss">
.fabric-filters {
  .el-slider {
    float: right;
    width: 70%;
    margin-right: 20px;
  }
}
</style>
