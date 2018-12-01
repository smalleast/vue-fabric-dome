import { fabric } from 'fabric'

const defaultValue = 0
const f = fabric.Image.filters
// 滤镜对应的下标
const FILTER_INDEX = {
  brightness: 0,
  contrast: 1,
  saturation: 2,
  blur: 3,
  rotation: 4
}
const FILTER_NAME = ['brightness', 'contrast', 'saturation', 'blur', 'rotation']

export function initFilters (object) {
  object.filters = [
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
}

export function applyFilterValue (object, filterName, prop, value) {
  if (!object.filters) return
  const index = FILTER_INDEX[filterName]
  object.filters[index][prop] = value
  object.applyFilters()
}

export function calcFilterState (objectFilters) {
  const state = {}
  objectFilters.forEach((filter, index) => {
    state[FILTER_NAME[index]] = filter[FILTER_NAME[index]]
  })
  return state
}
