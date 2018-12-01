<template>
  <div class="design-detail">
    <div class="cover-wrapper">
      <div class="cover">
        <img :src="ossFullURL(value.coverFile.key)">
        <div class="shadow">
          <i class="iconfont icon-move" @click="handleClickMove"></i>
        </div>
      </div>
      <p>单品列表</p>
    </div>

    <div class="product-list">
      <div class="product" v-for="product in productList" :key="product.id">
        <product-card :product="product" mini></product-card>
      </div>
    </div>

    <div class="property-wrapper">
      <div class="row">
        <div>
          <p class="name">{{value.name}}<span class="original">原创</span></p>
        </div>
        <!-- <div class="star">
          <i class="iconfont icon-xingxing"></i>
        </div> -->
      </div>
      <div class="row">
        <div>
          <p class="tag" v-if="value.style || value.scene">
            <span v-if="value.style">#{{value.style}}#</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span v-if="value.scene">#{{value.scene}}#</span>
          </p>
        </div>
        <!-- <div class="star">
          <p class="count">456567</p>
        </div> -->
      </div>
      <div class="author">
        <div>
          <img v-if="avatar" class="avatar" :src="avatar">
          <div v-else class="default-avatar" :style="{'background-color': avatarBackgroundColor}"></div>
        </div>
        <div class="info">
          <p class="username">{{profile.loginName}}</p>
          <p class="source">更新于{{updateTime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import GE from '@/constants/global-events'
import { ossFullURL, uniqueProductSet, randomColor } from '@/util'
import ProductCard from '@/components/fragment/ProductCard'

export default {
  props: ['value'],

  components: {
    ProductCard
  },

  data () {
    return {
      productList: [],
      avatarBackgroundColor: randomColor()
    }
  },

  computed: {
    profile () {
      return this.$store.state.profile
    },
    avatar () {
      const { avatarFile } = this.$store.state.profile
      return avatarFile.key && ossFullURL(avatarFile.key)
    },
    updateTime () {
      return dayjs(this.value.updateTime).format('YYYY-MM-DD')
    }
  },

  methods: {
    ossFullURL,

    handleClickMove () {
      this.$emit(GE.LOAD_CANVAS_DATA, this.value)
    }
  },

  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler (val, oldVal) {
        let { canvasData } = val
        if (!canvasData) return

        const { objects } = JSON.parse(canvasData)
        this.productList = uniqueProductSet(objects)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.design-detail {
  padding: 30px 0;
}

.cover-wrapper {
  padding: 0 10px;
}

.cover {
  position: relative;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;

  img {
    display: block;
    width: 100%;
    border-radius: 4px;
  }

  .shadow {
    display: none;
    cursor: zoom-in;
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 4px;
    height: calc(100% - 10px * 2);
    width: calc(100% - 10px * 2);
    padding: 10px;
    text-align: right;
  }

  .iconfont {
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

.cover:hover {
  .shadow {
    display: block;
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

.property-wrapper {
  border-radius: 5px;
  color: #272524;
  background-color: #fff;
  padding: 20px;
  margin: 20px 10px;
}

.row {
  display: flex;
  align-items: center;
  p {
    margin: 0;
  }

  .star {
    flex: 1;
    text-align: right;
  }

  .star i {
    font-size: 20px;
  }

  .star .count {
    font-size: 12px;
    color: #757575;
  }

  .star i,
  p.count {
    display: inline-block;
    width: 50px;
    text-align: center;
  }

  .name {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .tag {
    font-size: 12px;
    color: #a59f95;
  }
}

.avatar {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 100px;
}

.default-avatar {
  @extend .avatar;
}

.author {
  margin-top: 20px;
  display: flex;
  align-items: center;

  .info {
    margin-left: 20px;
    p {
      margin: 0;
    }
    .username {
      font-size: 14px;
      font-weight: 450;
      margin: 0;
    }
    .source {
      margin-top: 5px;
      font-size: 12px;
      color: #a59f95;
    }
  }
}

.original {
  background: rgba(211, 197, 175, 1);
  border-radius: 4px;
  margin-left: 10px;
  font-size: 12px;
  color: #fff;
  padding: 1px 5px;
}
</style>
