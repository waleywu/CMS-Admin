<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>敏感词管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form label-width="120px" :model="sensitiveWord" ref="form1">
      <el-form-item label="敏感词">
        <el-input
          v-model="sensitiveWord.sensitiveWords"
          placeholder="每个敏感词用','分割"
          type="textarea"
          rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="保存文章时检测">
        <el-switch v-model="sensitiveWord.savedEnabled" active-text="启用" inactive-text="关闭"></el-switch>
      </el-form-item>
      <el-form-item label="发布文章时检测">
        <el-switch v-model="sensitiveWord.pubishedEnabled" active-text="启用" inactive-text="关闭"></el-switch>
      </el-form-item>
      <el-form-item label="强制规则">
        <el-switch
          v-model="sensitiveWord.peremptory"
          active-text="启用"
          inactive-text="关闭"
          @change="processAlert"
        ></el-switch>
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
      sensitiveWord: {
        sensitiveWords: "",
        savedEnabled: false,
        pubishedEnabled: false,
        peremptory: false,
      },
    };
  },
  created() {
    this.getSensitiveWord();
  },
  methods: {
    async getSensitiveWord() {
      try {
        let payload = await this.$service.get(
          "/api/configuration/sensitiveWord"
        );
        if (payload.error === null) {
          this.sensitiveWord = payload.result;
        } else {
          this.$message.error(payload.msg);
        }
      } catch (error) {
        this.$message.error("系统错误，请联系管理员");
      }
    },
    async save() {
      try {
        let payload = await this.$service.post(
          "/api/configuration/sensitiveWord/handle/update",
          this.sensitiveWord
        );
        if (payload.error !== null) {
          this.$message.error(payload.msg);
        } else {
          this.$message({ type: "success", message: "保存成功" });
        }
      } catch (error) {
        this.$message.error("系统错误，请联系管理员");
      }
    },
    processAlert(nvalue) {
      if (nvalue === true) {
        this.$alert(
          "当您打开强制规则后，没有通过敏感词筛查的文章将不能被保存",
          { type: "warning" }
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>