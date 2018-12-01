<template>
  <div class="canvas-ratio">
    <span>选择画板比例</span>
    <div class="ratios">
      <div class="ratio _1-ratio-1" :class="classRatioActive('$1_RATIO_1')" @click="handleClick('$1_RATIO_1')">
        <span>
          <i class="triangle-topright"></i>
          <i class="iconfont icon-icon_sucesss"></i>
        </span>
        1:1
      </div>
      <div class="ratio a3-horizontal" :class="classRatioActive('A3_HORIZONTAL')" @click="handleClick('A3_HORIZONTAL')">
        <span>
          <i class="triangle-topright"></i>
          <i class="iconfont icon-icon_sucesss"></i>
        </span>
        A3
      </div>
      <div class="ratio a3-verticality" :class="classRatioActive('A3_VERTICALITY')" @click="handleClick('A3_VERTICALITY')">
        <span>
          <i class="triangle-topright"></i>
          <i class="iconfont icon-icon_sucesss"></i>
        </span>
        A3
      </div>
      <div class="ratio _16-ratio-9" :class="classRatioActive('$16_RATIO_9')" @click="handleClick('$16_RATIO_9')">
        <span>
          <i class="triangle-topright"></i>
          <i class="iconfont icon-icon_sucesss"></i>
        </span>
        16:9
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['ratio'],

  data () {
    return {
      isChecked: true
    }
  },

  methods: {
    handleClick (paper) {
      this.$emit('click', paper)
    },

    classRatioActive (ratio) {
      return {
        active: this.ratio === ratio
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$border-radius: 4px;

.ratio {
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: $border-radius;
  border:2px solid #979797;
  text-align: center;
  margin: 0 10px;

  span {
    display: none;
  }
}

$icon-sucesss-top: -15px;
$icon-sucesss-right: -3px;
.triangle-topright {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 0;
  height: 0;
  border-top-right-radius: $border-radius;
  border: 10px solid #f3a534;
  border-color: #f3a534 #f3a534 transparent transparent;
}

i.icon-icon_sucesss {
  position: absolute;
  top: $icon-sucesss-top;
  right: $icon-sucesss-right;
  font-size: 12px;
  transform: scale(0.5);
  color: #fff;
}

.ratio.active {
  color: #F3A534;
  border-color: #F3A534;

  span {
    display: inline;
  }
}
.canvas-ratio {
  color: #757575;
}

.ratios {
  display: flex;
  align-items: center;
  margin-top: 20px;

  .a3-horizontal {
    width: 57px;
  }

  .a3-verticality {
    height: 57px;
    line-height: 57px;

    i.icon-icon_sucesss {
      top: $icon-sucesss-top - 8px;
    }
  }

  ._16-ratio-9 {
    width: 80px;
    height: 45px;
    line-height: 45px;

    i.icon-icon_sucesss {
      top: $icon-sucesss-top - 2px;
    }
  }
}
</style>
