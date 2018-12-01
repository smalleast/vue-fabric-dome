<template>
  <div class="favorite-design">
    <el-row class="design-list">
      <el-col :span="12">
        <design-card src="http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp670f25c1dbbf4f4691500396887a952e?x-oss-process=style/w660"></design-card>
      </el-col>
      <el-col :span="12">
        <design-card src="http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp2f34d9e87def47548caf7c39bca5b6bf?x-oss-process=style/w660"></design-card>
      </el-col>
      <el-col :span="12">
        <design-card src="http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp670f25c1dbbf4f4691500396887a952e?x-oss-process=style/w660"></design-card>
      </el-col>
      <el-col :span="12">
        <design-card src="http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp2f34d9e87def47548caf7c39bca5b6bf?x-oss-process=style/w660"></design-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DesignCard from '@/components/fragment/DesignCard'

export default {
  components: {
    DesignCard
  }
}
</script>

<style lang="scss" scoped>
.favorite-design {
  padding: 0 5px;
}
</style>
