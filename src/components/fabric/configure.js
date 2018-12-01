import { fabric } from 'fabric'

export function configure () {
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#B2B2B2',
    cornerColor: '#7D8286',
    cornerStyle: 'circle',
    borderDashArray: [2, 2]
  })
}

export function fabricOptions (width, height) {
  return {
    // 层叠友好，实时显示层叠顺序变化
    preserveObjectStacking: true,
    width,
    height,
    backgroundColor: '#FFF'
  }
}
