<template>
  <div class="category-label">
    <div class="name">{{label.label}}</div>
    <div class="cover" v-if="label.image" :style="{'background-image': `url(${ossFullURL(label.image.key)})`}">
    </div>
  </div>
</template>

<script>
import { ossFullURL } from '@/util'

export default {
  props: {
    label: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    ossFullURL
  }
}
</script>

<style lang="scss" scoped>
.category-label {
  cursor: pointer;
  color: #333;
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  border-radius: 5px;
  min-height: 50px;
}

.cover {
  height: 120px;
  background: url('../../assets/soft.png') no-repeat right;
  background-size: 60px;
  margin-right: 10px;
}

.name {
  position: absolute;
}
</style>
