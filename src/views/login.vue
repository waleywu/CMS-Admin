<template>
  <div class="bg">
    <div class="login-container">
      <el-row>
        <el-col :span="14">
          <el-form
            ref="ruleForm"
            :model="loginInfo"
            label-width="80px"
            label-position="top"
            :rules="rules"
          >
            <el-form-item label="登录名" label-width="100px" prop="loginName">
              <el-input v-model="loginInfo.loginName" placeholder="请输入登录名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginInfo.password" show-password placeholder="请输入登录密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmitAsync"
                v-loading.fullscreen.lock="fullscreenLoading"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <aside class="login-jie"></aside>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";

export default {
  name: "login",
  data() {
    return {
      loginInfo: {
        loginName: "",
        password: "",
      },
      fullscreenLoading: false,
      rules: {
        loginName: [
          { required: true, message: "必须输入登录名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "必须输入登录密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onSubmitAsync() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          try {
            let payload = await this.$service.post(
              "/api/user/login",
              this.loginInfo
            );
            if (payload.error === null) {
              this.loginSuccess(payload);
              this.$router.replace({ path: "/summary" });
            } else {
              this.$message({
                message: payload.msg,
                type: "error",
              });
            }
          } catch (error) {
            this.$message({
              message: error.msg,
              type: "error",
            });
          } finally {
            this.fullscreenLoading = false;
          }
        }
      });
    },
    ...mapMutations(["loginSuccess"]),
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>
<style scoped>
.bg {
  background-image: url(../assets/auth-bg.jpg);
  background-repeat: no-repeat;
  background-clip: border-box;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
}
.login-container {
  width: 800px;
  height: 450px;
  border: 1px solid #dfdfdf;
  background-color: white;

  box-shadow: -8px 20px 25px 0 rgba(25, 42, 70, 0.3);
}
.el-form {
  background-color: white !important;
  padding: 50px;
}
.el-button {
  width: 100%;
  margin-top: 20px;
}
.login-jie {
  background-color: #667eea;
  background-image: url(../assets/login.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
