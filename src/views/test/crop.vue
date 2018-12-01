<!--
  把选中的图片直接拿出来，放到一个新的 canvas 里，这个 canvas 会叠在原有的对象上，看起来就好像是在原有画布中裁剪一样。
  在新的 canvas 上绝对布局一个可拖拽和改变尺寸的div，选中要裁剪的区域后调用 canvas.toDataURL 方法，
  传递 left, top, width, height 参数，生成新图片，改变原有对象的 src。对象的原图会在一个自定义的 meta 属性备份
-->
<template>
  <div class="container crop">
    <h1>Fabric Crop Test</h1>
    <p>
      <button @click="handleCrop">crop</button>
    </p>

    <crop-wrapper ref="crop">
      <canvas id="fabric-crop" class="fabric"></canvas>
    </crop-wrapper>

    <h3>Cropped Image</h3>
    <img v-if="cropped" :src="cropped">
  </div>
</template>

<script>
import { fabric } from 'fabric'
import CropWrapper from '@/components/fabric/CropWrapper'

export default {
  components: {
    CropWrapper
  },

  data () {
    return {
      url: 'http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp740726f31ba347c0929780ced515b434.jpg?x-oss-process=style/w660',
      canvas: {},
      cropped: ''
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.canvas = new fabric.Canvas('fabric-crop', {
        preserveObjectStacking: true,
        width: 660,
        height: 495
      })

      setTimeout(_ => {
        fabric.Image.fromURL(this.url, img => {
          img.selectable = false
          this.canvas.add(img)
          // Fix: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
          // https://github.com/fabricjs/fabric.js/issues/1386
        }, { crossOrigin: 'Anonymous' })
      }, 500)
    },

    handleCrop () {
      const position = this.$refs.crop.position()
      this.cropped = this.canvas.toDataURL(position)
    }
  }
}
</script>
