<!--
  Fabric.js高级点的教程3--添加遮罩和裁剪的方法
  https://my.oschina.net/xmqywx/blog/2246082
-->
<template>
  <div class="container">
    <h1>crop pattern</h1>
    <p>
      <button @click="initCrop(state)">init crop</button>
      <button @click="handleCrop(state)">crop</button>
    </p>

    <canvas id="crop-pattern" class="fabric"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric'

export default {
  mounted () {
    this.init()
  },

  data () {
    return {
      url: 'http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp740726f31ba347c0929780ced515b434.jpg?x-oss-process=style/w660',
      canvas: {},
      state: {}
    }
  },

  methods: {
    init () {
      this.canvas = new fabric.Canvas('crop-pattern', {
        preserveObjectStacking: true,
        width: 660,
        height: 495
      })

      setTimeout(_ => {
        fabric.Image.fromURL(this.url, img => {
          this.canvas.add(img).setActiveObject(img)
          // Fix: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
          // https://github.com/fabricjs/fabric.js/issues/1386
        }, { crossOrigin: 'Anonymous' })
      }, 500)
    },

    handleCrop (state) {
      let activeObject = this.canvas.getActiveObject()
      state.isClipping = false
      activeObject.clipClone.visible = false
      this.canvas.remove(state.clipActiveObj)
    },

    initCrop (state) {
      let activeObject = this.canvas.getActiveObject()
      state.isClipping = true

      if (activeObject.type === 'image') {
        let clipBox = new fabric.Rect({
          left: activeObject.left,
          top: activeObject.top,
          width: activeObject.width,
          height: activeObject.height,
          stroke: '#F5A623',
          strokeWidth: 1,
          fill: 'rgba(255, 255, 255, 0)',
          objectCaching: false,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          selectionBackgroundColor: 'rgba(255, 255, 255, 0)',
          padding: 0,
          angle: activeObject.angle
        })

        state.clipBox = clipBox
        state.clipActiveObj = activeObject
        // 区分是svg的img还是普通img
        let url = activeObject.src ? activeObject.src : activeObject['xlink:href']

        fabric.util.loadImage(url, (img) => {
          clipBox.fill = new fabric.Pattern({
            source: img,
            repeat: 'no-repeat',
            offsetX: 0,
            offsetY: 0
          })
          this.canvas.add(clipBox)

          activeObject.set({
            selectable: false,
            hoverCursor: 'default',
            evented: false,
            hasControls: false,
            perPixelTargetFind: false
          })

          activeObject.clone((clonedObj) => {
            this.canvas.discardActiveObject()
            clonedObj.set({
              left: clonedObj.left,
              top: clonedObj.top,
              evented: false,
              opacity: 0.8
            })
            clipBox.clipClone = clonedObj
            this.canvas.add(clonedObj)
          })

          activeObject.visible = false

          this.canvas.renderAll()

          state.clipBox.on({
            'moving': () => {
              if (!state.isClipping) {
                clipBox.clipClone.left = clipBox.left - state.clipLeft
                clipBox.clipClone.top = clipBox.top - state.clipTop
                this.canvas.renderAll()
                return
              }
              let left = clipBox.left - clipBox.clipClone.left
              let top = clipBox.top - clipBox.clipClone.top

              state.clipLeft = left
              state.clipTop = top
              clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
              clipBox.fill.offsetY = -top / clipBox.clipClone.scaleY
              this.canvas.renderAll()
            },
            'scaling': () => {
              if (!state.isClipping) {
                clipBox.clipClone.left = clipBox.left - state.clipLeft
                clipBox.clipClone.top = clipBox.top - state.clipTop
                clipBox.clipClone.scaleX = clipBox.scaleX
                clipBox.clipClone.scaleY = clipBox.scaleY
                this.canvas.renderAll()
                return
              }
              // let _width = clipBox.width / clipBox.
              let _width = clipBox.width * clipBox.scaleX / clipBox.clipClone.scaleX
              let _height = clipBox.height * clipBox.scaleY / clipBox.clipClone.scaleY
              let left = clipBox.left - clipBox.clipClone.left
              let top = clipBox.top - clipBox.clipClone.top
              state.clipLeft = clipBox.left
              state.clipTop = clipBox.top
              clipBox.fill.offsetX = -left / clipBox.clipClone.scaleX
              clipBox.fill.offsetY = -top / clipBox.clipClone.scaleX
              clipBox.scaleX = clipBox.clipClone.scaleX
              clipBox.scaleY = clipBox.clipClone.scaleY

              clipBox.width = _width
              clipBox.height = _height

              this.canvas.renderAll()
            }
          })

          setTimeout(() => {
            this.canvas.setActiveObject(state.clipBox)
            this.canvas.renderAll()
          }, 300)
        })
      } else {
        activeObject.clipClone.visible = true
        this.canvas.renderAll()
      }
    }
  }
}
</script>
