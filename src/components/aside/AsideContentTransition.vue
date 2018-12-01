<template>
  <transition>
    <div class="content" v-show="!isFolding">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['isFolding']
}
</script>
