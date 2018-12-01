<template>
  <div class="workbench-aside">
    <!-- 收缩侧边栏按钮(左) -->
    <i class="folding" :class="{'el-icon-arrow-left': iconArrowLeft, 'el-icon-arrow-right': iconArrowRight}" @click="handleFolding"></i>

    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane name="search">
        <span slot="label">
          <el-tooltip effect="dark" content="搜索" placement="right">
            <i class="iconfont icon-lefttab_icon"></i>
          </el-tooltip>
        </span>
        <aside-content-transition :is-folding="isFolding">
          <search :isActive="activeName === 'search'"></search>
        </aside-content-transition>
      </el-tab-pane>
      <el-tab-pane name="favorite" lazy>
        <span slot="label">
          <el-tooltip effect="dark" content="收藏夹" placement="right">
            <i class="iconfont icon-lefttab_icon1"></i>
          </el-tooltip>
        </span>
        <aside-content-transition :is-folding="isFolding">
          <favorite ref="favorite"></favorite>
        </aside-content-transition>
      </el-tab-pane>
      <el-tab-pane name="design" lazy>
        <span slot="label">
          <el-tooltip effect="dark" content="我的设计" placement="right">
            <i class="iconfont icon-lefttab_icon_off1"></i>
          </el-tooltip>
        </span>
        <aside-content-transition :is-folding="isFolding">
          <designs ref="design"></designs>
        </aside-content-transition>
      </el-tab-pane>
      <el-tab-pane name="current" lazy>
        <span slot="label">
          <el-tooltip effect="dark" content="当前详情" placement="right">
            <i class="iconfont icon-lefttab_icon2"></i>
          </el-tooltip>
        </span>
        <aside-content-transition :is-folding="isFolding">
          <product-detail :value="currentProduct"></product-detail>
        </aside-content-transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Search from '@/components/aside/Search'
import Favorite from '@/components/aside/favorite/Favorite'
import ProductDetail from '@/components/detail/ProductDetail'
import AsideContentTransition from '@/components/aside/AsideContentTransition'
import Designs from '@/components/aside/Designs'

import GE from '@/constants/global-events'

export default {
  components: {
    Search,
    Favorite,
    ProductDetail,
    AsideContentTransition,
    Designs
  },

  data () {
    return {
      activeName: 'search',
      currentProduct: {},
      // 是否折叠侧边栏
      isFolding: false
    }
  },

  computed: {
    iconArrowLeft () {
      return !this.isFolding
    },
    iconArrowRight () {
      return this.isFolding
    }
  },

  mounted () {
    this.$on(GE.SELECTION, (product) => {
      if (product) {
        this.currentProduct = product
        this.activeName = 'current'
      }
    })
  },

  methods: {
    handleTabClick (tab) {
      if (this.isFolding) {
        // 点击菜单，如果当前菜单状态为折叠，展开它
        this.handleFolding()
      }

      const { name } = tab
      // 触发 Tab 页的 onActive 事件，用于重新加载数据
      if (this.$refs[name] && this.$refs[name].onActive) {
        this.$refs[name].onActive()
      }
    },

    handleFolding () {
      this.isFolding = !this.isFolding
      this.$nextTick(_ => {
        this.$emit(GE.FOLD_OR_UNFLOD_ASIDE, this.isFolding)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
i.folding {
  cursor: pointer;
  position: fixed;
  color: #eee;
  background-color: #41403f;
  font-size: 14px;
  padding: 10px 0;
  top: calc(50vh - (16px + 10px));
  left: 660px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 5;
}

i.folding:hover {
  color: #fff;
}

i.folding.el-icon-arrow-right {
  left: 50px;
}
</style>
