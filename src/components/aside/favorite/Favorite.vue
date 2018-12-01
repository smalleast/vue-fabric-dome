<template>
  <div class="favorite">
    <el-tabs v-model="activeName">
      <el-tab-pane label="单品" name="product">
        <favorite-product ref="product"></favorite-product>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FavoriteProduct from '@/components/aside/favorite/FavoriteProduct'
import FavoriteDesign from '@/components/aside/favorite/FavoriteDesign'

export default {
  components: {
    FavoriteProduct,
    FavoriteDesign
  },

  data () {
    return {
      activeName: 'product'
    }
  },

  methods: {
    onActive () {
      if (this.$refs.product.onActive) {
        this.$refs.product.onActive()
      }
    }
  }
}
</script>

<style lang="scss">
.favorite {
  .el-tabs__item.is-top {
    background: none;
    color: #bfbfbf;
  }

  .el-tabs__item.is-top.is-active {
    color: #fff;
  }

  .el-tabs__nav-wrap::after {
    height: 0;
  }

  .el-tabs__content {
    position: static;
  }

  .el-tabs__nav {
    margin-left: 10px;
  }

  .el-tabs__active-bar {
    background-color: #f3a534;
  }
}
</style>
