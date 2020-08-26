<template>
  <div class="loginBarContainer">
    <div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="fas fa-user"></i>
          {{ user.name }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">
            <i class="far fa-address-card"></i>
            <span style="padding-left:10px">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item command="changePassword">
            <i class="fas fa-user-lock"></i>
            <span style="padding-left:10px">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span style="padding-left:10px">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-input placeholder="请输入内容">
        <i slot="prefix" class="el-input__icon fas fa-search"></i>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!---    修改密码对话框 开始--------------->
    <el-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      width="30%"
      :title="dialogTitle"
      show-close
      :close-on-click-modal="false"
    >
      <component :is="com" :isEdit.sync="isEdit" :visible.sync="visible"></component>
    </el-dialog>
    <!---    修改密码对话框 结束--------------->
  </div>
</template>
<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";
export default {
  name: "loginBar",
  data() {
    return {
      visible: false,
      dialogTitle: "",
      isEdit: false,
      com: null,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
    handleCommand(command) {
      switch (command) {
        case "changePassword":
          this.com = () => import("./user/changePassword");
          this.dialogTitle = "修改密码";
          this.visible = true;
          break;
        case "profile":
          this.com = () => import("./user/profile");
          this.dialogTitle = "个人信息";
          this.visible = true;
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    handleClose(done) {
      if (this.isEdit) {
        this.$confirm("确定放弃修改吗？", "", { type: "warning" })
          .then(() => {
            this.isEdit = false;
            done();
          })
          .catch(() => {});
      } else {
        done();
      }
    },
    ...mapMutations(["reset"]),
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/css/site.scss";
.loginBarContainer {
  background-color: white;
  display: flex;
  align-items: center;
  justify-items: right;
  flex-direction: row-reverse;
  // margin: 0 30px;
  > div {
    margin: 0 10px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  line-height: 60px;
  font-size: $default_fontSize1;
  display: inline-block;
  transition: 0.5s;
  padding: 0 20px;
  &:hover {
    background-color: $default_blue2;
    color: whitesmoke;
  }
}
.el-input {
  width: 30rem;
}
</style>
