<template>
  <div class="product-scroll">
    <back-top></back-top>
    <p class="p10" v-if="!hideTitle">单品</p>
    <el-row class="p5">
      <el-col :span="6" v-for="product in value" :key="product.code">
        <!-- 插槽，允许父组件改变产品的渲染方式 -->
        <slot :product="product">
          <product-card :product="product" @click="handleClickProduct"></product-card>
        </slot>
      </el-col>
    </el-row>
    <infinite-loading @infinite="infiniteHandler" :identifier="identifier">
      <bottom-line slot="no-more"></bottom-line>
    </infinite-loading>
  </div>
</template>

<script>
import ProductCard from '@/components/fragment/ProductCard'
import BottomLine from '@/components/scroll/BottomLine'
import InfiniteLoading from 'vue-infinite-loading'
import BackTop from '@/components/scroll/BackTop'

export default {
  props: {
    value: Array,
    hideTitle: Boolean,
    // 类型：any
    // 默认值：+new Date()
    // 详细：该组件会在此值改变时对组件进行重设，就像重新创建了一个新的组件一样，通常用于过滤器或者选项卡的场景。
    identifier: Date
  },

  data () {
    return {
      productList: []
    }
  },

  components: {
    ProductCard,
    InfiniteLoading,
    BottomLine,
    BackTop
  },

  methods: {
    handleClickProduct (product) {
      this.$emit('clickItem', product)
    },

    infiniteHandler ($state) {
      this.$emit('infinite', $state)
    }
  }
}
</script>
