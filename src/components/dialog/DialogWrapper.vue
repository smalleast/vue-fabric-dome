<!--
  Dialog 对话框包装，聚合了应用内的所有对话框
  通过全局事件 OPEN_DIALOG 触发
  @author Hooks Zhang
-->
<template>
  <div class="dialog-wrapper">
    <!-- 添加到收藏夹 -->
    <el-dialog class="content-no-padding" title="添加到收藏夹" :visible.sync="addToFavorite" width="600px" @close="handleCloseDialogAddToFavorites">
      <dialog-add-to-favorites ref="favorites"></dialog-add-to-favorites>
    </el-dialog>
    <el-dialog title="产品规格选择" :visible.sync="selectSpec.visible" width="600px" top="5vh">
      <dialog-select-spec v-model="selectSpec.value" @select="handleSelectSpec"></dialog-select-spec>
    </el-dialog>
    <el-dialog title="编辑产品" :visible.sync="editProduct" width="600px">
      <dialog-edit-product v-model="productValue"></dialog-edit-product>
    </el-dialog>
    <el-dialog class="content-no-padding dialog-board-form" :visible.sync="boardForm.visible" top="50px" width="240px" :show-close="false" :before-close="handleBeforeCloseDialogBoardForm">
      <dialog-board-form ref="boardForm" v-model="boardForm.value"></dialog-board-form>
    </el-dialog>
  </div>
</template>

<script>
import GE from '@/constants/global-events'
import DialogAddToFavorites from '@/components/dialog/AddToFavorites'
import DialogSelectSpec from '@/components/dialog/SelectSpec'
import DialogEditProduct from '@/components/dialog/EditProduct'
import DialogBoardForm from '@/components/fragment/BoardForm'

export default {
  components: {
    DialogAddToFavorites,
    DialogSelectSpec,
    DialogEditProduct,
    DialogBoardForm
  },

  data () {
    return {
      addToFavorite: false,
      editProduct: false,
      productValue: {},
      boardForm: {
        visible: false,
        value: {
          name: '未命名', // 拼图名称
          scene: '', // 场景
          sceneId: '', // 场景 ID
          style: '', // 风格
          styleId: '', // 风格 ID
          remark: '' // 描述
        }
      },
      // 选择规格对话框
      selectSpec: {
        // 是否可见
        visible: false,
        // 产品对象
        value: {},
        // 选择完毕后的callback，会传两个参数，productId: 产品ID, spec 规格对象
        callback: {}
      }
    }
  },

  created () {
    this.$on(GE.OPEN_DIALOG_ADD_TO_FAVORITES, (payload, cover) => {
      this.addToFavorite = true
      this.$nextTick(_ => {
        this.$refs.favorites.init(payload, cover)
      })
    })

    this.$on(GE.OPEN_DIALOG_EDIT_PRODUCT, payload => {
      this.editProduct = true
      this.productValue = payload
    })

    this.$on(GE.OPEN_DIALOG_SELECT_SPEC, (product, callback) => {
      this.selectSpec.visible = true
      this.selectSpec.value = product
      this.selectSpec.callback = callback
    })

    this.$on(GE.OPEN_DIALOG_BOARD_FORM, _ => {
      this.boardForm.visible = true
    })

    this.$on(GE.GET_BOARD, data => {
      this.boardForm.value = data
    })
  },

  methods: {
    /**
     * 当关闭添加到收藏夹对话框时
     * 刷新收藏夹（单品）
     */
    handleCloseDialogAddToFavorites () {
      this.$emit(GE.REFRESH_FAVORITE_PRODUCT)
    },

    handleSelectSpec (productId, spec) {
      this.selectSpec.callback(productId, spec)
      this.selectSpec.visible = false
    },

    handleBeforeCloseDialogBoardForm (done) {
      const { value } = this.boardForm
      if (!value.name) {
        this.$message({ message: '拼图名称不能为空', type: 'warning' })
        return
      }

      this.$emit(GE.UPDATE_BOARD_PROPERTY, value)
      done()
    }
  }
}
</script>

<style lang="scss">
.dialog-wrapper {
  .dialog-board-form {
    .el-dialog {
      margin-left: 50px;
    }

    .el-dialog__header {
      padding: 0;
    }
  }
}
</style>
