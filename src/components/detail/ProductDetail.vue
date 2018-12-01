<template>
  <div class="product-detail">
    <div v-if="value.coverFile">
      <div class="p10">
        <div class="cover-wrapper">
          <div class="cover">
            <i class="product" :style="{'background-image': `url(${ossFullURL(value.coverFile.key)})`}">
              <div class="btn-wrapper">
                <div><i class="iconfont icon-star" @click="handleClickStar"></i></div>
                <div class="right-btn"><i class="iconfont icon-move" @click="$emit(GE.ADD_TO_CANVAS, value)"></i></div>
                <div class="download-btn"><i class="iconfont icon-downloaad" @click="handleDownloadCover"></i></div>
              </div>
            </i>
          </div>
        </div>
        <div class="property" v-if="!value.own">
          <div class="name-wrapper">
            <div class="name">{{value.name}} <span class="code">{{value.code}}</span></div>
          </div>
          <ol>
            <li v-if="price">
              <span class="label price">落地参考价</span>
              <div>{{price}}</div>
            </li>
            <li v-if="spec.color">
              <span class="label">颜色</span>
              <div>{{spec.color}}</div>
            </li>
            <li v-if="spec.size">
              <span class="label">尺寸</span>
              <div>{{spec.size}}</div>
            </li>
            <li v-if="spec.material">
              <span class="label">材质</span>
              <div>{{spec.material}}</div>
            </li>
          </ol>
        </div>
      </div>
      <p class="p10" align="left">相似单品</p>
      <div class="product-list" v-loading="$store.getters.isLoading">
        <div class="product" v-for="product in list.similar" :key="product.id">
          <product-card :product="product" mini></product-card>
        </div>
      </div>
      <p class="p10" style="margin-top: 11px;" align="left">热门定制</p>
      <div class="product-list">
        <div class="product" v-for="product in list.hot" :key="product.id">
          <product-card :product="product" mini></product-card>
        </div>
      </div>
    </div>
    <div class="no-data" v-if="!value.coverFile">
      <img src="@/assets/no-select.png">
      <p>提示：点击右侧画布上的单品，可以在这里看到详情哦～～～</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GE from '@/constants/global-events'
import { ossFullURL, downloadURI } from '@/util'
import { FAVORITE_TYPE } from '@/constants'

import ProductCard from '@/components/fragment/ProductCard'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        coverFile: {}
      })
    }
  },

  data () {
    return {
      GE,
      list: {
        similar: [],
        hot: []
      }
    }
  },

  components: {
    ProductCard
  },

  computed: {
    spec () {
      const { value } = this
      if (value.specs && value.specs.length > 0) {
        return value.specs[0]
      }
      return {}
    },

    /**
     * 产品落地价
     * 默认取第一个规格的价格，如果价格为0，显示暂无落地价
     */
    price () {
      const [defaultSpecs] = this.value.specs
      return (defaultSpecs.quotedPrice && `￥${defaultSpecs.quotedPrice}`) || 0
    }
  },

  created () {
    this.init()
  },

  methods: {
    ossFullURL,

    init () {
      if (!this.list.hot && this.list.hot.length > 0) return
      axios.get('/designer_api/show/page/v2?pageNum=1&pageSize=10&platform=web').then(response => {
        this.list.hot = response.data.productResponseVOList
      })
    },

    load (product) {
      this.list.similar = []
      axios.get('/designer_api/products/similar', {
        params: {
          productId: product.id
        }
      }).then(response => {
        this.list.similar = response.data.slice(0, 10)
      })
    },

    handleClickStar () {
      const { value } = this
      this.$emit(GE.OPEN_DIALOG_ADD_TO_FAVORITES, {
        resourceId: value.id,
        type: FAVORITE_TYPE.PRODUCT
      }, {
        url: ossFullURL(value.coverFile.key),
        name: value.name,
        price: 4850
      })
    },

    handleDownloadCover () {
      const { coverFile } = this.value
      downloadURI(ossFullURL(coverFile.key), coverFile.name)
    }
  },

  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler (val, oldVal) {
        this.load(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  padding: 30px 0;
}

.cover-wrapper {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.cover {
  cursor: zoom-in;
  position: relative;
  height: 400px;
  width: 100%;

  i.product {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background: no-repeat center / contain;
    will-change: transform;
    z-index: 7;
  }
}

.cover:hover {
  .btn-wrapper {
    display: flex;
  }
}

.btn-wrapper {
  display: none;
  padding: 10px;

  .right-btn {
    flex: 1;
    text-align: right;
  }

  .download-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  i.iconfont {
    color: #000;
    cursor: pointer;
    display: inline-block;
    background-color: #fff;
    font-size: 20px;
    border-radius: 4px;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(6, 31, 50, 0.18);
  }
}

.property {
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  text-align: left;
  padding: 20px;
  margin-top: 10px;
  color: #333;
}

.name-wrapper {
  display: flex;
  align-items: center;

  .name {
    flex: 1;
    font-size: 18px;
  }

  .code {
    font-size: 12px;
    background: rgba(243,165,52,1);
    border-radius: 2px;
    padding: 2px 5px;
    color: #fff;
    margin-left: 10px;
  }

  .price {
    color: #727272;
    font-size: 14px;

    span {
      color: #ea2d26;
    }
  }
}

ol {
  margin-top: 20px;
  list-style: none;
  padding: 0;
  font-size: 12px;
  margin-bottom: 0;

  li {
    display: flex;

    div {
      flex: 1;
    }
  }

  .label {
    color: #91908E;
    display: block;
    width: 70px;
    margin-right: 10px;
    margin-bottom: 12px;
  }
}

.product-list {
  padding: 0 5px;
  margin-top: -5px;
  display: flex;
  flex-wrap: wrap;

  .product {
    width: 20%;
  }
}
</style>

<style lang="scss">
.product-detail {
  .el-loading-mask {
    background: none;
  }
}
</style>
