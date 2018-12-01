<template>
  <div class="listing min-container">
    <div>
      <i class="iconfont icon-chacha" @click="$emit('close')"></i>
    </div>
    <div class="table-wrapper">
      <div class="table-header">
        <el-row>
          <el-col :span="2" class="checkbox-col">
            <el-checkbox v-model="checkAll" :indeterminate="checkAllIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          </el-col>
          <el-col :span="4">产品图片</el-col>
          <el-col :span="4">产品信息</el-col>
          <el-col :span="8">产品规格</el-col>
          <el-col :span="3">落地参考价</el-col>
          <el-col :span="3" class="center">数量</el-col>
        </el-row>
      </div>
      <div class="table-content">
        <div class="table-row" v-for="row in value" :key="row.id">
          <el-row type="flex" align="middle">
            <el-col :span="2" class="checkbox-col">
              <el-checkbox v-model="checked[row.id]"></el-checkbox>
            </el-col>
            <el-col :span="4">
              <div class="cover-wrapper" @click="handleCheckRow(row.id)">
                <i class="cover" :style="styleCover(row)"></i>
              </div>
            </el-col>
            <el-col :span="4">
              <p>{{row.name}}</p>
              <p class="serial-number">{{row.code}}</p>
              <p class="from">{{row.own ? '来自本地上传': '来自产品库'}}</p>
            </el-col>
            <el-col :span="8">
              <el-row type="flex" align="middle" :gutter="30">
                <el-col :span="16">
                  <p>尺寸：{{spec[row.id].size}}</p>
                  <p>材质：{{spec[row.id].material}}</p>
                </el-col>
                <el-col :span="8">
                  <p class="option-btn" @click="handleSelectSpec(row)">
                    选择规格<i class="iconfont icon-select"></i>
                  </p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <span class="price">{{(spec[row.id].quotedPrice && `￥${spec[row.id].quotedPrice}`) || '暂无落地参考价'}}</span>
            </el-col>
            <el-col :span="3" class="center">
              <input-number v-model="qtr[row.id]"></input-number>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="selected">
        已选中&nbsp;<span>{{checkedCount}}</span>&nbsp;款 &nbsp;&nbsp;共&nbsp;<span>{{productCount}}</span>&nbsp;件
      </div>
      <div class="button-group">
        <el-button plain type="primary" @click="handleExportListing">导出清单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GE from '@/constants/global-events'
import { ossFullURL, downloadURI } from '@/util'
import { LOADING_OPTIONS } from '@/constants'

import InputNumber from '@/components/basic/InputNumber'

export default {
  props: ['value', 'boardId'],

  components: {
    InputNumber
  },

  data () {
    return {
      // 规格对象 key：产品ID，value：规格
      spec: {},
      // 数量对象 key：产品ID，value：数量
      qtr: {},
      checkAll: false,
      checked: {}
    }
  },

  computed: {
    checkedCount () {
      const checkedCount = Object.keys(this.checked).filter(key => this.checked[key]).length
      // error: Unexpected side effect in "checkedCount" computed property (vue/no-side-effects-in-computed-properties)
      // eslint-disable-next-line
      this.checkAll = checkedCount === this.value.length
      return checkedCount
    },
    productCount () {
      let count = 0
      Object.keys(this.checked).forEach(key => {
        if (this.checked[key]) {
          count += this.qtr[key]
        }
      })
      return count
    },
    checkAllIndeterminate () {
      return this.checkedCount !== 0 && this.checkedCount !== this.value.length
    }
  },

  methods: {
    ossFullURL,

    handleSelectSpec (product) {
      this.$emit(GE.OPEN_DIALOG_SELECT_SPEC, product, (productId, spec) => {
        this.$set(this.spec, productId, spec)
      })
    },

    handleCheckRow (id) {
      this.$set(this.checked, id, !this.checked[id])
    },

    handleCheckAllChange (val) {
      if (!val) {
        // 响应式反选属性
        Object.keys(this.checked).forEach(key => {
          this.$set(this.checked, key, false)
        })
      } else {
        this.value.forEach(element => {
          this.$set(this.checked, element.id, true)
        })
      }
    },

    handleExportListing () {
      if (this.checkedCount === 0) {
        this.$message('请至少选中一个产品！')
        return
      }

      const loading = this.$loading(LOADING_OPTIONS)

      const data = []
      this.value.forEach(product => {
        if (this.checked[product.id]) {
          data.push({
            productId: product.id,
            productSpecId: this.spec[product.id].id,
            qtr: this.qtr[product.id]
          })
        }
      })

      axios.post(`/designer_api/board/export`, {
        boardExportItemList: data,
        boardId: this.boardId
      }).then(response => {
        loading.close()
        downloadURI(ossFullURL(response.data))
      }).catch(_ => loading.close())
    },

    styleCover (row) {
      // 如果已选择的规格中有图片，取规格图片，否则取默认主图
      const key = (this.spec[row.id].specFile && this.spec[row.id].specFile.key) || row.coverFile.key
      return {
        'background-image': `url(${ossFullURL(key)})`
      }
    }
  },

  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      // 清单变化时，每个产品的默认规格为规格列表中的第一个，数量为 1
      handler (val, oldVal) {
        // reset data
        this.spec = {}
        this.qtr = {}
        this.checkAll = false
        this.checked = {}
        // set default data
        val.forEach(element => {
          this.$set(this.spec, element.id, element.specs[0])
          this.$set(this.qtr, element.id, 1)
          // 添加响应式属性
          this.$set(this.checked, element.id, false)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bottom-bar-height: 120px;
$cover-height: 150px;

.listing {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  color: #3c3a37;
  background-color: #fafafa;
  z-index: 2000;
}

.cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: no-repeat center / contain;
  will-change: transform;
  background-image: url("http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/03a62080-f801-df5e-f29e-b1574021c4f8?x-oss-process=style/w660");
  height: $cover-height;
  width: $cover-height;
}

.cover-wrapper {
  cursor: pointer;
  position: relative;
}

.cover-wrapper::before {
  content: "";
  display: block;
  padding-top: $cover-height;
}

.icon-chacha {
  cursor: pointer;
  margin-left: 30px;
  margin-top: 10px;
  display: inline-block;
  font-size: 32px;
}

.table-content {
  margin-top: 5px;
  // 255 px 等于头部+底部高度
  height: calc(100vh - 255px);
  overflow-y: scroll;
  font-size: 14px;
}

.bottom-bar {
  height: $bottom-bar-height;
  line-height: $bottom-bar-height;
  width: 100%;
  background-color: #fff;
  position: absolute;
  padding: 0 70px;
  bottom: 0;
  box-shadow: 5px 5px 100px 5px rgba(0, 0, 0, 0.1);
  display: flex;

  .selected span {
    color: #f3a534;
  }

  .button-group {
    flex: 1;
    text-align: right;
  }
}

.table-wrapper {
  padding: 10px 50px;

  .table-header {
    height: 70px;
    width: 100%;
    background-color: #ffedd3;
    border-radius: 5px;
  }

  .table-row {
    line-height: auto;
    margin: 20px 0;
    height: 150px;
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
  }
}

i.icon-num,
i.icon-numjian {
  color: #f3a534;
  font-size: 25px;
  cursor: pointer;
}

i.icon-select {
  margin-left: 5px;
  font-size: 12px;
}

.count-number {
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin: 0 30px;
  }
}

.price,
.option-btn {
  cursor: pointer;
  color: #f3a534;
  font-weight: 400;
}

.from,
.serial-number {
  color: #9a9a9a;
}

.checkbox-col {
  padding-left: 2%;
}
</style>

<style lang="scss">
.listing {
  .table-header .el-col {
    line-height: 70px;
  }

  .el-checkbox__label {
    font-size: 16px;
  }
}
</style>
