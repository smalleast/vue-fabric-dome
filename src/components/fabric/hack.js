import { fabric } from 'fabric'

/**
 * Hack Fabric.js, 改变 Fabric.js 的默认行为
 *
 * @author Hooks Zhang
 */
export default function () {
  hackBorderAndCorner()
}

function hackBorderAndCorner () {
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#B2B2B2',
    cornerColor: '#7D8286',
    cornerStyle: 'circle',
    borderDashArray: [3, 3]
  })
}

/**
 * Hack 控制板，选中对象或组出现的拖拽和旋转样式
 */
function hackDrawControls () {
  fabric.Object.prototype._drawControl = function (
    control,
    ctx,
    methodName,
    left,
    top
  ) {
    if (!this.isControlVisible(control)) {
      return
    }

    const size = this.cornerSize
    const stroke = !this.transparentCorners && this.cornerStrokeColor
    switch (control) {
      default:
        this.transparentCorners || ctx.clearRect(left, top, size, size)
        ctx[methodName + 'Rect'](left, top, size, size)
        if (stroke) {
          ctx.strokeRect(left, top, size, size)
        }
    }
  }
}
