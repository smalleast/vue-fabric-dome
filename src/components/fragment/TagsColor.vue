<template>
  <div class="tags-color">
    <color-block v-for="color in data" :key="color.id" @click.native="$emit('click', color)" :color="color.code" :name="color.label" :disabled="true"></color-block>
  </div>
</template>

<script>
import ColorBlock from '@/components/basic/ColorBlock'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  components: {
    ColorBlock
  }
}
</script>

<style lang="scss" scoped>
.tags-color {
  display: flex;
  flex-wrap: wrap;
  justify-items: space-around;
}
</style>
