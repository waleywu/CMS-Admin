<template>
  <div>
    <div class="breadcrumb_container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{this.$route.meta.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </div>
    <div style="margin-bottom:10px;text-align:right">
      <el-button type="primary" icon="fas fa-plus" size="mini" @click="createUser">&nbsp;新建用户</el-button>
    </div>
    <div class="table_Container">
      <el-table v-loading="loading" :data="users" style="width: 100%">
        <el-table-column width="70px" fixed>
          <template slot-scope="scope">
            <div class="flex_container">
              <div class="tableStatus" :class="{ removed: scope.row.isStop}"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="200px"></el-table-column>
        <el-table-column prop="loginName" label="登陆名" width="200"></el-table-column>
        <el-table-column label="邮箱地址" width="200" prop="email"></el-table-column>
        <el-table-column label="工号" width="100" prop="jobNumber"></el-table-column>
        <el-table-column label="创建日期" width="200" prop="createDate" :formatter="dateFormat"></el-table-column>
        <el-table-column label="最后登陆时间" width="200" prop="lastestLoginDate" :formatter="dateFormat"></el-table-column>
        <el-table-column label="角色" width="250">
          <template slot-scope="scope">
            <div v-for="role in scope.row.roles" :key="role.id">{{role.roleName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="禁用|启用" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-trash-alt"
              size="mini"
              @click="remove(scope.row.id,scope.row.isStop)"
              v-if="!scope.row.isAdmin"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="重置密码" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-key"
              size="mini"
              @click="restPassword(scope.row.id)"
              v-if="!scope.row.isAdmin"
            ></el-button>
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
    <!---    修改密码对话框 开始--------------->
    <el-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      width="30%"
      show-close
      :close-on-click-modal="false"
    >
      <component
        :is="com"
        :id="id"
        :visible.sync="visible"
        :type="type"
        @refresh="this.refreshUsers"
      ></component>
    </el-dialog>
    <!---    修改密码对话框 结束--------------->
  </div>
</template>
<script>
import * as cfg from "../../app.cfg";
import moment from "moment";
export default {
  data() {
    return {
      users: [],
      params: {},
      dataCount: 0,
      loading: true,
      visible: false,
      id: null,
      com: null,
      isEdit: false,
      type: "create",
    };
  },
  created() {
    this.params = this.$store.state.tableFilterParams.get("user");
    this.refreshUsers();
  },
  methods: {
    async refreshUsers() {
      try {
        let payload = await this.$service.post("/api/user/handle/findAll", {
          params: this.params,
        });
        this.dataCount = payload.result.total;
        this.users = payload.result.data;
      } catch (error) {
        this.$$message.error("数据获取错误，请联系管理员");
      } finally {
        this.loading = false;
      }
      // console.log(this.users);
    },
    async edit(id) {
      this.com = () => import("../user/profile");
      this.id = id;
      this.type = "update";
      this.visible = true;
    },

    async remove(id, isStop) {
      try {
        let payload = await this.$service.post("/api/user/handle/remove", {
          id: id,
          isStop: isStop,
        });
        if (payload.error === null) {
          this.refreshUsers();
          this.$message.success(payload.msg);
        } else {
          this.$message.error(payload.msg);
        }
      } catch (error) {
        this.$message.error("操作失败，请联系管理员");
      }
    },

    async pageChange(index) {
      this.params.pageNumber = index;
      this.refreshUsers();
    },
    async restPassword(id) {
      try {
        let payload = await this.$service.post(
          "/api/user/handle/resetPassword",
          {
            id: id,
          }
        );
        if (payload.error === null) {
          this.$alert(payload.msg);
        } else {
          this.$message.error(payload.msg);
        }
      } catch (error) {
        this.$message.error("未知错误，请联系管理员");
      }
    },
    dateFormat(row, col, cellValue) {
      if (cellValue) return moment(cellValue).format("YYYY-MM-DD HH:mm");
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
    createUser() {
      this.com = () => import("../user/profile");
      this.visible = true;
      this.type = "create";
    },
  },
};
</script>
<style lang="scss" scoped>
</style>