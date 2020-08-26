<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content">
          <overview></overview>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content"><trafficSummary></trafficSummary></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import trafficSummary from "./trafficSummary";
import overview from "./overview";
export default {
  data() {
    return {};
  },
  components: { trafficSummary, overview },
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
}

.grid-content {
  border-radius: 4px;

  background-color: white;
  padding: 10px;
}
</style>
