<template>
  <div ref="container" class="workbench-editor" @mousewheel="handleMouseWheel">
    <!-- s: 工具栏 -->
    <div class="tool-bar" v-show="state.isShowToolBar">
      <div>
        <el-popover placement="top-start" width="300" trigger="click" @show="handleInitFilters">
          <fabric-popover-filters v-model="props.filters" @change="handleAppleFilters"></fabric-popover-filters>
          <label slot="reference"><i class="iconfont icon-tool_icon1"></i></label>
        </el-popover>
        <short-key-button name="FLIP_X" @click="handleFlipX" icon="icon-tool_icon_off1">水平翻转</short-key-button>
        <short-key-button name="CLONE" @click="handleRepeatObject" icon="icon-tool_icon_off4"></short-key-button>
        <el-dropdown size="small" :hide-on-click="false" @command="handleCommandLayer">
          <i class="iconfont icon-tool_icon5"></i>
          <el-dropdown-menu slot="dropdown">
            <short-key-dropdown-menu name="LAYER_UP" @click="handleCommandLayer" command="layerUpActiveObject">上移一层</short-key-dropdown-menu>
            <short-key-dropdown-menu name="LAYER_DOWN" @click="handleCommandLayer" command="layerDownActiveObject">下移一层</short-key-dropdown-menu>
            <short-key-dropdown-menu name="LAYER_TOP" @click="handleCommandLayer" command="layerTopActiveObject">置顶</short-key-dropdown-menu>
            <short-key-dropdown-menu name="LAYER_BOTTOM" @click="handleCommandLayer" command="layerBottomActiveObject">置底</short-key-dropdown-menu>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip v-if="state.isEnableAligningGuidelines" effect="dark" content="关闭参考线" placement="bottom-start" class="short-key-button">
          <i class="iconfont icon-cankaoxian1" @click="handleSwitchAligningGuidelines"></i>
        </el-tooltip>
        <el-tooltip v-else effect="dark" content="开启参考线" placement="bottom-start" class="short-key-button">
          <i class="iconfont icon-cankaoxian" @click="handleSwitchAligningGuidelines"></i>
        </el-tooltip>
      </div>
      <!-- 右半边 -->
      <div class="right">
        <!-- 编辑单品，只有用户上传的单品可以编辑, 编辑的逻辑产品暂未给出，暂时隐藏按钮 -->
        <!-- <short-key-button name="EDIT" icon="icon-editor" v-show="state.isOwnUpload" @click="handleEditProduct"></short-key-button> -->
        <short-key-button name="DELETE" icon="icon-tool_icon_off8" @click="handleRemoveObject"></short-key-button>
      </div>
    </div>
    <!-- e: 工具栏 -->

    <div class="fabric-container">
      <fabric class="fabric" ref="fabric" :width="ratio.width" :height="ratio.height" :default-object-size="DEFAULT_CANVAS_OBJECT_SIZE" @onSelectionCreated="handleOnSelectionCreated" @onSelectionCleared="handleOnSelectionCleared" @changeState="handleChangeState"></fabric>
    </div>

    <!-- 缩放画布 -->
    <div class="zoom">
      <i class="iconfont icon-suofang" @click="autoZoom"></i>
      <i class="iconfont icon-jian" @click="handleChangeZoom(-10)"></i>
      <span>{{zoom}}%</span>
      <i class="iconfont icon-add" @click="handleChangeZoom(10)"></i>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import Fabric from '@/components/fabric/Fabric'
import FabricPopoverFilters from '@/components/fabric/PopoverFilters'
import { initFilters, applyFilterValue } from '@/components/fabric/filter'

import ShortKeyButton from '@/components/basic/ShortKeyButton'
import ShortKeyDropdownMenu from '@/components/basic/ShortKeyDropdownMenu'

import SK from '@/constants/shortkey'
import GE from '@/constants/global-events'
import Ratio from '@/constants/canvas-ratio'
import { DEFAULT_RATIO, DEFAULT_CANVAS_OBJECT_SIZE, LOADING_OPTIONS, DESIGN_CLOUD_URL } from '@/constants'
import { ossFullURL, downloadURI, uniqueProductSet } from '@/util'

export default {
  props: ['id'],

  components: {
    Fabric,
    FabricPopoverFilters,
    ShortKeyButton,
    ShortKeyDropdownMenu
  },

  data () {
    return {
      GE,
      DEFAULT_CANVAS_OBJECT_SIZE,

      state: {
        isEnableAligningGuidelines: true,
        // 是否显示工具栏，当有对象被选中时显示
        isShowToolBar: false,
        // 当前选中单品是否自主上传
        isOwnUpload: false,
        // 当前选中单品
        currentFocus: {},
        // 当前画布选中的对象或组
        activeObject: {}
      },

      props: {
        filters: []
      },

      data: {// 拼图数据
        id: undefined,
        canvasData: '',
        // 所有单品列表 productSpecId 产品规格ID, qtr 数量
        items: [],
        // 拼图名称
        name: '未命名',
        // 画布尺寸比例
        size: DEFAULT_RATIO,
        coverFile: {}
      },

      // 当前缩放比
      zoom: 100,
      ratio: Ratio[DEFAULT_RATIO]
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.bindGlobalEvent()
      this.autoZoom()
    },

    bindGlobalEvent () {
      this.$on(GE.ADD_TO_CANVAS, this.addToCanvasEvent)
      this.$on(GE.UNDO, this.$refs.fabric.undo)
      this.$on(GE.REDO, this.$refs.fabric.redo)
      this.$on(GE.EXPORT, this.exportEvent)
      this.$on(GE.SAVE, this.save)
      this.$on(GE.SAVE_AND_EXIT, this.saveAndExitEvent)
      this.$on(GE.GIVE_UP, this.giveUpEvent)
      // 更新拼图属性，名称、标签、描述等，此时不调用保存，点击保存并退出时才更新
      this.$on(GE.UPDATE_BOARD_PROPERTY, this.updateBoardProperty)
      this.$on(GE.CHANGE_CANVAS_RATIO, this.changeCanvasRatio)
      this.$on(GE.LOAD_CANVAS_DATA, this.loadCanvasData)
      // 展开或折叠菜单时，自动缩放，延时 100ms 等 DOM 渲染完毕才能得到正确的宽高
      this.$on(GE.FOLD_OR_UNFLOD_ASIDE, _ => {
        setTimeout(this.autoZoom, 100)
      })
      this.$on(GE.GET_CANVAS_PRODUCT_LIST, this.getCanvasProductList)
    },

    getCanvasProductList (callback) {
      const { objects } = this.$refs.fabric.serialize()
      callback(this.data.id, uniqueProductSet(objects))
    },

    /**
     * 修改画布比例，同时更新比例到 size 属性
     */
    changeCanvasRatio (ratioKey) {
      if (!ratioKey) return

      const ratio = Ratio[ratioKey]
      if (!ratio) {
        // eslint-disable-next-line
        console.warn(`Not found ratioKey: ${ratioKey}`)
      }

      this.ratio = ratio
      this.data.size = ratioKey
      this.$nextTick(_ => {
        this.$refs.fabric.renderRatio()
        this.autoZoom()
      })
    },

    updateBoardProperty (board) {
      this.data = {
        ...this.data,
        ...board
      }
    },

    addToCanvasEvent (product) {
      this.$refs.fabric.addImageFromURL(
        ossFullURL(product.coverFile.key),
        product
      )
    },

    saveAndExitEvent () {
      this.save(true)
    },

    /**
     * 保存当前画布中的拼图，新增或更新
     *
     * @param isExit 是否退出到云设计平台
     */
    save (isExit = false) {
      if (!this.data.name) {
        this.$message({ message: '拼图名称不能为空', type: 'warning' })
        return
      }

      const loading = this.$loading(LOADING_OPTIONS)
      const data = this.$refs.fabric.serialize()
      this.data.canvasData = JSON.stringify(data)

      const products = this.$refs.fabric.products()
      this.data.items = Object.keys(products).map(key => {
        // qtr 数量默认都是1
        return { productSpecId: key, qtr: 1 }
      })

      // upload cover image
      this.uploadCanvasPNG().then(response => {
        this.data.coverFile = {
          id: response.data.id
        }

        // save or update board
        const method = this.data.id ? 'put' : 'post'
        axios[method]('/designer_api/board', this.data).then(response => {
          loading.close()
          if (method === 'post') {
            // 如果是保存，发射 created 事件，参数值是 board id
            this.$emit('created', response.data)
            // 设置 ID 到 data.id
            this.data.id = response.data
          }

          if (isExit) {
            this.$message({
              message: '保存成功, 3秒后将跳转到云设计平台',
              type: 'success'
            })
            setTimeout(_ => {
              window.onbeforeunload = undefined
              window.location.href = DESIGN_CLOUD_URL
            }, 3000)
          } else {
            this.$message({ message: '保存成功', type: 'success' })
          }
        }).catch(_ => loading.close())
      }).catch(_ => loading.close())
    },

    exportEvent () {
      const data = this.$refs.fabric.dataURL()
      downloadURI(data, 'zhulogic-export.png')
    },

    giveUpEvent () {
      this.$confirm('确定放弃本次编辑？').then(_ => {
        window.onbeforeunload = undefined
        window.location.reload()
      })
    },

    autoZoom () {
      const scale = 0.85
      let zoomWidth = this.$refs.container.offsetWidth / this.ratio.width
      let zoomHeight = this.$refs.container.offsetHeight / this.ratio.height
      this.zoom = (Math.min(zoomHeight, zoomWidth) * scale * 100).toFixed(0)
      this.onChangeZoom()
    },

    handleChangeZoom (zoom) {
      const sum = Number(this.zoom) + Number(zoom)
      this.zoom = (this.zoom += zoom) < 10 ? 10 : sum
      this.onChangeZoom()
    },

    onChangeZoom () {
      this.$refs.fabric.zoomCanvas(this.zoom / 100)
    },

    addImageFromURL (url) {
      this.$refs.fabric.addImageFromURL(url)
    },

    handleEditProduct () {
      this.$emit(GE.OPEN_DIALOG_EDIT_PRODUCT, this.state.currentFocus)
    },

    handleFlipX () {
      this.$refs.fabric.flipXActiveObject()
    },

    handleRepeatObject () {
      this.$refs.fabric.repeatActiveObject()
    },

    handleRemoveObject () {
      this.$refs.fabric.removeActiveObject()
    },

    handleCommandLayer (command) {
      this.$refs.fabric[command]()
    },

    handleInitFilters () {
      const { activeObject } = this.state
      if (!activeObject.filters || activeObject.filters.length === 0) {
        initFilters(activeObject)
      }
      this.props.filters = activeObject.filters
    },

    handleAppleFilters (prop, value) {
      applyFilterValue(this.state.activeObject, prop, prop, value)
      this.$refs.fabric.renderAll()
    },

    handleSwitchAligningGuidelines () {
      this.state.isEnableAligningGuidelines = !this.state.isEnableAligningGuidelines
      this.$refs.fabric.aligningGuidelinesSwitch()
    },

    handleOnSelectionCreated (event) {
      this.state.isShowToolBar = true
      this.state.activeObject = event.target
      this.state.currentFocus = event.target.meta || {}

      // 添加到画布触发的选中事件，不发射全局 GE.SELECTION
      if (event.e.add) {
        return
      }

      this.state.isOwnUpload = event.target.meta && event.target.meta.own
      this.$emit(GE.SELECTION, event.target.meta)
    },

    handleOnSelectionCleared (event) {
      this.state.isShowToolBar = false
    },

    handleChangeState (state) {
      this.$emit(GE.CHANGE_CANVAS_STATE, state)
    },

    /**
     * 阻止页面滚动，改为缩放画布
     * Windows, Linux: Ctrl + 滚轮
     * Mac OSX: Cmd + 滚轮
     */
    handleMouseWheel (event) {
      if (!event[SK.ZOOM.key]) return
      event.returnValue = false
      const offset = (event.deltaY / 100).toFixed(0)
      this.zoom += Number(offset)
      this.onChangeZoom()
    },

    uploadCanvasPNG () {
      let base64 = this.$refs.fabric.dataURL()
      base64 = base64.replace('data:image/png;base64,', '')
      return axios.post('/designer_api/files/uploadProductImageByBase64', { base64 })
    },

    loadData (id) {
      axios.get(`/designer_api/board/${id}`).then(response => {
        this.loadCanvasData(response.data)
      })
    },

    loadCanvasData (data) {
      this.$confirm('将替换当前画布的全部内容').then(_ => {
        this.data = data
        this.$emit(GE.GET_BOARD, { ...data })
        // 发射全局事件变更画布尺寸，同步改变头部画布比例弹窗选中
        this.$emit(GE.CHANGE_CANVAS_RATIO, data.size)
        this.$refs.fabric.loadFromJSON(data.canvasData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workbench-editor {
  padding-top: 80px;
  background-color: #f2f2f2;
  height: 100%;
  overflow-y: scroll;

  i {
    cursor: pointer;
    font-size: 22px;
    margin-right: 40px;
    color: #878787;
  }

  i:hover {
    color: #272424;
  }

  i[disabled] {
    color: rgba(0, 0, 0, 0.2);
  }
}

.tool-bar {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 80px;
  width: 100%;
  padding-left: 60px;
  line-height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #e6e8e8;
  z-index: 99;

  .right {
    flex: 1;
    text-align: right;
  }
}

.zoom {
  position: fixed;
  align-items: center;
  padding: 7px;
  right: 10px;
  bottom: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  color: #fff;
  font-size: 11px;

  i {
    color: #fff;
    font-size: 14px;
    margin: 0 5px;
  }
  i:hover {
    color: #eee;
  }
}

.fabric-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
