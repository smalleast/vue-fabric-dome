<template>
  <div class="filter-popover">
    <div class="btn-group">
      <p class="ok">
        <el-button type="primary" size="mini" @click="$emit('ok')"> <i class="iconfont icon-icon_sucesss"></i> 确定</el-button>
      </p>
      <p>
        <el-button type="info" size="mini" @click="$emit('reset')"> <i class="iconfont icon-Updatereset"></i> 重置</el-button>
      </p>
    </div>
    <p style="margin-top: 0;">颜色</p>
    <color-block-group class="colors" v-model="filters.color">
      <color-block v-for="color in list.color" :key="color.id" :label="color" :color="color.code" :name="color.label"></color-block>
    </color-block-group>
    <p style="margin-top: 6px;">风格</p>
    <el-checkbox-group v-model="filters.style">
      <el-checkbox v-for="style in list.style" :label="style" :key="style.id">{{style.label}}</el-checkbox>
    </el-checkbox-group>
    <p style="margin-top: 6px;">是否精选</p>
    <el-checkbox v-model="filters.stockStatus">精选</el-checkbox>
  </div>
</template>

<script>
import { dictionary } from '@/util'
import ColorBlock from '@/components/basic/ColorBlock'
import ColorBlockGroup from '@/components/basic/ColorBlockGroup'

export default {
  props: {
    filters: {
      color: [],
      style: [],
      stockStatus: false
    }
  },

  data () {
    return {
      list: {
        color: [],
        style: []
      }
    }
  },

  components: {
    ColorBlock,
    ColorBlockGroup
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      dictionary('color').then(response => { this.list.color = response.data })
      dictionary('style').then(response => { this.list.style = response.data })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-popover {
  background-color: #fff;
  border-radius: 4px;
  color: #000;
  padding: 0 10px;
  padding-bottom: 20px;
  overflow: hidden;
}

.colors {
  display: flex;
  flex-wrap: wrap;
  justify-items: space-around;
}

.btn-group {
  display: flex;

  .ok {
    flex: 1;
  }

  i {
    font-size: 10px;
    margin-right: 5px;
  }
}
</style>

<style lang="scss">
.filter-popover {
  .el-checkbox {
    width: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-weight: 400;
  }
  .el-checkbox + .el-checkbox {
    margin-right: 10px;
    margin-left: 0;
  }
}
</style>
