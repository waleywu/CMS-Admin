<template>
  <div>
    <div class="breadcrumb_container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'articleList' }">返回文章列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ this.$route.meta.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </div>
    <div class="articleEditContainer">
      <div class="articleStatus" :class="{ removed: article.removed }"></div>
      <div class="articleEditMain">
        <el-form
          :model="article"
          :rules="rules"
          ref="editForm"
          label-width="120px"
          v-loading="editPanelLoading"
          size="medium"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="article.title"></el-input>
          </el-form-item>

          <el-form-item label="类别" prop="category">
            <el-cascader
              :options="categories"
              :props="categorySelectProps"
              :show-all-levels="true"
              clearable
              style="width:100%"
              size="small"
              v-model="article.category"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="article.type">
              <el-radio-button :label="1">普通文章</el-radio-button>
              <el-radio-button :label="2">下载列表</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="作者" prop="author" v-show="type">
            <el-input v-model="article.author"></el-input>
          </el-form-item>

          <el-form-item label="关键字" prop="keyword" v-show="type">
            <el-input v-model="article.keyword"></el-input>
          </el-form-item>

          <el-form-item label="摘要" prop="description" v-show="type">
            <el-input v-model="article.description"></el-input>
          </el-form-item>

          <el-form-item label="内容" prop="content" v-show="type">
            <editor
              api-key="hh2pe0jinum8greyqccey4qb7exxqe45vmwxlq7vtmat8mu7"
              v-model="article.content"
              :init="tinycme_config"
              style="z-index:2002"
            />
          </el-form-item>

          <el-form-item label="状态">
            <span style="margin-right:50px;">
              <el-switch v-model="article.isTemporary" active-text="草稿" inactive-text="正常"></el-switch>
            </span>
            <span style="margin-right:50px">
              <el-switch v-model="article.removed" active-text="已下架" inactive-text="已上架"></el-switch>
            </span>
            <span>
              <el-switch v-model="article.isTop" active-text="已置顶" inactive-text="未置顶"></el-switch>
            </span>
          </el-form-item>

          <el-form-item label="发布日期" prop="publishDate">
            <el-date-picker
              type="date"
              :picker-options="pickerOptions"
              v-model="article.publishDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="主题照片">
            <el-upload
              :action="UPLOAD_FILE_URL"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              class="main_upload"
              :data="uploadFileOjb"
              :multiple="false"
              accept="image"
              :before-upload="beforeUpload"
            >
              <el-image style="width: 200px; height: 200px" :src="article.mainPic"></el-image>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkSensitiveWord('editForm')">
            <i class="far fa-save"></i> 保存
          </el-button>

          <el-button type="primary" v-if="!type" @click="drawer = true">文件管理</el-button>
        </div>
        <div class="filesList s">
          <div class="switch"></div>
          <div class="content"></div>
        </div>
        <!-- 编辑页面结束 -->
        <el-progress
          type="circle"
          :percentage="uploadProgress"
          v-show="(uploadProgress > 0) & (uploadProgress < 100)"
          class="progress"
          :color="progressColor"
        ></el-progress>
        <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
          <files :_id="article._id"></files>
        </el-drawer>
      </div>
    </div>
  </div>
</template>
<script>
import editor from "@tinymce/tinymce-vue";
import _ from "lodash";
import { Loading } from "element-ui";
import * as cfg from "../../app.cfg";
import moment from "moment";
import fastScanner from "fastscan-plus";
import sensitiveWordScanner from "../../sensitiveWordScanner";
import files from "./files";
export default {
  data() {
    return {
      editPanelLoading: false,
      id: this.$route.params.id,
      tinycme_config: cfg.tinycme_config(this),
      article: {
        isTemporary: false,
        createDate: new Date().toLocaleString(),
        removed: false,
        type: 1,
        publishDate: new Date().toLocaleString(),
        _id: "",
        mainPic: "",
      },
      uploadProgress: 0, //上传文件进度
      progressColor: cfg.progressColor, //进度条颜色
      pickerOptions: cfg.pickerOptions, //日期控件配置
      isModified: false, //文章是否已经被修改
      categories: [],
      categorySelectProps: {
        //类别控件配置
        value: "id",
        label: "categoryName",
        // checkStrictly: true,
        emitPath: false,
      },
      //上传对象
      UPLOAD_FILE_URL: cfg.UPLOAD_FILE_URL,
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        category: [
          {
            required: true,
            message: "请选择文章分类",
            trigger: "change",
          },
        ],
        createDate: [
          { required: true, message: "请选择发布日期", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择文章类型", trigger: "blur" }],
      },
      scanner: null,
      drawer: false,
    };
  },
  components: {
    editor,
    files,
  },
  async created() {
    //获取类别列表
    this.refreshCategoies();
    let id = this.$route.params.id;
    if (id !== "new") {
      this.getArticle(id);
    } else {
      this.createNew();
    }

    this.scanner = new sensitiveWordScanner();
  },
  methods: {
    /**
     * @description 刷新文章类别
     * @function
     */
    refreshCategoies() {
      this.$service.get("/api/category/categoryTree").then((payload) => {
        this.categories = payload.result;
      });
    },
    /**
     * @description 新建文章
     * @function createNew
     * @async
     */
    async createNew() {
      let payload = await this.$service.post("/api/article/handle/new");
      this.article = payload.result;
    },
    /**
     * @description  - 获得当前文章
     * @param {string} id - 文章id
     */
    async getArticle(id) {
      let payload = await this.$service.get(`/api/article/admin/${id}`);
      if (payload.result === null) {
        this.$message.error("所选文章不存在");
        this.$router.replace({ path: "/articleList" });
      }
      this.article = payload.result;
    },
    /**
     * @description 保存文件
     */
    async save() {
      this.removeSensitiveWordTag();
      let isValid = false;
      this.$refs["editForm"].validate((valid) => {
        isValid = valid;
      });

      if (isValid === false) return;
      let payload = await this.$service.post("/api/article/handle/create", {
        article: this.article,
      });
      if (payload.error == null) {
        this.$message({
          message: payload.msg,
          type: "success",
        });
        setTimeout(() => {
          this.$router.push({ name: "articleList" });
        }, 1000);
      } else {
        this.$message.error(payload.msg);
      }
    },
    /**
     * @description 文章下架
     * @param {string,function} {文章id，下架之后回调函数}
     */
    async removeArticle() {
      let payload = await this.$service.post("/api/article/handle/remove", {
        id: this.article.id,
        removed: this.article.removed,
      });

      if (payload.error === null) {
        this.article.removed = !this.article.removed;
        this.$message({
          message: payload.msg,
          type: "success",
        });
      } else {
        this.$message.error(payload.msg);
      }
    },
    /**
     * @description 敏感词筛查
     */
    checkSensitiveWord() {
      this.removeSensitiveWordTag();
      //如果保存时筛查规则未开启，则可以直接保存，不用去筛查敏感词
      if (this.scanner.info.savedEnabled === false) {
        this.save();
        return;
      }
      //筛查开始
      let result = this.scanner.scan(this.article.content);
      if (result.length > 0) {
        //给发现的敏感词加高亮
        this.addSensitiveWordTag(result);
        //如果强制规则启用，则不允许保存
        if (this.scanner.info.peremptory === true) {
          this.$alert(
            "发现敏感词，已高亮显示。您已开启强制规则，将不允许保存",
            {
              type: "error",
              title: "敏感词筛查结果",
            }
          );
        } else {
          //如果强制规则关闭，则可以让用户选择是否继续保存，还是放弃保存
          this.$confirm("发现敏感词，已高亮显示", "", {
            type: "error",
            title: "敏感词筛查结果",
            showCancelButton: true,
            confirmButtonText: "继续保存",
            cancelButtonText: "放弃保存",
            distinguishCancelAndClose: true,
          })
            .then(() => {
              this.save();
            })
            .catch((action) => {
              return;
            });
        }
      } else {
        //没有发现敏感词，则直接保存
        this.save();
      }
    },
    /**
     * @description 移除已经高亮的敏感词样式
     */
    removeSensitiveWordTag() {
      let reg = /<span[^>]*sensitiveWord[^>]*>([\s\S]+?)<\/span>/gi;
      let _words = this.article.content.match(reg);

      if (_words) {
        _words.map((v) => {
          v.match(reg);
          this.article.content = this.article.content.replace(v, RegExp.$1);
        });
      }
    },
    /**
     * @description 高亮敏感词
     * @param {string} 已经被筛查出来的，需要被高亮的敏感词
     */
    addSensitiveWordTag(words) {
      let _words = words.map((v) => {
        return v[1];
      });

      _words = _.uniq(_words);
      _words.map((v) => {
        let regax = `/${v}/ig`;
        this.article.content = this.article.content.replace(
          eval(regax),
          `<span style="background-color: #faad14;color: white;" class="sensitiveWord">${v}</span>`
        );
      });
    },
    handleUploadSuccess(res, file, fileList) {
      console.log(fileList);
      let payload = file.response;

      if (payload.location !== null) {
        this.article.mainPic = payload.location;
      } else {
        this.$message.error("上传错误，请联系管理员");
      }
    },
    beforeUpload(file) {
      const isPic = /image\/(JPEG|PNG|GIF|BMP)/gi.test(file.type);
      if (!isPic) {
        this.$message.error("上传文件格式错误，请选择图像文件格式");
      }
      return isPic;
    },
  },
  watch: {
    article: {
      handler: function (v, n) {
        this.isModified = true;
      },
      deep: true,
    },
  },
  computed: {
    type() {
      return this.article.type === 1;
    },
    uploadFileOjb() {
      return { type: "main_pic", article_id: this.article._id };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/site.scss";
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-dialog__wrapper {
  z-index: 2 !important;
}
.progress {
  z-index: 9999;
  position: fixed;
  right: 0;
  top: 0;
}
.articleEditContainer {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // align-items: stretch;
  position: relative;
  .articleStatus {
    flex-grow: 0;
    width: 4px;
    position: absolute;
    left: 0;
    height: 100%;
    background-color: green;
    transition: background-color 3s;
    -webkit-transition: background-color 3s;
    &.removed {
      background-color: red;
    }
  }
  .fileList {
    flex-grow: 1;
  }
  .articleEditMain {
    flex-grow: 2;
  }
  .filesList {
    display: flex;
    justify-content: center;
    align-items: stretch;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 30px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0);
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    z-index: 5;
    transition: 1s;

    .switch {
      height: 60px;
      width: 30px;
      font-size: 3rem;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      background-color: $default_blue1;
    }
    &:hover {
      width: 500px;
      height: 300px;
    }
    .content {
      background-color: white;
      z-index: 1;
      flex: 1;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      transition: 1s;
    }
  }

  .main_upload .el-upload {
    width: 300px;
    height: 300px;
  }
}
</style>
