<template>
  <div>
    <div>概览</div>
    <div class="flex_container">
      <div>
        <div class="subHeader">总文章数</div>
        <div>{{ data.articleNumber }}</div>
      </div>
      <div>
        <div class="subHeader">已发布数</div>
        <div>{{ data.publishedNumber }}</div>
      </div>
      <div>
        <div class="subHeader">已下架数</div>
        <div>{{ data.removedNumber }}</div>
      </div>
      <div>
        <div class="subHeader">草稿数</div>
        <div>{{ data.draftNumber }}</div>
      </div>
    </div>
    <hr />
    <div class="flex_container">
      <div>
        <div class="subHeader">浏览量（PV）</div>
        <div>{{data.totalPvNumber}}</div>
      </div>
      <div>
        <div class="subHeader">访客数（UV）</div>
        <div>{{data.totalUvNumber}}</div>
      </div>
      <div>
        <div class="subHeader">IP数</div>
        <div>{{data.totalIpNumber}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {
        articleNumber: "",
        publishedNumber: "",
        removedNumber: "",
        draftNumber: "",
        totalPvNumber: "",
        totalUvNumber: "",
        totalIpNumber: "",
      },
    };
  },
  created() {
    (async () => {
      try {
        let payload = await this.$service.post("/api/summary/handle/overview");
        if (payload.error === null) {
          this.data.articleNumber = payload.result[0];
          this.data.publishedNumber = payload.result[1];
          this.data.removedNumber = payload.result[2];
          this.data.draftNumber = payload.result[3];
          this.data.totalPvNumber = payload.result[4].pvNumber;
          this.data.totalUvNumber = payload.result[4].uvNumber;
          this.data.totalIpNumber = payload.result[4].ipNumber;
        } else {
          this.$message.error("数据获取失败");
        }
      } catch (error) {
        this.$message.error("数据获取失败");
      }
    })();
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/site.scss";
</style>
