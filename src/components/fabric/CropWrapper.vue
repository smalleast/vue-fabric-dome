<template>
  <div class="crop-wrapper" ref="wrapper">
    <slot></slot>
    <div class="shade"></div>
    <div class="crop-area" ref="area"></div>
  </div>
</template>

<script>
import interact from 'interactjs'

export default {
  mounted () {
    interact('.crop-area')
      .draggable({
        onmove: (event) => {
          let target = event.target
          // keep the dragged position in the data-x/data-y attributes
          let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
          let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

          // translate the element
          target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)'

          // update the posiion attributes
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        },
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true
        },

        // minimum size
        restrictSize: {
          restriction: 'parent',
          min: { width: 100, height: 50 }
        },

        inertia: true
      })
      .on('resizemove', function (event) {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || 0)
        let y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
      })
  },

  methods: {
    position () {
      const area = this.$refs.area
      return {
        top: area.getAttribute('data-y') || 0,
        left: area.getAttribute('data-x') || 0,
        width: area.offsetWidth,
        height: area.offsetHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.crop-wrapper {
  display: inline-block;
  position: relative;
  height: auto;
}

.shade {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.crop-area {
  color: #fff;
  position: absolute;
  z-index: 4;
  width: 200px;
  height: 200px;
  left: 0;
  top: 0;
  border: 2px dashed red;
  background: none;
}
</style>
