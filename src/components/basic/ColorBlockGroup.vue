<template>
  <div class="color-block-group" role="group">
    <slot></slot>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'ColorBlockGroup',

  componentName: 'ColorBlockGroup',

  mixins: [Emitter],

  inject: {
    elFormItem: {
      default: ''
    }
  },

  props: {
    value: {}
  }
}
</script>
