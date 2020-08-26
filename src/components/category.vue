<template>
  <div class="categoryContainer">
    <h4>文章分类</h4>
    <el-tree
      :data="categories"
      :props="defaultProps"
      node-key="id"
      @node-click="nodeClick"
      default-expand-all
      :expand-on-click-node="false"
      v-loading="loading"
      highlight-current
      :current-node-key="this.$store.state.selectedCategoryId"
    ></el-tree>
  </div>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      categories: [],
      defaultProps: {
        children: "children",
        label: (data, node) => {
          return data.categorySrc.categoryName;
        },
      },
      loading: true,
    };
  },
  methods: {
    nodeClick(data, node, item) {
      this.$store.commit("changeCategory", data.categorySrc.id);
      this.$emit("changeCategory");
    },
    ...[mapMutations],
  },
  created() {
    this.$service
      .get("/api/category/categoryTree")
      .then((payload) => {
        this.categories = payload.result;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/css/site.scss";
.categoryContainer {
  background-color: white;
  margin-right: 8px;
  border-radius: 0.5rem;
  padding: 5px;
  h4 {
    text-align: center;
  }
  .el-tree {
    background-color: transparent;
  }
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: $default_blue1;
}
</style>