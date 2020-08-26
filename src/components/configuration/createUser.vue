<template>
  <div>
    <div class="breadcrumb_container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'userList' }">返回用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ this.$route.meta.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
</style>