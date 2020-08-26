<template>
  <div>
    <label v-for="menu in menus" :key="menu.categorySrc.id">
      <el-submenu v-if="menu.children.length>0" :index="menu.categorySrc.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">{{menu.categorySrc.categoryName}}</span>
        </template>
        <navMenu :menus="menu.children"></navMenu>
      </el-submenu>
      <el-menu-item v-else :index="menu.categorySrc.id">{{menu.categorySrc.categoryName}}</el-menu-item>
    </label>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "navMenu",
  data() {
    return {};
  },
  props: {
    menus: {
      type: Array
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/css/site.scss";
.el-menu-item,
.el-submenu__title {
  border-radius: 0.5rem !important;
}
.el-menu-item:hover,
.el-menu-item:focus,
.el-submenu__title a {
  background-color: $default_blue1 !important;
  color: whitesmoke;
}
.el-menu-item {
  margin: 0 10px;
}
.el-submenu:hover,
.el-submenu__title:hover {
  background-color: transparent !important;
  cursor: auto;
}
.el-icon-arrow-down:before {
  color: whitesmoke;
}
</style>