<template>
  <div class="tags-style">
    <span class="style" v-for="style in data" :key="style.id" @click="$emit('click', style)">{{style.label}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.style {
  cursor: pointer;
  display: inline-block;
  padding: 10px;
  color: #000;
  font-size: 13px;
  background-color: #fff;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
