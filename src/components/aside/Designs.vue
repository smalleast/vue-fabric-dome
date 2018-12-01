<template>
  <div class="designs">
    <design-scroll v-model="data.list" @infinite="infiniteHandler" :identifier="identifier">
      <el-tooltip slot-scope="{ row }" effect="dark" content="添加到画布" placement="bottom-start">
        <i class="iconfont right icon-move" @click="handleClickArrow(row)"></i>
      </el-tooltip>
    </design-scroll>
  </div>
</template>

<script>
import axios from 'axios'

import GE from '@/constants/global-events'
import DesignScroll from '@/components/scroll/DesignScroll'
import DesignCard from '@/components/fragment/DesignCard'

export default {
  components: {
    DesignScroll,
    DesignCard
  },

  data () {
    return {
      data: {
        list: []
      },
      params: { // 查询参数
        pageNum: 1,
        pageSize: 16
      },
      identifier: new Date()
    }
  },

  mounted () {
    this.$on(GE.REFRESH_DESIGNS, this.onActive)
  },

  methods: {
    infiniteHandler ($state) {
      axios.get('/designer_api/board', {
        params: this.params
      }).then(response => {
        if (this.params.pageNum === 1 && response.data.list.length === 0) {
          $state.complete()
          return
        }

        this.params.pageNum++
        this.data.list.push(...response.data.list)
        $state.loaded()

        if (this.params.pageNum > response.data.pages) {
          $state.complete()
        }
      }).catch(_ => {
        $state.error()
      })
    },

    handleClickArrow (data) {
      this.$emit(GE.LOAD_CANVAS_DATA, data)
    },

    onActive () {
      this.params.pageNum = 1
      this.data.list = []
      this.identifier = new Date()
    }
  }
}
</script>
