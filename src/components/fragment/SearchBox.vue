<template>
  <div class="search-box">
    <!-- 关键词色块 -->
    <div v-if="isShowKeywordsBox" class="search-input">
      <div nowrap class="keywords" @click.self="handleFocusInput">
        <label class="keyword" v-for="word in value" :key="word" :style="{'background-color': randomColor()}">
          <label class="word">{{word}}</label>
          <i class="el-icon-close" @click="handleRemove(word)"></i>
        </label>
      </div>
      <i class="iconfont icon-chacha" @click="handleClearAll"></i>
      <i class="iconfont icon-shaixuan" :class="{active: isActive}" @click="handleClickFilter"></i>
    </div>
    <!-- 关键词输入框 -->
    <el-input suffix-icon="iconfont icon-lefttab_icon" ref="input" v-if="!isShowKeywordsBox"
     v-model="keywordsStr" placeholder="搜索单品..." @blur="handleInputBlur" @keyup.enter.native="handleInputBlur">
    </el-input>
    <!-- 过滤器 -->
    <filter-popover v-show="isShowFilterPanel" :filters="filters" @ok="$emit('ok'); isShowFilterPanel = false"
     @reset="$emit('reset');"></filter-popover>
  </div>
</template>

<script>
import { randomColor } from '@/util'
import FilterPopover from '@/components/popover/FilterPopover'

export default {
  props: ['value', 'filters'],

  components: {
    FilterPopover
  },

  data () {
    return {
      isFocusInput: false,
      isShowFilterPanel: false,
      list: {
        color: [],
        style: []
      },
      keywordsStr: ''
    }
  },

  computed: {
    isActive () {
      return this.filters.color.length > 0 || this.filters.style.length > 0
    },
    isShowKeywordsBox () {
      return !this.isFocusInput && this.value.length > 0
    }
  },

  methods: {
    randomColor,

    handleFocusInput () {
      this.isFocusInput = true
      this.$nextTick(_ => {
        this.$refs.input.focus()
      })
    },

    handleInputBlur () {
      this.isFocusInput = false

      let value = []
      if (this.keywordsStr.trim() !== '') {
        value = this.keywordsStr.trim().split(' ')
      }
      this.apply(value)
    },

    handleClearAll () {
      this.apply([])
      this.$emit('reset')
      this.isShowFilterPanel = false
    },

    handleRemove (word) {
      const value = this.value.filter(v => v !== word)
      this.apply(value)
    },

    apply (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },

    handleClickFilter () {
      this.isShowFilterPanel = !this.isShowFilterPanel
    }
  },

  watch: {
    value (value) {
      this.keywordsStr = value.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-chacha {
  cursor: pointer;
  color: #ccc;
  line-height: 50px;
  font-size: 18px;
  margin-right: 10px;
}

.icon-shaixuan {
  cursor: pointer;
  height: 50px;
  width: 50px;
  line-height: 50px;
  text-align: center;
  color: gray;
  border-left: 1px solid rgba(0, 0, 0, 0.3);
}

.icon-shaixuan:hover {
  color: #000;
}

.icon-shaixuan.active {
  background-color: #f3a534;
  color: #fff;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.search-input {
  display: flex;
  cursor: text;
  height: 50px;
  background-color: #fff;
  border-radius: 4px;
}

.keywords {
  flex: 1;
  padding: 10px 10px;
  font-size: 12px;
  color: red;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  .keyword {
    display: inline-flex;
    height: 30px;
    line-height: 30px;
    color: #fff;
    border-radius: 4px;
    margin-right: 10px;
    background-color: rgb(175, 101, 178);
  }

  .word {
    padding: 0 12px;
  }
}

.el-icon-close {
  cursor: pointer;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 18px;
  padding: 0 3px;
  line-height: 30px;
}

.filter-popover {
  margin-top: 5px;
}
</style>

<style lang="scss">
.search-box {
  .el-input,
  .el-input__inner {
    font-size: 16px;
    height: 50px;
  }
  .el-input__icon {
    font-size: 22px;
    line-height: 50px;
    margin-right: 10px;
  }
  // 清除 el-input focus 效果
  .el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
</style>
