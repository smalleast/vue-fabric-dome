<template>
  <el-tooltip effect="dark" :content="SK[name].label" placement="bottom-start" class="short-key-button">
    <i class="iconfont" :class="{[icon]: true}" v-shortkey="SK[name].key" @shortkey="$emit('click')" @click="$emit('click')"></i>
  </el-tooltip>
</template>

<script>
import SK from '@/constants/shortkey'

export default {
  props: ['type', 'name', 'icon'],

  data () {
    return {
      SK
    }
  }
}
</script>
