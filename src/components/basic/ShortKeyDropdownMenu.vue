<template>
  <el-tooltip effect="dark" :content="SK[name].label" placement="right">
    <el-dropdown-item v-shortkey="SK[name].key" @shortkey.native="$emit('click', command)" :command="command">
      <slot></slot>
    </el-dropdown-item>
  </el-tooltip>
</template>

<script>
import SK from '@/constants/shortkey'

export default {
  props: ['name', 'command'],

  data () {
    return {
      SK
    }
  }
}
</script>
