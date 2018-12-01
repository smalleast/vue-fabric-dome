<template>
  <label>
    <div class="color" :class="classColor(color)" :style="{ 'background-color': color }">
      <span v-show="isChecked">
        <i class="triangle-topright"></i>
        <i class="iconfont icon-icon_sucesss"></i>
      </span>
      <span class="name">{{name}}</span>
    </div>
    <input
      v-if="trueLabel || falseLabel"
      class="el-checkbox__original"
      type="checkbox"
      aria-hidden="true"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false">
    <input
      v-else
      class="el-checkbox__original"
      type="checkbox"
      aria-hidden="true"
      :disabled="isDisabled"
      :value="label"
      :name="name"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false">
  </label>
</template>
<script>
import Emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'ColorBlock',

  mixins: [Emitter],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  componentName: 'ColorBlock',

  data () {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    }
  },

  computed: {
    model: {
      get () {
        return this.isGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel
      },

      set (val) {
        if (this.isGroup) {
          this.dispatch('ColorBlockGroup', 'input', [val])
        } else {
          this.$emit('input', val)
          this.selfModel = val
        }
      }
    },

    isChecked () {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel
      }
    },

    isGroup () {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'ColorBlockGroup') {
          parent = parent.$parent
        } else {
          // eslint-disable-next-line
          this._checkboxGroup = parent
          return true
        }
      }
      return false
    },

    store () {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value
    },

    isDisabled () {
      return this.isGroup
        ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled
        : this.disabled || (this.elForm || {}).disabled
    },

    _elFormItemSize () {
      return (this.elFormItem || {}).elFormItemSize
    },

    checkboxSize () {
      const temCheckboxSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
      return this.isGroup
        ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
        : temCheckboxSize
    }
  },

  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String, // 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系
    controls: String, // 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系
    border: Boolean,
    size: String,
    color: String
  },

  methods: {
    classColor (color) {
      return {
        white: color === '#FFFFFF' || color === '#FFFAF0',
        multicolor: color.length === 0
      }
    },
    addToStore () {
      if (
        Array.isArray(this.model) &&
        this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange (ev) {
      if (this.isLimitExceeded) return
      let value
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel
      }
      this.$emit('change', value, ev)
      this.$nextTick(() => {
        if (this.isGroup) {
          this.dispatch('ColorBlockGroup', 'change', [this._checkboxGroup.value])
        }
      })
    }
  },

  created () {
    this.checked && this.addToStore()
  },
  mounted () { // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  },

  watch: {
    value (value) {
      this.dispatch('ElFormItem', 'el.form.change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-radius: 4px;
$icon-sucesss-top: -12px;
$icon-sucesss-right: -2px;

.color {
  position: relative;
  cursor: pointer;
  width: 70px;
  height: 36px;
  line-height: 36px;
  display: block;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: $border-radius;
  text-align: center;
  font-size: 12px;

  .name {
    display: none;
    color: #fff;
  }
}

.color:hover {
  .name {
    display: inline;
  }
}

.triangle-topright {
  position: absolute;
  top: 0;
  right: 0;
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
  right: -2px;
  font-size: 12px;
  color: #fff;
  transform: scale(0.5);
}

.color.white {
  border: 1px solid #d1d1d1;

  // 减去边框宽度
  .triangle-topright {
    top: -1px;
    right: -1px;
  }
  // 减去边框宽度
  i.icon-icon_sucesss {
    top: $icon-sucesss-top - 1px;
    right: $icon-sucesss-right - 1px;
  }

  .name {
    color: #000;
  }
}

.multicolor .name {
  color: #000;
}

.color.multicolor {
  background: url("../../assets/multicolor.png") no-repeat;
  background-size: 100% 100%;
}
</style>
