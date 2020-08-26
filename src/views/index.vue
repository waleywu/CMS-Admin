<template>
  <div>
    <el-container>
      <el-aside>
        <el-menu
          :collapse="false"
          text-color="#edf2f7"
          active-text-color="#ffffff"
          router
          default-active="/summary"
        >
          <div class="aside-header">
            <div>内容管理系统</div>
          </div>
          <el-menu-item index="/summary">
            <i class="fas fa-chart-line"></i>
            <span>统计</span>
          </el-menu-item>
          <el-menu-item index="/articleList">
            <i class="fas fa-sticky-note"></i>
            <span>内容</span>
          </el-menu-item>
          <el-submenu popper-class="sub" index>
            <template slot="title">
              <i class="fas fa-tools"></i>
              <span>设置</span>
            </template>
            <el-menu-item index="/configuration/seo" route>
              <i class="fab fa-google"></i>
              <span>全局SEO设置</span>
            </el-menu-item>
            <el-menu-item index="/configuration/sensitiveWord" route>
              <i class="fas fa-eye-slash"></i>
              <span>敏感词管理</span>
            </el-menu-item>
            <el-menu-item index="/configuration/userList" route>
              <i class="fas fa-users"></i>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/configuration/right" route>
              <i class="fab fa-expeditedssl"></i>
              <span>权限管理</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <loginBar @logout="logout"></loginBar>
        </el-header>
        <el-main>
          <div>
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
// import navMenu from "../components/Nav";
import loginBar from "../components/loginBar";
import { mapState, mapMutations } from "vuex";
export default {
  name: "appIndex",
  data() {
    return {
      menus: [],
      interval: null,
    };
  },
  created() {
    // this.checkToken();
  },
  components: {
    loginBar,
  },
  computed: {
    ...mapState(["token", "user"]),
  },
  methods: {
    async logout() {
      if (this.interval != null) clearInterval(this.interval);
      let payload = await this.$service.post("/api/user/handle/logout");
      this.reset();
      this.$router.replace("/login");
    },
    /**
     * 判断token是否正确，如果已经不正确，则转到登陆页面
     */
    checkToken() {
      this.interval = setInterval(() => {
        this.$service
          .post("/api/user/handle/checkOverLogin")
          .then((payload) => {
            if (payload.result === false) {
              clearInterval(this.interval);
              this.interval = null;
              this.$msgbox({
                message: "系统发现您在其他终端上登录，当前系统将注销",
                type: "warning",
              })
                .then(() => {
                  this.logout();
                })
                .catch(() => {
                  this.logout();
                });
            }
          });
      }, 5000);
    },
    ...mapMutations(["reset"]),
  },
};
</script>
<style lang="scss">
@import "../assets/css/site.scss";
.el-aside {
  color: white;
  width: 210px !important;
  position: fixed;
  left: 0;
  height: 100%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: $default_blue2;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-main {
  padding-left: 220px !important;
}

.el-header {
  // margin: 20px 20px 0 220px;
  display: flex;
  height: 80px;
  /* flex-direction: row-reverse; */
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  // border-radius: 0.5rem;
}
.el-menu {
  background-color: transparent;
  width: 100%;
  .el-menu-item {
    background-color: $default_blue2;
    &:hover {
      background-color: $default_blue1;
    }
    &.is-active {
      background-color: $default_blue1;
    }
    span {
      margin-left: 10px;
    }
  }
  .el-submenu {
    span {
      margin-left: 10px;
    }
  }
}
.el-submenu__title {
  background-color: $default_blue2;
  font-size: 1.2rem;
  &:hover {
    background-color: $default_blue1 !important;
  }
}

.aside-header {
  height: 60px;
  background-color: $default_blue1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  & > div {
    font-size: 1.7rem;
    text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.4rem;
  }
}
</style>
