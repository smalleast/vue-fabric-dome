<template>
  <el-form ref="form">
    <el-form-item>
      <el-input v-model="value.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-select v-model="select.style" placeholder="风格" @change="handleChangeSelectStyle">
            <el-option v-for="item in styleList" :key="item.id" :label="item.label" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select v-model="select.scene" placeholder="场景" @change="handleChangeSelectScene">
            <el-option v-for="item in sceneList" :key="item.id" :label="item.label" :value="item"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-input type="textarea" v-model="value.remark" rows="5" maxlength="100" placeholder="请填写描述，最多输入100字"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { dictionary } from '@/util'

export default {
  props: ['value'],
  data () {
    return {
      select: {
        style: {},
        scene: {}
      },
      sceneList: [],
      styleList: []
    }
  },

  mounted () {
    dictionary('roomType').then(response => {
      this.sceneList = response.data
    })
    dictionary('style').then(response => {
      this.styleList = response.data
    })
  },

  methods: {
    handleChangeSelectStyle (style) {
      this.$set(this.value, 'style', style.label)
      this.$set(this.value, 'styleId', style.id)
    },

    handleChangeSelectScene (scene) {
      this.$set(this.value, 'scene', scene.label)
      this.$set(this.value, 'sceneId', scene.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 240px;
  padding: 10px;
}
</style>
