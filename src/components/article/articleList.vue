<template>
  <div>
    <el-row type="flex" class="row-bg">
      <el-col :span="3">
        <category v-on:changeCategory="this.refrashArticle" />
      </el-col>
      <el-col :span="21">
        <el-form :inline="true" :model="params" class="search_container">
          <el-form-item label="关键词">
            <el-input v-model="params.filter.words" placeholder="文章内容、标题、描述"></el-input>
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker v-model="params.filter.publishDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="文章状态">
            <el-select v-model="params.filter.removed" clearable>
              <el-option label="全部" value="null"></el-option>
              <el-option label="已下架" value="true"></el-option>
              <el-option label="正常" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章置顶">
            <el-select v-model="params.filter.isTop" clearable>
              <el-option label="全部" value="null"></el-option>
              <el-option label="已置顶" value="true"></el-option>
              <el-option label="未置顶" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search" size="mini">查询</el-button>
          </el-form-item>
        </el-form>

        <div class="table_Container">
          <el-table
            v-loading="loading"
            :data="table_data"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column width="70px" fixed>
              <template slot-scope="scope">
                <div class="flex_container">
                  <div class="tableStatus" :class="{ removed: scope.row.removed}"></div>
                  <div v-show="scope.row.isTop">
                    <i class="fas fa-level-up-alt" style="color:#E6A23C"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pageViews" label="阅览数" width="100"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                {{
                scope.row | articleState
                }}
              </template>
            </el-table-column>
            <el-table-column label="类目" width="100">
              <template slot-scope="scope">
                {{
                scope.row | articleCategory
                }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100">
              <template slot-scope="scope">
                {{
                scope.row | articleType
                }}
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="100"></el-table-column>
            <el-table-column prop="publishDate" label="发布日期" :formatter="dateFormatter" width="200"></el-table-column>
            <el-table-column label="编辑" width="50">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="下架" width="50">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="fas fa-trash-alt"
                  size="mini"
                  @click="remove(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column label="置顶" width="60">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="setTop(scope.row)">
                  <i class="fas fa-level-up-alt"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="dataCount"
            small
            :page-size="params.pageSize"
            @current-change="pageChange"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import category from "../category";
import * as cfg from "../../app.cfg";
import moment from "moment";
import _ from "lodash";
export default {
  data() {
    return {
      table_data: [],
      params: {
        fields: "-content",
        filter: {
          removed: "false",
          isTop: "null",
        },
        sort: { isTop: -1, publishDate: -1 },
      },
      dataCount: 0,
      loading: null,
    };
  },
  components: {
    category,
  },
  created() {
    this.params = this.$store.state.tableFilterParams.get("article");
    this.refreshData();
  },
  methods: {
    refrashArticle() {
      if (this.params.filter.category === undefined) {
        this.$set(
          this.params.filter,
          "category",
          this.$store.state.selectedCategoryId
        );
      } else {
        this.params.filter.category = this.$store.state.selectedCategoryId;
      }
      this.refreshData();
    },
    refreshData() {
      this.loading = true;
      this.$service
        .post("/api/article", { params: this.params })
        .then((payload) => {
          this.table_data = payload.result.data;
          this.dataCount = payload.result.total;
        })
        .catch((error) => {
          this.$message.error("加载失败，请联系管理员");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    dateFormatter(row, column) {
      return moment(row.publishDate).format("YYYY-MM-DD");
    },
    edit(row) {
      let _id = row.id || row._id;
      this.$router.push({ name: "editArticle", params: { id: _id } });
    },
    pageChange(index) {
      this.params.pageNumber = index;
      this.refrashArticle();
    },
    async remove({ id, removed }) {
      let payload = await this.$service.post("/api/article/handle/remove", {
        id: id,
        removed: removed,
      });

      if (payload.error === null) {
        this.refreshData();
        this.$message({
          message: payload.msg,
          type: "success",
        });
      } else {
        this.$message.error(payload.msg);
      }
    },
    async setTop({ id, isTop }) {
      try {
        let payload = await this.$service.post("/api/article/handle/setTop", {
          id,
          isTop,
        });

        if (payload.error === null) {
          this.refreshData();
          this.$message({
            message: payload.msg,
            type: "success",
          });
        } else {
          this.$message.error(payload.msg);
        }
      } catch (error) {
        this.$message.error("操作失败，请联系管理员");
      }
    },
    async search() {
      let loading = this.$loading();
      await this.refreshData();
      loading.close();
      // console.log(this.params);
    },
  },
  watch: {},
  filters: {
    articleState(row) {
      let state = [];
      let { isTemporary, removed } = row;
      if (isTemporary === true) state.push("草稿");

      if (removed === true) state.push("已下架");

      if (state.length === 0) state.push("已发布");

      return state.join();
    },
    articleType(row) {
      let { type } = row;
      let articleType = cfg.articleType.get(type) || "普通文章";
      return articleType;
    },
    articleCategory(row) {
      let { categorySrc } = row;
      if (_.isArray(categorySrc)) return categorySrc[0].categoryName;
      if (_.isObject(categorySrc)) return categorySrc.categoryName;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../assets/css/site.scss";

.table_Container {
  border-radius: 0.5rem;
}

.search_Container {
  height: 50px;
  background-color: $default_whilte1;
}
.flex_container > div {
  margin: 0 3px;
}
</style>
