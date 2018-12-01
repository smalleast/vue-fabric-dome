<template>
  <div class="design-card">
    <div class="design-content" @click.self="handleClickDesign">
      <i class="cover" v-if="value.coverFile" :style="{'background-image': `url(${ossFullURL(value.coverFile.key)})`}"></i>
      <div class="name">{{value.name}}</div>
    </div>
    <div class="shadow" @click.self="handleClickDesign">
      <i class="iconfont left icon-del1" @click="handleRemove"></i>
      <slot name="arrow">
        <i class="iconfont right icon-move" @click="handleClickArrow"></i>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GE from '@/constants/global-events'
import { ossFullURL } from '@/util'

export default {
  props: ['value'],
  methods: {
    ossFullURL,
    handleClickDesign () {
      this.$emit('click', this.value)
    },

    handleClickArrow () {
      this.$emit('clickArrow', this.value)
    },

    handleRemove () {
      this.$confirm('确认删除拼图？').then(_ => {
        axios.delete(`/designer_api/board/${this.value.id}`).then(_ => {
          this.$emit(GE.REFRESH_DESIGNS)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$cover-height: 200px;

.design-card {
  position: relative;
  cursor: zoom-in;
  color: #333;
  margin: 5px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 4px;
  text-align: left;
  padding: 10px;

  .shadow {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px;
    box-sizing: border-box;
    padding: 10px;
    width: calc(100% - 10px * 2);
    height: $cover-height;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 4px;
    z-index: 5;
  }
}

.design-card:hover {
  .shadow {
    display: block;
  }
}

.cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: no-repeat center / contain;
  will-change: transform;
  height: $cover-height;
}

.design-content {
  position: relative;
}

.design-content::before {
  content: "";
  display: block;
  padding-top: $cover-height;
}

.name {
  padding: 10px 0 0 0;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
}

.icon-xingxing,
.left {
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  font-size: 20px;
  border-radius: 4px;
  height: 40px;
  width: 40px;
  text-align: center;
  line-height: 40px;
}

.icon-move,
.right {
  @extend .icon-xingxing;
  float: right;
}
</style>
