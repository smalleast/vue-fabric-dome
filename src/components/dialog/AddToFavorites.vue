<template>
  <div class="add-to-favorites">
    <div class="cover" :style="{'background-image': `url(${cover.url})`}">
      <div class="property">
        <p>{{cover.name}}</p>
      </div>
    </div>
    <div class="list" v-if="!modeCreate">
      <el-input v-model="search" placeholder="查找收藏夹" clearable></el-input>
      <div class="favorite-rows">
        <div class="favorite"  v-for="row in filterRows" :key="row.id">
          <div class="name">
            {{row.name}}
          </div>
          <div class="btn">
            <el-button v-if="!row.collected" type="primary" size="mini" @click="handleClickFavorite(row)">收藏</el-button>
            <el-button v-else type="info" size="mini" @click="handleClickCancelFavorite(row)">已收藏</el-button>
          </div>
        </div>
      </div>
      <p class="bottom-btn" @click="modeCreate = true">
        <i class="iconfont icon-add"></i> 创建收藏夹
      </p>
    </div>
    <div class="list" v-else>
      <el-input placeholder="收藏夹标题" v-model="form.name"></el-input>
      <p class="bottom-btn">
        <el-button @click="handleCreate" type="primary">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      rows: [],
      payload: { // 查询收藏夹参数
        resourceId: 0,
        type: 0
      },
      cover: { // 封面图片
        url: '',
        name: '',
        price: 0
      },
      form: { // 创建收藏夹标题
        name: ''
      },
      search: '', // 搜索收藏夹
      modeCreate: false // 创建收藏夹模式
    }
  },

  computed: {
    filterRows () {
      if (this.search) {
        const rows = []
        for (const row of this.rows) {
          if (row.name.includes(this.search)) {
            rows.push(row)
          }
        }
        return rows
      }
      return this.rows
    }
  },

  methods: {
    init (payload, cover) {
      this.payload = payload
      this.cover = cover
      this.search = ''
      this.load()
    },

    handleCreate () {
      if (!this.form.name) {
        this.$message({ message: '收藏夹标题不能为空', type: 'success' })
        return
      }

      axios.post('/designer_api/collection/favorites', this.form).then(response => {
        this.load()
        this.handleCancel()
      })
    },

    handleCancel () {
      this.modeCreate = false
      this.form.name = ''
    },

    handleClickFavorite (currentRow) {
      const favoriteIds = []
      for (const row of this.rows) {
        if (row.collected) {
          favoriteIds.push(row.id)
        }
      }
      favoriteIds.push(currentRow.id)
      this.apply(favoriteIds, '收藏成功')
    },

    handleClickCancelFavorite (currentRow) {
      const favoriteIds = []
      for (const row of this.rows) {
        if (row.collected && row.id !== currentRow.id) {
          favoriteIds.push(row.id)
        }
      }
      this.apply(favoriteIds, '收藏取消')
    },

    apply (favoriteIds, message) {
      const data = {
        favoriteIds,
        ...this.payload
      }
      axios.post('/designer_api/collection/into_favorites', data).then(response => {
        this.$message({ message, type: 'success' })
        this.load()
      })
    },

    load () {
      axios.get('/designer_api/collection/my_favorites', {
        params: this.payload
      }).then(response => {
        this.rows = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-to-favorites {
  display: flex;
}

.cover {
  position: relative;
  width: 260px;
  height: 500px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background: url(http://oss.51xuewudao.cn/f0608dbd-bbbf-6454-0cbf-2d4afc53decb)
    no-repeat center;
  background-size: 80%;

  .property {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;

    p {
      margin: 0;
    }

    .price {
      color: #ff2905;
    }
  }
}

.list {
  width: 380px;
  padding: 20px;
  border-top: 1px solid #ddd;
  position: relative;

  .bottom-btn {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
  }
}

.favorite-rows {
  margin-top: 10px;
  max-height: 370px;
  overflow: auto;
}

.favorite {
  display: flex;
  align-items: center;
  margin: 10px 0;

  .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<style lang="scss">
.add-to-favorites {
  .btn .el-button {
    width: 60px;
    text-align: center;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
