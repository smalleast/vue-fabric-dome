<template>
  <div class="container">
    <h1>fabric filters</h1>
    <p>
      <button @click="getObjects">objects</button>&nbsp;
    </p>
    <el-row>
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="亮度">
            <input v-model="state.brightness" type="range" min="-1" max="1" step="0.01">
          </el-form-item>
          <el-form-item label="对比度">
            <input v-model="state.contrast" type="range" min="-1" max="1" step="0.01">
          </el-form-item>
          <el-form-item label="饱和度">
            <input v-model="state.saturation" type="range" min="-1" max="1" step="0.01">
          </el-form-item>
          <el-form-item label="清晰度">
            <input v-model="state.blur" type="range" min="0" max="1" step="0.01">
          </el-form-item>
          <el-form-item label="色彩">
            <input v-model="state.hueRotation" type="range" min="-2" max="2" step="0.01">
          </el-form-item>
          <el-form-item label="透明度">
            <input v-model="state.opacity" type="range" min="0" max="1" step="0.01">
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" :style="{opacity: 1 - state.opacity}">
        <canvas id="filters" class="fabric"></canvas>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import { createCanvas } from '@/util/test'

const f = fabric.Image.filters
// 滤镜对应的下标
const filters = {
  brightness: 0,
  contrast: 1,
  saturation: 2,
  blur: 3,
  hueRotation: 4
}
const defaultValue = 0

export default {
  data () {
    return {
      canvas: {},
      state: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
        hueRotation: 0,
        opacity: 0
      }
    }
  },

  mounted () {
    createCanvas('filters').then(canvas => {
      this.canvas = canvas
      this.handleApply()
    })
  },

  methods: {
    getObjects () {
      console.log(this.canvas.getObjects())
    },

    handleApply () {
      const obj = this.canvas.getObjects()[0]
      obj.filters = [
        // 亮度
        new f.Brightness({ brightness: defaultValue }),
        // 对比度
        new f.Contrast({ contrast: defaultValue }),
        // 饱和度
        new f.Saturation({ saturation: defaultValue }),
        // 清晰度
        new f.Blur({ blur: defaultValue }),
        // 色彩
        new f.HueRotation({ rotation: defaultValue })
      ]
      obj.applyFilters()
      this.canvas.renderAll()
    },

    applyFilterValue (object, filterName, prop, value) {
      const index = filters[filterName]
      object.filters[index][prop] = value
      object.applyFilters()
      this.canvas.renderAll()
    },

    defaultObject () {
      return this.canvas.getObjects()[0]
    }
  },

  watch: {
    'state.brightness' (value) {
      this.applyFilterValue(this.defaultObject(), 'brightness', 'brightness', value)
    },
    'state.contrast' (value) {
      this.applyFilterValue(this.defaultObject(), 'contrast', 'contrast', value)
    },
    'state.saturation' (value) {
      this.applyFilterValue(this.defaultObject(), 'saturation', 'saturation', value)
    },
    'state.blur' (value) {
      this.applyFilterValue(this.defaultObject(), 'blur', 'blur', value)
    },
    'state.hueRotation' (value) {
      this.applyFilterValue(this.defaultObject(), 'hueRotation', 'rotation', value)
    }
  }
}
</script>
