import { SERVICE_BASE_URL } from "./static/config";
const UPLOAD_FILE_URL = `${SERVICE_BASE_URL}/api/upload`;
const FILE_DL_URL = `/upload/`;
const articleType = new Map([
  ["1", "普通文章"],
  ["2", "下载列表"],
]);

const tinycme_config = (vm) => {
  return {
    selector: "#editor",
    language: "zh_CN",
    plugins:
      "print preview paste importcss searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons  numlist bullist",

    menubar: "file edit view insert format tools table help",
    toolbar:
      "undo redo | bold italic underline strikethrough code| fontselect fontsizeselect styleselect | alignleft aligncenter alignright alignjustify | outdent indent numlist bullist anchor | forecolor backcolor removeformat | pagebreak | hr charmap emoticons | fullscreen  preview restoredraft print | insertfile image media template link anchor codesample | visualblocks visualchars",
    toolbar_sticky: true,

    // autosave 开始
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "15m",
    // autosave 结束

    //importcss 开始
    // content_css: "//www.tiny.cloud/css/codepen.min.css",
    importcss_append: true,
    //importcss 结束

    //分页符 开始
    pagebreak_separator: "<!-- 此处分页 -->",
    pagebreak_split_block: true,
    //分页符 结束

    // paste_enable_default_filters: true,
    // paste_as_text: false,
    // paste_webkit_styles: "none",
    paste_preprocess: function(plugin, args) {
      //   args.content = args.content.replace(/<\/??(html|body|head)??>/gi, " ");
      args.content = args.content.replace(/html/gi, "hello");
    },

    // 多媒体文件开始
    file_picker_types: "image media",
    media_live_embeds: true,
    media_poster: true,
    //生成音频文件的h5元素
    audio_template_callback: (data) => {
      return `<audio controls src="${data.source}"></audio>`;
    },
    // 多媒体文件结束
    // 图片开始
    image_advtab: true,
    // image_prepend_url: FILE_DL_URL, //在地址栏中输入移除焦点后，自动再前部加上地址前缀（对Http开头会忽略）
    // typeahead_urls: false,
    imagetools_cors_hosts: [
      "192.168.132.192",
      "192.168.132.1",
      "101.132.39.110",
    ],
    file_picker_callback: function(cb, value, meta) {
      if (meta.filetype === "media" || meta.filetype === "image") {
        //创建一个隐藏的type=file的文件选择input
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.onchange = function() {
          let file = this.files[0]; //只选取第一个文件。如果要选取全部，后面注意做修改
          let xhr, formData;
          xhr = new XMLHttpRequest();

          xhr.open("POST", UPLOAD_FILE_URL);
          xhr.setRequestHeader("Authorization", vm.$store.state.token); //添加用户token
          xhr.upload.onprogress = function(e) {
            // 进度(e.loaded / e.total * 100)
            vm.uploadProgress = ((e.loaded / e.total) * 100) | 0;
          };
          xhr.onerror = function() {
            vm.uploadProgress = 0;
            loading.close();
            vm.$message.error("上传失败，请联系管理员");
            return;
          };
          xhr.onload = function() {
            let json;
            if (xhr.status < 200 || xhr.status >= 300) {
              vm.uploadProgress = 0;
              loading.close();
              vm.$message.error("上传失败，请联系管理员");

              return;
            }
            json = JSON.parse(xhr.responseText);
            //   console.log(json);
            //假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
            //接口返回的文件保存地址
            let mediaLocation = json.location;
            //cb()回调函数，将mediaLocation显示在弹框输入框中
            cb(mediaLocation, {
              title: file.name,
            });
            loading.close();
          };
          let loading = vm.$loading(); //加载loading控件
          formData = new FormData();
          formData.append("article_id", vm.article._id);
          //假设接口接收参数为file,值为选中的文件
          formData.append("file", file);
          //正式使用将下面被注释的内容恢复

          xhr.send(formData);
        };
        //触发点击
        input.click();
      }
    },
    // 图片结束
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar:
      "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: "sliding",
    contextmenu: "link image imagetools table",
    loading: null,
    init_instance_callback: function(editor) {
      editor.loading.close();
    },
    setup: function(editor) {
      editor.loading = vm.$loading();
    },
  };
};

const pickerOptions = {
  shortcuts: [
    {
      text: "今天",
      onClick(picker) {
        picker.$emit("pick", new Date());
      },
    },
    {
      text: "昨天",
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit("pick", date);
      },
    },
    {
      text: "明天",
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24);
        picker.$emit("pick", date);
      },
    },
  ],
};

const progressColor = [
  {
    color: "#f56c6c",
    percentage: 30,
  },
  {
    color: "#e6a23c",
    percentage: 50,
  },
  {
    color: "#409eff",
    percentage: 70,
  },
  {
    color: "#67c23a",
    percentage: 100,
  },
];

class dataFilterParams {
  constructor() {
    this.pageNumber = 1;
    this.pageSize = 20;
    this.sort = { createDate: -1 };
    this.filter = {};
    this.fields = "";
    this.include = [];
  }
}

export {
  SERVICE_BASE_URL,
  UPLOAD_FILE_URL,
  FILE_DL_URL,
  tinycme_config,
  progressColor,
  pickerOptions,
  articleType,
  dataFilterParams,
};
