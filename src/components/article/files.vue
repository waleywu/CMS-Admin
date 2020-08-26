const { template } = require("lodash");

<template>
  <div style="  overflow: auto;">
    <div class="files container">
      <div class="card shadow" v-for="file in files" :key="file.id" :class="{removed:file.removed}">
        <div class="content">
          <div class="title" v-cloak>{{file.title}}</div>
          <div>
            <a :href="file.path">{{file.fileName}}</a>
          </div>
          <div class="right">创建日期：{{file.createDate | dateFormat}}</div>
          <div class="right" v-if="file.removed">删除日期：{{file.removeDate | dateFormat}}</div>
        </div>
        <div class="operator">
          <div v-if="!file.removed">
            <el-button type="text" @click="changeStatus(file.id,file.removed)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="changeStatus(file.id,file.removed)">恢复</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="uploader">
      <el-upload
        drag
        :action="UPLOAD_FILE_URL"
        :before-upload="beforeUpload"
        :data="uploadFileOjb"
        :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import _ from "lodash";
import { UPLOAD_FILE_URL } from "../../app.cfg";
export default {
  data() {
    return {
      files: [],
      UPLOAD_FILE_URL: UPLOAD_FILE_URL,
      uploadFileOjb: {
        type: "files",
        article_id: this._id,
        title: "",
      },
      loading: null,
    };
  },
  props: ["_id"],
  created() {
    this.refreshArticleFiles();
  },
  filters: {
    dateFormat(value) {
      return moment(value).format("YYYY-MM-DD");
    },
  },
  methods: {
    async refreshArticleFiles() {
      let payload = await this.$service.get(`/api/article/${this._id}/files`);
      if (payload.error === null) {
        this.files = payload.result;
      } else {
        this.$message.error("获取文件列表出错，请联系管理员");
      }
    },
    async beforeUpload(file) {
      let data = await this.$prompt("请填写文件描述", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /.{1,200}/,
        inputErrorMessage: "必须填写文件描述",
      });
      this.uploadFileOjb.title = data.value;

      return true;
    },
    uploadSuccess(res, file, fileList) {
      this.refreshArticleFiles();
      this.loading.close();
      this.$message.success("上传成功");
    },
    async changeStatus(file_id, removed) {
      let payload = await this.$service.post(
        "/api/article/handle/changeFileStatus",
        { file_id: file_id, removed: removed }
      );
      if (payload.error === null) {
        this.$message.success(payload.msg);
        this.refreshArticleFiles();
      } else {
        this.$message.error(payload.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/site.scss";
.uploader {
  position: absolute;
  bottom: 0px;
  // background-color: $default_blue2;
  min-height: 300px;
  width: 100%;
  @extend .shadow;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.files.container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 600px;

  .card {
    border-radius: 5px;
    min-height: 60px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;
    position: relative;
    transition: 1s;
    border-left: 6px solid green;
    margin: 10px;
    cursor: pointer;
    &.removed {
      border-left: 6px solid red;
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 30rem;
        white-space: nowrap;
        margin: 2px;
      }
      a {
        color: #000;
      }
    }

    & > div {
      margin: 3px 0;
    }

    .operator {
      position: absolute;
      right: 5px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      & > div {
        margin: 0 5px;
      }
    }

    &:hover {
      @extend .shadow_l;
    }
    .right {
      text-align: right;
    }
  }
}
</style>