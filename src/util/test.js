import { fabric } from 'fabric'

export function createCanvas (id) {
  return new Promise((resolve) => {
    const canvas = new fabric.Canvas(id, {
      preserveObjectStacking: true,
      width: 660,
      height: 495
    })

    setTimeout(_ => {
      fabric.Image.fromURL('http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/product_image/cp740726f31ba347c0929780ced515b434.jpg?x-oss-process=style/w660', img => {
        img.selectable = false
        canvas.add(img)
        resolve(canvas)
        // Fix: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
        // https://github.com/fabricjs/fabric.js/issues/1386
      }, { crossOrigin: 'Anonymous' })
    }, 200)
  })
}
