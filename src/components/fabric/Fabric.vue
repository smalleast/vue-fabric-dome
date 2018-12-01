<template>
  <div :style="{transform: `scale(${zoomValue})`}">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import { configure, fabricOptions } from './configure'
import { loadFromRemote } from '@/util'
import { initAligningGuidelines, disabledAligningGuidelines, enabledAligningGuidelines } from './aligning_guidelines'

export default {
  props: {
    // 画布宽度
    width: {
      type: Number,
      default: 780
    },
    // 画布高度
    height: {
      type: Number,
      default: 546
    },
    // 默认对象尺寸
    defaultObjectSize: {
      type: Number,
      default: 200
    }
  },

  data () {
    return {
      // fabric 画布对象
      canvas: {},
      // 状态树
      state: {
        // 当前撤销、重做游标
        currentIndex: -1,
        // canvas json 历史
        canvas: [],
        // 撤销状态树
        undo: {
          // 正在撤销
          isDoing: false,
          // 禁用撤销按钮
          disabled: false
        },
        // 重做状态树
        redo: {
          // 正在重做
          isDoing: false,
          // 禁用撤销按钮
          disabled: false
        }
      },
      // 缩放比例
      zoomValue: 1,
      aligningGuidelinesDisabled: false
    }
  },

  mounted () {
    configure()
    this.init()
  },

  methods: {
    init () {
      this.canvas = new fabric.Canvas('canvas', fabricOptions(this.width, this.height))
      initAligningGuidelines(this.canvas, 'red')
      this.bindEvents()
    },

    bindEvents () {
      this.canvas.on('selection:created', event => {
        this.$emit('onSelectionCreated', event)
      })
      this.canvas.on('selection:updated', event => {
        this.$emit('onSelectionCreated', event)
      })
      this.canvas.on('selection:cleared', event => {
        this.$emit('onSelectionCleared', event)
      })
      this.canvas.on('object:modified', event => {
        this.updateState(event)
      })
    },

    renderRatio () {
      this.canvas.setDimensions({
        width: this.width,
        height: this.height
      })
    },

    aligningGuidelinesSwitch () {
      if (this.aligningGuidelinesDisabled) {
        enabledAligningGuidelines()
      } else {
        disabledAligningGuidelines()
      }
      this.aligningGuidelinesDisabled = !this.aligningGuidelinesDisabled
    },

    updateState () {
      const state = this.state
      // 如果正在操作撤销或重做，不更新画布状态树
      if (state.undo.isDoing || state.redo.isDoing) {
        return
      }

      const json = JSON.stringify(this.serialize())
      if (state.currentIndex < state.canvas.length - 1) {
        // 刚执行过 undo 操作, 截取 state canvas 到当前下标
        state.canvas = state.canvas.splice(0, state.currentIndex + 1)
      }

      state.canvas.push(json)
      state.currentIndex = state.canvas.length - 1
      state.redo.disabled = true
    },

    undo () {
      const state = this.state
      // 判断 undo 执行条件是否满足
      // state 游标不为 -1，state.canvas 长度不为 0，当前没有正在执行 redo, undo 操作
      if (!(state.currentIndex !== -1 &&
        state.canvas.length > 0 &&
        !state.redo.isDoing &&
        !state.undo.isDoing)) {
        return
      }

      if (state.currentIndex !== 0) {
        // 加锁，防止多个 undo 同时执行，undo 触发的 modified 事件不更新 state.canvas
        state.undo.isDoing = true
        const index = state.currentIndex - 1
        this.canvas.loadFromJSON(state.canvas[index], () => {
          this.canvas.renderAll()
          state.currentIndex--
          state.undo.isDoing = false
          state.undo.disabled = false

          if (state.currentIndex !== state.canvas.length - 1) {
            state.redo.disabled = false
          }
        })
      } else {
        // 已经撤回到初始状态，清空画布，将各项标记设置为初始值
        this.canvas.clear()
        state.currentIndex = -1
        state.undo.disabled = true
        state.redo.disabled = false
      }
    },

    redo () {
      const state = this.state
      // 判断是否满足重做条件
      // state.canvas 的长度不能为 0, state.canvas 的长度 - 1大于等于当前游标，当前没有正在执行 redo, undo 操作
      if (!(state.canvas.length !== 0 &&
        (state.canvas.length - 1) > state.currentIndex &&
        !state.redo.isDoing &&
        !state.undo.isDoing)) {
        return
      }

      state.redo.isDoing = true
      const index = state.currentIndex + 1
      this.canvas.loadFromJSON(state.canvas[index], () => {
        this.canvas.renderAll()
        state.redo.isDoing = false
        state.currentIndex++

        if (state.currentIndex !== -1) {
          state.undo.disabled = false
        }

        if (state.currentIndex === state.canvas.length - 1 && state.currentIndex !== -1) {
          state.redo.disabled = true
        }
      })
    },

    /**
     * Sets zoom level of this canvas width/height
     *
     * @param {Number} value to set zoom to, less than 1 zooms out
     */
    zoomCanvas (value) {
      this.zoomValue = value
    },

    /**
     * 从网络添加一张图片到画布中
     *
     * @param {String} url 图片URL
     * @param {Number} meta 元数据
     */
    addImageFromURL (url, meta) {
      url = loadFromRemote(url)

      fabric.Image.fromURL(url, img => {
        // 缩放至合适大小
        if (img.width > this.defaultObjectSize) {
          const a = this.defaultObjectSize / img.width
          img.scaleX = a
          img.scaleY = a
        }
        // 禁用不等比例缩放
        img.lockUniScaling = true
        // 设置 IMG 元数据
        img.meta = meta
        this.addObjectToCanvasAndActive(img)
      }, {
        // Fix: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
        // https://github.com/fabricjs/fabric.js/issues/1386
        crossOrigin: 'Anonymous'
      })
    },

    /**
     * 复制当前选中对象，如果当前没有选中任何对象，什么也不做
     */
    repeatActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      const mirror = fabric.util.object.clone(object)
      mirror.left += 50
      mirror.top += 50
      this.addObjectToCanvasAndActive(mirror)
    },

    /**
     * 添加一个对象到画布中并选中这个对象
     * 同时更新画布 state，可撤销
     */
    addObjectToCanvasAndActive (object) {
      this.canvas.add(object).setActiveObject(object, { add: true })
      this.updateState()
    },

    /**
     * 获得当前选中对象
     */
    getActiveObject () {
      return this.canvas.getActiveObject()
    },

    /**
     * 删除当前选中对象
     */
    removeActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      // 同时选中对个对象，批量删除
      if (object._objects) {
        this.canvas.remove(...object._objects)
      }

      this.canvas.remove(object)
      this.canvas.discardActiveObject()
      this.updateState()
    },

    /**
     * 将当前选中的对象 z-index 上移一层
     */
    layerUpActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      const index = this.canvas._objects.indexOf(object)
      if (index < (this.canvas._objects.length - 1) && index !== -1) {
        this.canvas.moveTo(object, index + 1)
      }
    },

    /**
     * 将当前选中的对象 z-index 下移一层
     */
    layerDownActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      const index = this.canvas._objects.indexOf(object)
      if (index > 0) {
        this.canvas.moveTo(object, index - 1)
      }
    },

    /**
     * 置顶当前选中的对象
     */
    layerTopActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      this.canvas.moveTo(object, this.canvas._objects.length - 1)
    },

    /**
     * 置底当前选中的对象
     */
    layerBottomActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      this.canvas.moveTo(object, 0)
    },

    /**
     * 序列化画布，同时导出自定义属性 meta
     */
    serialize () {
      return this.canvas.toJSON(['meta'])
    },

    /**
     * 返回 canvas 的 data url, 可以导出图片
     *
     * @param {Object} option fabric option http://fabricjs.com/docs/fabric.Canvas.html#toDataURL
     */
    dataURL (option) {
      return this.canvas.toDataURL(option)
    },

    /**
     * 加载 canvas json 到画布中，替换整个画布
     */
    loadFromJSON (json) {
      this.canvas.loadFromJSON(json, () => {
        this.canvas.renderAll()
        this.updateState()
      })
    },

    renderAll () {
      this.canvas.renderAll()
    },

    /**
     * 水平翻转当前选中的对象
     */
    flipXActiveObject () {
      const object = this.getActiveObject()
      if (!object) return

      object.flipX = !object.flipX
      this.canvas.renderAll()
      return object
    },

    /**
     * 返回画布中的产品列表 key: id, value: count
     * 画布对象中的 meta 记录了对应的产品信息
     */
    products () {
      const { objects } = this.serialize()

      const products = {}
      for (const object of objects) {
        const { meta } = object
        if (meta) {
          if (products[meta.id]) {
            products[meta.id]++
          } else {
            products[meta.id] = 1
          }
        }
      }

      return products
    }
  },

  /**
   * 监听 state.undo, redo 发射 changeState 事件告知外部
   */
  watch: {
    'state.undo.disabled' (val) {
      this.$emit('changeState', {
        undoDisabled: val,
        redoDisabled: this.state.redo.disabled
      })
    },
    'state.redo.disabled' (val) {
      this.$emit('changeState', {
        undoDisabled: this.state.undo.disabled,
        redoDisabled: val
      })
    }
  }
}
</script>
