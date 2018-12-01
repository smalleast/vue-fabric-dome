<template>
  <!--
    @click event
    此处需要点击产品卡片除收藏、添加到画布按钮的任意位置，发射 click 事件
    只在某一元素上添加 click 无法满足要求，所以添加了三个 click 事件监听
    click.self 只当在 event.target 是当前元素自身时触发处理函数, 即事件不是从内部元素触发的
  -->
  <div class="product-card" :class="{mini: mini}" @click.self="handleClickProduct">
    <div class="product-content" @click="handleClickProduct">
      <i class="cover" v-if="product.coverFile" :style="{'background-image': `url(${ossFullURL(product.coverFile.key)})`}"></i>
      <div class="property" v-show="!mini">
        <p class="name">{{product.name}}</p>
        <p class="price">{{price}}</p>
      </div>
    </div>
    <div class="shadow" @click.self="handleClickProduct">
      <!-- 插槽，允许父组件改变阴影左边按钮的行为 -->
      <slot name="shadow-btn-left">
        <i class="iconfont left icon-star" @click="handleClickStar"></i>
      </slot>
      <i @click="$emit(GE.ADD_TO_CANVAS, product)" class="iconfont icon-move"></i>
    </div>
  </div>
</template>

<script>
import { ossFullURL } from '@/util'
import GE from '@/constants/global-events'
import { FAVORITE_TYPE } from '@/constants'

export default {
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    mini: Boolean
  },

  computed: {
    /**
     * 产品落地价
     * 默认取第一个规格的价格，如果价格为0，显示暂无落地价
     */
    price () {
      const [defaultSpecs] = this.product.specs
      return (defaultSpecs && defaultSpecs.quotedPrice && `￥${defaultSpecs.quotedPrice}`) || '暂无报价'
    }
  },

  data () {
    return {
      GE
    }
  },

  methods: {
    ossFullURL,
    handleClickProduct () {
      this.$emit('click', this.product)
    },

    handleClickStar () {
      const { product } = this
      this.$emit(GE.OPEN_DIALOG_ADD_TO_FAVORITES, {
        resourceId: product.id,
        type: FAVORITE_TYPE.PRODUCT
      }, {
        url: ossFullURL(product.coverFile.key),
        name: product.name,
        price: 4850
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$cover-height: 120px;
$cover-margin: 10px;

.product-card {
  position: relative;
  cursor: zoom-in;
  color: #333;
  margin: 5px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  text-align: left;

  .shadow {
    margin: $cover-margin;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 10px;
    width: calc(100% - #{$cover-margin * 2});
    height: $cover-height;
    background-color: rgba(0, 0, 0, .2);
    border-radius: 5px;
    z-index: 5;
  }
}

.product-card:hover {
  .shadow {
    display: block;
  }
}

.price {
  font-size: 13px;
  color: #878787;
}

.cover {
  margin: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: no-repeat center / contain;
  will-change: transform;
  height: $cover-height;
}

.product-content {
  position: relative;
}

.product-content::before {
  content: "";
  display: block;
  padding-top: $cover-height + $cover-margin + $cover-margin;
}

.mini {
  .cover {
    margin: 0;
  }

  .product-content::before {
    content: "";
    display: block;
    padding-top: $cover-height;
  }

  .shadow {
    margin: 0;
    left: 0;
    width: 100%;
  }
}

.property {
  padding: 10px 10px;
  padding-top: 0;

  p {
    margin: 0;
    line-height: 22px;
  }
  p.name {
    width: 100px;
  }
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
}

i.icon-coll_xuanzhong {
  color: #D7D7D7;
}

.icon-xingxing,
.iconfont.left {
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  font-size: 20px;
  border-radius: 4px;
  height: 30px;
  width: 30px;
  text-align: center;
  line-height: 30px;
}

.icon-move {
  @extend .icon-xingxing;
  font-size: 18px;
  float: right;
}
</style>
