<template>
  <div class="container">
    <h1>Fabric Test</h1>
    <workbench-editor></workbench-editor>
  </div>
</template>

<script>
import WorkbenchEditor from '@/components/workbench/Editor'
import GE from '@/constants/global-events'

export default {
  components: {
    WorkbenchEditor
  },

  mounted () {
    this.$emit(GE.ADD_TO_CANVAS, {
      coverFile: {
        key: '09df4441-1ca5-7fad-3237-c0c2ed2c25ef?x-oss-process=style/w660'
      }
    })
  }
}
</script>
