<template>
  <div class="search">
    <div>
      <search-box class="p10" v-model="keywords" :filters="filters" @ok="handleSearch" @reset="handleResetFilters" @change="handleSearch"></search-box>

      <!-- s: 搜索条件 -->
      <div v-show="!hideFilterCategory">
        <p class="p10 sub-title" style="margin-bottom: 11px;">单品分类</p>
        <tags-category class="p5" :data="tagCategoryList" @click="handleClickCategory" :row-count="tagCategoryRowCount"></tags-category>
      </div>
      <div class="p10" v-show="!hideFilterStyleAndColor">
        <p class="sub-title" style="margin-top: 11px;">风格分类</p>
        <tags-style :data="styles" @click="handleClickTag"></tags-style>
      </div>
      <div class="p10" v-show="!hideFilterStyleAndColor">
        <p class="sub-title" style="margin-top: 6px;">色系分类</p>
        <tags-color :data="colors" @click="handleClickTag"></tags-color>
      </div>
      <!-- e: 搜索条件 -->

      <!-- 单品列表，滚动加载 -->
      <product-scroll v-if="hideFilterStyleAndColor" v-model="productList" :identifier="identifier"
       @clickItem="handleClickProduct" @infinite="infiniteHandler"></product-scroll>
    </div>

    <!-- 单品详情弹窗 -->
    <transition
      enter-active-class="fadeInDown"
      leave-active-class="fadeOutUp">
      <div class="s-product-detail faster" v-show="isShowProductDetail">
        <i class="el-icon-close" @click="isShowProductDetail = false"></i>
        <product-detail :value="currentProduct"></product-detail>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'

import ProductCard from '@/components/fragment/ProductCard'
import TagsCategory from '@/components/fragment/TagsCategory'
import TagsStyle from '@/components/fragment/TagsStyle'
import TagsColor from '@/components/fragment/TagsColor'
import SearchBox from '@/components/fragment/SearchBox'
import ProductDetail from '@/components/detail/ProductDetail'
import ProductScroll from '@/components/scroll/ProductScroll'

import { dictionary, transformRequestOptions } from '@/util'

export default {
  props: ['isActive'],

  components: {
    ProductCard,
    TagsCategory,
    TagsStyle,
    TagsColor,
    SearchBox,
    ProductDetail,
    ProductScroll
  },

  data () {
    return {
      colors: [], // 色系
      categories: [], // 分类标签
      categoryChildren: [], // 子分类标签
      styles: [], // 风格
      productList: [], // 单品列表
      currentProduct: {}, // 当前已选择的产品
      isShowProductDetail: false, // 是否显示产品详情
      params: { // 查询参数
        keyword: undefined,
        pageNum: 1,
        pageSize: 16
      },
      keywords: [], // 搜索关键词
      filters: { // 搜索过滤器
        category: [],
        style: [],
        color: [],
        stockStatus: false // 是否精选
      },
      identifier: new Date()
    }
  },

  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    },
    isInfiniteScrollDisabled () {
      return !this.isActive || this.$store.getters.isLoading || this.isNoMoreData
    },
    tagCategoryList () {
      if (this.categoryChildren && this.categoryChildren.length > 0) {
        return this.categoryChildren
      }
      return this.categories
    },
    tagCategoryRowCount () {
      // 显示一级分类时每行3个，二级分类每行4个
      if (this.categoryChildren && this.categoryChildren.length > 0) {
        return 4
      }
      return 3
    },
    // 隐藏过滤器风格和色系，当选择了分类或风格或色系
    hideFilterStyleAndColor () {
      return this.keywords.length > 0
    },
    // 隐藏过滤器分类，当选择了风格或色系或子分类
    hideFilterCategory () {
      return this.keywords.length > 1 || (this.keywords.length > 0 && this.categoryChildren.length === 0)
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      dictionary('category').then(response => {
        this.categories = response.data
      })
      dictionary('style').then(response => {
        this.styles = response.data
      })
      dictionary('color').then(response => {
        this.colors = response.data
      })
    },

    handleClearSearchParams () {
      this.handleResetFilters()
      this.categoryChildren = []
      this.keywords = []
    },

    handleResetFilters () {
      this.filters = {
        category: [],
        style: [],
        color: [],
        stockStatus: false
      }
    },

    handleClickCategory (category) {
      this.keywords.push(category.label)
      if (category.children && category.children.length > 0) {
        this.categoryChildren = category.children
      }
      this.handleSearch()
    },

    handleClickTag (tag) {
      this.keywords.push(tag.label)
      this.handleSearch()
    },

    handleClickProduct (product) {
      this.currentProduct = product
      this.isShowProductDetail = true
    },

    handleSearch () {
      // 当关键词数量大于1时，清空子分类
      if (this.keywords.length > 1) {
        this.categoryChildren = []
      }
      // 没有关键词时，清空所有参数
      if (this.keywords.length === 0) {
        this.handleClearSearchParams()
      }
      this.params.pageNum = 1
      this.productList = []
      this.identifier = new Date()
    },

    infiniteHandler ($state) {
      if (this.$store.getters.isLoading) return

      this.beforeGet()

      axios.get('/designer_api/products', {
        params: this.params,
        paramsSerializer: params => transformRequestOptions(params)
      }).then(response => {
        this.params.pageNum++
        this.productList.push(...response.data.list)
        $state.loaded()

        if (this.params.pageNum > response.data.pages) {
          $state.complete()
        }
      }).catch(_ => {
        $state.error()
      })
    },

    beforeGet () {
      // 当没有搜索关键词时，不传 keyword 属性，传递 keyword 属性会导致无任何结果
      this.params.keyword = this.keywords.length > 0 ? this.keywords.join(' ') : undefined
      // 去除过滤器中的 id 属性，组成新数组
      this.params.colors = this.filters.color.map(color => color.id)
      this.params.styleIds = this.filters.style.map(style => style.id)
      // 是精选时参数值设置为 1，否则不传这个参数
      this.params.stockStatus = this.filters.stockStatus ? 1 : undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding-top: 50px;
  text-align: left;
}

.sub-title {
  color: #d8d8d8;
}
</style>
