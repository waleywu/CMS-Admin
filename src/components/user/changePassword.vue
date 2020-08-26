<template>
  <el-form
    label-width="80px"
    :model="changPwdModel"
    :rules="changePwdRules"
    ref="form1"
  >
    <el-form-item label="原密码" prop="opwd">
      <el-input v-model="changPwdModel.opwd" type="password"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="npwd">
      <el-input v-model="changPwdModel.npwd" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="cpwd">
      <el-input v-model="changPwdModel.cpwd" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('form1')">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "changePassword",
  data() {
    return {
      changPwdModel: {
        opwd: "",
        npwd: "",
        cpwd: "",
      },
      changePwdRules: {
        opwd: [
          {
            required: true,
            message: "请输入原密码",
            trigget: "blur",
          },
        ],
        npwd: [
          {
            required: true,
            message: "请输入新密码",
            trigget: "blur",
          },
          {
            pattern: /[^\s]{6,}/,
            message: "密码格式错误（可使用数字、英文字母及符号，最少6位）",
            trigget: "blur",
          },
        ],
        cpwd: [
          {
            required: true,
            message: "请输入确认密码",
            trigget: "blur",
          },
          {
            validator: this.validate_cpwd,
            message: "两次输入的密码不匹配",
            trigget: "blur",
          },
        ],
      },
    };
  },
  methods: {
    validate_cpwd(rule, value, cb) {
      if (value !== this.changPwdModel.npwd)
        cb(new Error("两次密码输入不一致"));
      else cb();
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let payload = await this.$service.post(
            "/api/user/handle/changePwd",
            this.changPwdModel
          );
          if (payload.error != null) {
            this.$message.error(payload.msg);
          } else {
            this.$message({
              message: payload.msg,
              type: "success",
            });
            this.$emit("update:visible", false);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
