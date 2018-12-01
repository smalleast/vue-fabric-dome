<template>
  <div>
    <header>
      <el-popover popper-class="save-and-exit-popover" trigger="click" :visible-arrow="false" :offset="500">
        <div>
          <p @click="$emit(GE.SAVE)"><i class="iconfont icon-ed"></i>保存</p>
          <p @click="$emit(GE.GIVE_UP)"><i class="iconfont icon-colse1"></i>放弃本次编辑</p>
        </div>
        <div slot="reference" class="save-and-exit">
          <i class="iconfont icon-ed"></i>
        </div>
      </el-popover>

      <ul class="ul-button">
        <li @click="$emit(GE.OPEN_DIALOG_BOARD_FORM)">
          <span class="name"><i class="iconfont icon-angle"></i>{{name}}</span>
        </li>
        <li>
          <el-popover placement="bottom" trigger="click">
            <canvas-ratio @click="handleChangeCanvasSize" :ratio="currentRatio"></canvas-ratio>
            <span slot="reference"><i class="iconfont icon-huaban"></i>画板</span>
          </el-popover>
        </li>
        <li>
          <el-upload accept="image/x-png,image/gif,image/jpeg" action="" :show-file-list="false" :http-request="handleUpload" :auto-upload="true">
            <span slot="trigger"><i class="iconfont icon-shangchuan"></i>上传</span>
          </el-upload>
        </li>
        <li :disabled="state.undoDisabled" v-shortkey="SK.UNDO.key" @shortkey="$emit(GE.UNDO)" @click="$emit(GE.UNDO)">
          <el-tooltip effect="dark" :content="SK.UNDO.label" placement="bottom-start">
            <span><i class="iconfont icon-left_chexiao"></i> 撤销</span>
          </el-tooltip>
        </li>
        <li :disabled="state.redoDisabled" v-shortkey="SK.REDO.key" @shortkey="$emit(GE.REDO)" @click="$emit(GE.REDO)">
          <el-tooltip effect="dark" :content="SK.REDO.label" placement="bottom-start">
            <span><i class="iconfont icon-right_chexiao"></i> 还原</span>
          </el-tooltip>
        </li>
      </ul>

      <ul class="ul-button right">
        <li @click="handleClickListing"><i class="iconfont icon-qingdan"></i>清单</li>
      </ul>
    </header>
    <listing v-model="listing.value" :board-id="listing.boardId" v-show="isShowListing" @close="isShowListing = false"></listing>
  </div>
</template>

<script>
import axios from 'axios'

import SK from '@/constants/shortkey'
import GE from '@/constants/global-events'
import { DEFAULT_RATIO, FAVORITE_TYPE, LOADING_OPTIONS, DEFAULT_PRODUCT_PROPERTY } from '@/constants'
import { ossFullURL } from '@/util'

import BoardForm from '@/components/fragment/BoardForm'
import CanvasRatio from '@/components/popover/CanvasRatio'
import Listing from '@/components/dialog/Listing'

export default {
  data () {
    return {
      SK,
      GE,
      // 撤销，还原按钮禁用状态
      state: {
        undoDisabled: true,
        redoDisabled: true
      },
      // 当前画布比例
      currentRatio: DEFAULT_RATIO,
      // 当前拼图名称
      name: '未命名',
      // 是否显示清单
      isShowListing: false,
      listing: {
        boardId: '',
        value: []
      }
    }
  },

  components: {
    BoardForm,
    CanvasRatio,
    Listing
  },

  computed: {
    profile () {
      return this.$store.state.profile
    }
  },

  mounted () {
    this.$on(GE.CHANGE_CANVAS_STATE, state => {
      this.state = state
    })

    this.$on(GE.GET_BOARD, data => {
      this.name = data.name
    })

    this.$on(GE.CHANGE_CANVAS_RATIO, ratioKey => {
      this.currentRatio = ratioKey
    })

    this.$on(GE.UPDATE_BOARD_PROPERTY, data => {
      this.name = data.name
    })
  },

  methods: {
    handleClickListing () {
      this.isShowListing = true
      this.$emit(GE.GET_CANVAS_PRODUCT_LIST, (boardId, products) => {
        this.listing.boardId = boardId
        this.listing.value = products
      })
    },

    handleSaveBoard () {
      const { data } = this.$refs.boardForm
      this.name = data.name
      this.$emit(GE.UPDATE_BOARD_PROPERTY, data)
    },

    handleChangeCanvasSize (key) {
      this.$emit(GE.CHANGE_CANVAS_RATIO, key)
    },

    /**
     * 上传单品, element-upload 组件触发
     * 选择要上传的单品图片，调用上传接口，文件名作为默认产品名（超出20字的被截掉）
     * 规格，面料默认都是常规，调用生成单品接口，根据返回的单品 ID 弹出收藏对话框
     */
    handleUpload (event) {
      const loading = this.$loading(LOADING_OPTIONS)
      const formData = new FormData()
      formData.append('file', event.file)
      formData.append('type', FAVORITE_TYPE.PRODUCT)
      // 上传封面图片
      axios.post('/designer_api/files/upload', formData).then(response => {
        const [coverFile] = response.data
        const data = {
          name: this.substringMaxLength20(event.file.name),
          coverFile,
          material: DEFAULT_PRODUCT_PROPERTY,
          size: DEFAULT_PRODUCT_PROPERTY
        }

        // 生成单品
        axios.post('/designer_api/board/upload', data).then(response => {
          loading.close()
          // 打开收藏弹窗
          this.$emit(GE.OPEN_DIALOG_ADD_TO_FAVORITES, {
            resourceId: response.data.id,
            type: FAVORITE_TYPE.PRODUCT
          }, {
            url: ossFullURL(coverFile.key),
            name: data.name,
            price: 0
          })
        }).catch(_ => loading.close())
      }).catch(_ => loading.close())
    },

    substringMaxLength20 (filename) {
      return filename.length > 20 ? filename.substring(0, 20) : filename
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  line-height: 50px;
  background-color: #272524;
  color: #dadde5;
  padding-right: 20px;

  // 拼图名字只显示 8 个字，超出显示省略号
  .name {
    display: inline-block;
    max-width: 160px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}

.username {
  margin-left: 20px;
  color: #fff;
}

.save-and-exit {
  background-color: #41403F;
  margin-right: 20px;
  width: 50px;
  height: 50px;
  text-align: center;
  i {
    display: inline-block;
    cursor: pointer;
    font-size: 22px;
    color: #F3A534;
  }
}

.ul-button {
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;

  li {
    cursor: pointer;
    float: left;
    height: 50px;
    margin-right: 30px;
    color: #dbdbdb;
  }
  li:hover {
    color: #fff;
  }

  li[disabled] {
    color: rgba(255,255,255,.3);
  }

  i {
    margin-right: 5px;
  }
}

.ul-button.right {
  flex: 1;
}

.ul-button.right li {
  float: right;
}
</style>

<style lang="scss">
.el-popper.save-and-exit-popover {
  margin-top: 0;
  i {
    font-size: 18px;
    margin-right: 10px;
  }
  p {
    cursor: pointer;
    font-size: 14px;
  }

  p:hover {
    color: #F3A534;
  }
}

.ul-button {
  .el-upload:focus {
    border-color: inherit;
    color: inherit;
  }
}
</style>
