<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>SEO全局设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form label-width="90px" :model="seo" ref="form1">
      <el-form-item label="关键词">
        <el-input v-model="seo.keywords" placeholder="每个关键词用','分割"></el-input>
      </el-form-item>
      <el-form-item label="首页关键词">
        <el-input v-model="seo.homepageKeywords" placeholder="每个关键词用','分割"></el-input>
      </el-form-item>
      <el-form-item label="站点描述">
        <el-input v-model="seo.description"></el-input>
      </el-form-item>
      <el-form-item label="Meta标签">
        <el-input
          v-model="seo.metas"
          type="textarea"
          rows="10"
          placeholder="可以放置<meta>、<script>、<link>、<style>标签，请让专业人士填写"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save()">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seo: {},
    };
  },
  created() {
    this.getSEO();
  },
  methods: {
    async getSEO() {
      let payload = await this.$service.get("/api/configuration/seo");
      this.seo = payload.result;
    },
    async save() {
      let payload = await this.$service.post(
        "/api/configuration/seo/handle/update",
        this.seo
      );
      if (payload.error !== null) {
        this.$message.error(payload.msg);
      } else {
        this.$message({ type: "success", message: "保存成功" });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>