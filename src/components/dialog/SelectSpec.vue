<template>
  <div class="select-spec-dialog">
    <div class="specs">
      <div class="spec" v-for="(row, index) in value.specs" :key="row.id" @click="selectedSpecIndex = index">
        <i class="cover" :style="styleCover(value, row)"></i>
        <div class="property">
          <p>{{row.color}}</p>
          <p>尺寸：{{row.size}}</p>
          <p>材质：{{row.material}}</p>
        </div>
        <div class="radio">
          <el-radio v-model="selectedSpecIndex" :label="index">&nbsp;</el-radio>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <el-button type="primary" @click="handleOk">确认</el-button>
    </div>
  </div>
</template>

<script>
import { ossFullURL } from '@/util'
export default {
  props: ['value'],

  data () {
    return {
      selectedSpecIndex: 0
    }
  },

  methods: {
    ossFullURL,

    handleOk () {
      this.$emit('select', this.value.id, this.value.specs[this.selectedSpecIndex])
    },

    styleCover (value, row) {
      // 如果有规格图片，取规格图片，否则取产品主图
      const key = (row.specFile && row.specFile.key) || value.coverFile.key
      return {
        'background-image': `url(${ossFullURL(key)})`
      }
    }
  },

  watch: {
    value: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      // 重置已选择的规格下标为0
      handler (val, oldVal) {
        this.selectedSpecIndex = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.specs {
  max-height: 60vh;
  overflow: auto;
}

.spec {
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: rgba(251,251,251,1);
  border-radius: 4px;
  margin-bottom: 20px;
}

.property {
  flex: 1;
  padding-left: 10px;
}

.radio {
  margin-right: 20px;
}

.cover {
  margin: 10px;
  height: 84px;
  width: 126px;
  background: no-repeat center / contain;
  will-change: transform;
  background-image: url("http://zhulogic-dev.oss-cn-hangzhou.aliyuncs.com/03a62080-f801-df5e-f29e-b1574021c4f8?x-oss-process=style/w660");
}

.button-wrapper {
  margin-top: 30px;
  text-align: center;

  button {
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
