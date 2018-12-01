<template>
  <div class="tags-category">
    <el-row>
      <el-col :span="24 / rowCount" v-for="category in data" :key="category.id"  @click.native="$emit('click', category)">
        <category-label @click="handleClick(category)" :label="category"></category-label>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CategoryLabel from '@/components/basic/CategoryLabel'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 每行显示多少个分类
    rowCount: {
      type: Number,
      default: () => 4
    }
  },

  components: {
    CategoryLabel
  },

  methods: {
    handleClick (category) {
      this.$emit('click', category)
    }
  }
}
</script>
