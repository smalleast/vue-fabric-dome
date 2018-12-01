<template>
  <div class="back-top" @click="handleBackTop" v-show="isShow">
    <i class="iconfont icon-jiantou"></i>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: () => 400
    },
    selector: {
      type: String,
      default: () => '.workbench-aside .content'
    }
  },

  data () {
    return {
      container: {},
      position: 0
    }
  },

  computed: {
    isShow () {
      return this.position > this.height
    }
  },

  mounted () {
    this.container = document.querySelector(this.selector)
    this.container.onscroll = event => {
      this.position = event.target.scrollTop
    }
  },

  methods: {
    handleBackTop () {
      scrollTop(this.container, this.position, 0)
    }
  }
}

function scrollTop (el, from = 0, to, duration = 500, timing = 'linear') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / ((duration * 60) / 1000))
  const scale =
    1 / (1 - Math.pow(10 / difference, 1 / ((60 * duration) / 1000 - 10)))

  function scrollLinear (start, end, step) {
    if (start === end) return
    let d = start + step > end ? end : start + step

    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scrollLinear(d, end, step))
  }

  function scrollEase (start, end) {
    if (start === end) return
    let stepNum = Math.ceil(Math.abs(start - end) / scale)
    stepNum = stepNum > 0 ? Math.ceil(stepNum) : Math.floor(stepNum)

    let d = start + stepNum > end ? end : start + stepNum

    if (start > end) {
      d = start - stepNum < end ? end : start - stepNum
    }
    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scrollEase(d, end))
  }

  if (timing === 'ease') {
    scrollEase(from, to)
  } else {
    scrollLinear(from, to, step)
  }
}
</script>

<style lang="scss" scoped>
.back-top {
  cursor: pointer;
  display: inline-block;
  border-radius: 4px;
  background-color: #F3A534;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  position: fixed;
  left: 600px;
  bottom: 30px;
  z-index: 99;

  i {
    font-size: 24px;
  }
}
</style>
