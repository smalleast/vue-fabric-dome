<template>
  <div class="home">
    <workbench-header></workbench-header>
    <el-container class="content-height">
      <el-aside width="auto">
        <workbench-aside></workbench-aside>
      </el-aside>
      <el-main>
        <workbench-editor></workbench-editor>
      </el-main>
    </el-container>
    <dialog-wrapper></dialog-wrapper>
  </div>
</template>

<script>
import WorkbenchHeader from '@/components/workbench/Header'
import WorkbenchAside from '@/components/workbench/Aside'
import WorkbenchEditor from '@/components/workbench/Editor'
import DialogWrapper from '@/components/dialog/DialogWrapper'

export default {
  components: {
    WorkbenchHeader,
    WorkbenchAside,
    WorkbenchEditor,
    DialogWrapper
  }
}
</script>

<style lang="scss" scoped>
.el-header,
.el-footer,
.el-main {
  padding: 0;
  position: relative;
}

.home .el-header {
  height: auto;
}
</style>
