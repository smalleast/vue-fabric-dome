import { fabric } from 'fabric'

/**
 * Should objects be aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 * https://github.com/fabricjs/fabric.js/blob/master/lib/aligning_guidelines.js
 *
 * @author fabric.js contributions
 * @author Hooks Zhang
 */

// 参考线开关
let disabled = false

export function initAligningGuidelines (canvas, aligningLineColor = 'rgb(0,255,0)', aligningLineOffset = 5, aligningLineMargin = 4, aligningLineWidth = 1) {
  let ctx = canvas.getSelectionContext()
  let viewportTransform
  let zoom = 1

  function drawVerticalLine (coords) {
    drawLine(
      coords.x + 0.5,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x + 0.5,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1)
  }

  function drawHorizontalLine (coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y + 0.5,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y + 0.5)
  }

  function drawLine (x1, y1, x2, y2) {
    ctx.save()
    ctx.lineWidth = aligningLineWidth
    ctx.strokeStyle = aligningLineColor
    ctx.beginPath()
    ctx.moveTo(((x1 + viewportTransform[4]) * zoom), ((y1 + viewportTransform[5]) * zoom))
    ctx.lineTo(((x2 + viewportTransform[4]) * zoom), ((y2 + viewportTransform[5]) * zoom))
    ctx.stroke()
    ctx.restore()
  }

  function isInRange (value1, value2) {
    value1 = Math.round(value1)
    value2 = Math.round(value2)
    for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true
      }
    }
    return false
  }

  let verticalLines = []
  let horizontalLines = []

  canvas.on('mouse:down', function () {
    if (disabled) return
    viewportTransform = canvas.viewportTransform
    zoom = canvas.getZoom()
  })

  canvas.on('object:moving', function (e) {
    if (disabled) return
    let activeObject = e.target
    let canvasObjects = canvas.getObjects()
    let activeObjectCenter = activeObject.getCenterPoint()
    let activeObjectLeft = activeObjectCenter.x
    let activeObjectTop = activeObjectCenter.y
    let activeObjectBoundingRect = activeObject.getBoundingRect()
    let activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3]
    let activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0]
    let horizontalInTheRange = false
    let verticalInTheRange = false
    let transform = canvas._currentTransform

    if (!transform) return

    // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
    // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

    for (var i = canvasObjects.length; i--;) {
      if (canvasObjects[i] === activeObject) continue

      let objectCenter = canvasObjects[i].getCenterPoint()
      let objectLeft = objectCenter.x
      let objectTop = objectCenter.y
      let objectBoundingRect = canvasObjects[i].getBoundingRect()
      let objectHeight = objectBoundingRect.height / viewportTransform[3]
      let objectWidth = objectBoundingRect.width / viewportTransform[0]

      // snap by the horizontal center line
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center')
      }

      // snap by the left edge
      if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center')
      }

      // snap by the right edge
      if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center')
      }

      // snap by the vertical center line
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center')
      }

      // snap by the top edge
      if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center')
      }

      // snap by the bottom edge
      if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        })
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center')
      }
    }

    if (!horizontalInTheRange) {
      horizontalLines.length = 0
    }

    if (!verticalInTheRange) {
      verticalLines.length = 0
    }
  })

  canvas.on('before:render', function () {
    if (disabled) return
    canvas.clearContext(canvas.contextTop)
  })

  canvas.on('after:render', function () {
    if (disabled) return
    for (let i = verticalLines.length; i--;) {
      drawVerticalLine(verticalLines[i])
    }
    for (let i = horizontalLines.length; i--;) {
      drawHorizontalLine(horizontalLines[i])
    }

    verticalLines.length = horizontalLines.length = 0
  })

  canvas.on('mouse:up', function () {
    if (disabled) return
    verticalLines.length = horizontalLines.length = 0
    canvas.renderAll()
  })
}

export function disabledAligningGuidelines () {
  disabled = true
}

export function enabledAligningGuidelines () {
  disabled = false
}
