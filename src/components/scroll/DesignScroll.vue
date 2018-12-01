<template>
  <div class="design-scroll">
    <el-row class="design-list">
      <el-col :span="12" v-for="row in value" :key="row.id">
          <design-card :value="row" @click="handleClickDesign">
            <label slot="arrow">
              <slot :row="row"></slot>
            </label>
          </design-card>
      </el-col>
    </el-row>
    <infinite-loading @infinite="infiniteHandler" :identifier="identifier">
      <bottom-line slot="no-more"></bottom-line>
      <div class="no-data" slot="no-results">
        <img src="@/assets/no-design.png">
        <p>你还没有创建设计哦，马上开始吧～～～</p>
      </div>
    </infinite-loading>

    <!-- 设计详情弹窗 -->
    <transition
      enter-active-class="fadeInDown"
      leave-active-class="fadeOutUp">
      <div class="s-design-detail faster" v-if="isShowDesignDetail">
        <i class="el-icon-close" @click="isShowDesignDetail = false"></i>
        <design-detail v-model="currentDesign"></design-detail>
      </div>
    </transition>
  </div>
</template>

<script>
import { ossFullURL } from '@/util'

import DesignCard from '@/components/fragment/DesignCard'
import DesignDetail from '@/components/detail/DesignDetail'
import BottomLine from '@/components/scroll/BottomLine'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean
    },
    // 类型：any
    // 默认值：+new Date()
    // 详细：该组件会在此值改变时对组件进行重设，就像重新创建了一个新的组件一样，通常用于过滤器或者选项卡的场景。
    identifier: Date
  },

  data () {
    return {
      isShowDesignDetail: false,
      currentDesign: {}
    }
  },

  components: {
    DesignCard,
    DesignDetail,
    BottomLine,
    InfiniteLoading
  },

  methods: {
    ossFullURL,
    infiniteHandler ($state) {
      this.$emit('infinite', $state)
    },

    handleClickDesign (design) {
      this.currentDesign = design
      this.isShowDesignDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
.design-scroll {
  padding: 10px 5px;
}

.s-design-detail {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: #41403f;
  text-align: left;
  z-index: 5;

  .el-icon-close {
    cursor: pointer;
    color: #ddd;
    font-size: 32px;
    margin: 10px 10px 0 10px;
  }

  .el-icon-close:hover {
    color: #fff;
  }
}
</style>
