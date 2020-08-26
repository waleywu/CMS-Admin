<template>
  <el-form label-width="80px" :model="userProfile" ref="form1" :rules="userProfileRule">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="userProfile.name"></el-input>
    </el-form-item>
    <el-form-item label="登录名" prop="loginName">
      <el-input v-model="userProfile.loginName"></el-input>
    </el-form-item>
    <el-form-item label="电子邮件" prop="email">
      <el-input v-model="userProfile.email" type="email"></el-input>
    </el-form-item>
    <el-form-item label="工号" prop="jobNumber">
      <el-input v-model="userProfile.jobNumber"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save()">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "userProfile",
  props: ["isEdit", "id", "type"],
  data() {
    return {
      userProfile: {
        naame: "",
        loginName: "",
        email: "",
        jobNumber: "",
      },
      userProfileRule: {
        name: [
          {
            required: true,
            message: "请输入您的姓名",
            trigget: "blur",
            transform(value) {
              return value.trim();
            },
          },
        ],
        loginName: [
          {
            required: true,
            message: "请输入您的系统登录名",
            trigget: "blur",
            transform(value) {
              return value.trim();
            },
          },
          {
            validator: (rule, value, callback) => {
              this.$service
                .post("/api/user/handle/checkLoginName", {
                  loginName: value,
                  id: this.id,
                  type: this.type,
                })
                .then((payload) => {
                  if (payload.result !== 0) callback(new Error());
                  else callback();
                })
                .catch((error) => {
                  callback(new error());
                });
            },
            message: "登陆名重复，请重新输入",
            trigget: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    if (this.type === "update") this.getUserProfile();
  },
  methods: {
    async getUserProfile() {
      let id = this.id || this.user.id;
      try {
        let payload = await this.$service.post("/api/user/handle/profile", {
          id: id,
        });

        this.userProfile = payload.result;
        this.$watch("userProfile", this.setStatus, { deep: true });
      } catch (error) {
        this.$message.error("操作失败，请联系管理员");
      }
    },
    setStatus(isEdit = true) {
      this.$emit("update:isEdit", isEdit);
    },
    save() {
      this.$refs["form1"].validate(async (valid) => {
        if (valid) {
          await this.saveHandler();
        }
      });
      this.$emit("update:type", "");
    },

    async saveHandler() {
      if (this.isEdit === false) {
        //关闭对话框
        this.$emit("update:visible", false);
        return;
      }
      try {
        let payload = await this.$service.post(
          "/api/user/handle/saveProfile",
          this.userProfile
        );
        if (payload.error === null) {
          this.setStatus(false);
          this.$message({
            message: payload.msg,
            type: "success",
          });
          //如果更新的是当前操作人员的信息，则同步用户
          if (this.userProfile.id === this.$store.state.user.id)
            this.$store.state.user.name = payload.result.name;
          //关闭对话框
          this.$emit("update:visible", false);
          //调用刷新
          this.$emit("refresh");
        } else {
          this.$message.error(payload.msg);
        }
      } catch (error) {
        this.$message.error("操作失败，请联系管理员");
      }
    },
  },
  // watch: {
  //   userProfile: {
  //     handler() {
  //       this.$emit("update:isEdit", true);
  //     },
  //     deep: true,
  //   },
  // },
};
</script>
<style lang="scss" scoped></style>
