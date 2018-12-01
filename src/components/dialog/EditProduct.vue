<template>
  <div class="dialog-edit-product">
    <div class="content">
      <i class="product-cover" :style="{'background-image': `url(${ossFullURL(value.coverFile.key)})`}"></i>
      <el-form ref="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="value.name"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="value.specs[0].size"></el-input>
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="value.specs[0].material"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="center">
      <el-button type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import { ossFullURL } from '@/util'

export default {
  props: ['value'],

  data () {
    return {
    }
  },

  methods: {
    ossFullURL
  }
}
</script>

<style lang="scss" scoped>
.tip {
  margin-left: 10px;
  color: #969696;
  font-size: 12px;
}

.content {
  display: flex;

  form {
    flex: 1;
    margin-right: 30px;
  }
}
</style>
