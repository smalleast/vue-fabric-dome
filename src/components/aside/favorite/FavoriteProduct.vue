<template>
  <div class="favorite-product">
    <div class="search">
      <div class="collection">
        <i class="triangle-topleft" :class="{active: active.collection}"></i>
        <!-- 这里使用绝对布局 width="295" -->
        <el-popover popper-class="favorite-product-popper" placement="bottom" width="295" :visible-arrow="false" trigger="click"
         @show="onShow('collection')" @hide="onHide('collection')" v-model="active.collection">
          <div @click="active.collection = false">
            <p><el-radio :label="0" v-model="collection" @change="handleSearch">全部</el-radio></p>
            <p v-for="favorite in favorites" :key="favorite.id">
              <el-radio :label="favorite" v-model="collection" @change="handleSearch">{{favorite.name}}</el-radio>
            </p>
          </div>
          <div slot="reference" class="popover" :class="{active: active.collection}">{{currentCollectionName}}</div>
        </el-popover>
      </div>
      <div class="filters">
        <i class="triangle-topleft" :class="{active: active.filters}"></i>
        <!-- 这里使用绝对布局 width="590" :offset(left)="-148" -->
        <el-popover popper-class="favorite-product-popper el-filters-popover" placement="bottom" width="590" :offset="-148" :visible-arrow="false" trigger="click"
         @show="onShow('filters')" @hide="onHide('filters')" v-model="active.filters">
          <filter-popover :filters="filters" @ok="handleSearch" @reset="handleReset"></filter-popover>
          <div slot="reference" class="popover" :class="{active: active.filters}"><i class="iconfont icon-left_select_on"></i> 筛选</div>
        </el-popover>
      </div>
    </div>

    <!-- 单品列表，滚动加载 -->
    <product-scroll v-model="productList" @infinite="infiniteHandler" :identifier="identifier" hide-title>
      <product-card slot-scope="{ product }" :product="product" @click="handleClickProduct">
        <label slot="shadow-btn-left">
          <i class="iconfont left icon-del1" v-if="product.own" @click="handleCancelFavorite(product, '要删除单品吗？')"></i>
          <i class="iconfont left icon-star1" v-else @click="handleCancelFavorite(product, '要取消收藏单品吗？')"></i>
        </label>
      </product-card>
    </product-scroll>

    <!-- 单品详情弹窗 -->
    <transition
      enter-active-class="fadeInDown"
      leave-active-class="fadeOutUp">
      <div class="s-product-detail faster" v-if="isShowProductDetail">
        <i class="el-icon-close" @click="isShowProductDetail = false"></i>
        <product-detail :value="currentProduct"></product-detail>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { FAVORITE_TYPE } from '@/constants'
import { transformRequestOptions } from '@/util'

import GE from '@/constants/global-events'

import ProductCard from '@/components/fragment/ProductCard'
import ProductDetail from '@/components/detail/ProductDetail'
import ProductScroll from '@/components/scroll/ProductScroll'
import FilterPopover from '@/components/popover/FilterPopover'

export default {
  components: {
    ProductDetail,
    FilterPopover,
    ProductCard,
    ProductScroll
  },

  data () {
    return {
      favorites: [],
      productList: [],
      currentProduct: {},
      isShowProductDetail: false,
      search: '',
      active: { // 激活状态
        collection: false,
        filters: false
      },
      filters: {
        color: [],
        style: [],
        stockStatus: false
      },
      collection: 0,
      params: {
        pageNum: 1,
        pageSize: 16,
        type: FAVORITE_TYPE.PRODUCT
      },
      identifier: new Date()
    }
  },

  computed: {
    currentCollectionName () {
      if (this.collection.name) {
        return this.collection.name
      } else {
        return '全部'
      }
    }
  },

  mounted () {
    this.loadData()
    this.$on(GE.REFRESH_FAVORITE_PRODUCT, this.handleSearch)
  },

  methods: {
    infiniteHandler ($state) {
      this.beforeGet()

      axios.get('/designer_api/collection/collected_resources/v3', {
        params: this.params,
        paramsSerializer: params => transformRequestOptions(params)
      }).then(response => {
        this.params.pageNum++
        this.totalPage = response.data.pages
        this.productList.push(...response.data.list)
        $state.loaded()

        if (this.params.pageNum >= this.totalPage) {
          $state.complete()
        }
      })
    },

    beforeGet () {
      this.params.favoriteId = this.collection.id ? this.collection.id : undefined
      // 去除过滤器中的 id 属性，组成新数组
      this.params.colorIds = this.filters.color.map(color => color.id)
      this.params.styleIds = this.filters.style.map(style => style.id)
      // 是精选时参数值设置为 1，否则不传这个参数
      this.params.stockStatus = this.filters.stockStatus ? 1 : undefined
    },

    handleSearch () {
      this.active.filters = false
      this.params.pageNum = 1
      this.productList = []
      this.identifier = new Date()
    },

    handleReset () {
      this.filters.color = []
      this.filters.style = []
      this.filters.stockStatus = false
      this.handleSearch()
    },

    loadData () {
      axios.get('/designer_api/collection/favorite_names').then(response => {
        this.favorites = response.data
      })
    },

    handleClickProduct (product) {
      this.currentProduct = product
      this.isShowProductDetail = true
    },

    /**
     * 取消收藏，取消当前单品的在所有收藏夹中的收藏
     * 如果这个单品是自己上传的，同上
     */
    handleCancelFavorite (product, message) {
      this.$confirm(message).then(_ => {
        axios.post('/designer_api/collection/into_favorites', {
          favoriteIds: [],
          resourceId: product.id,
          type: FAVORITE_TYPE.PRODUCT
        }).then(_ => {
          this.handleSearch()
        })
      })
    },

    onShow (name) {
      this.active[name] = true
    },

    onHide (name) {
      this.active[name] = false
    },

    onActive () {
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  height: 50px;
  line-height: 50px;
  display: flex;
  border-radius: 5px;
  background-color: #fff;
  color: #757575;
  text-align: center;
  margin: 10px;
}

.collection,
.filters {
  position: relative;
  width: 50%;
  cursor: pointer;
}

.collection {
  border-right: 1px solid #eee;
}

.triangle-topleft {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 0;
  height: 0;
  border-top: 7px solid #757575;
  border-right: 7px solid transparent;
}

.triangle-topleft.active,
.popover.active {
  color: #f3a534;
  border-top-color: #f3a534;
}

i.icon-star1 {
  color: #f3a534;
}
</style>

<style lang="scss">
.favorite-product-popper.el-popper[x-placement^="bottom"] {
  margin-top: 5px;
  max-height: 470px;
  overflow: auto;
}

.el-filters-popover {
  padding: 0;
  font-size: 16px;
}
</style>
