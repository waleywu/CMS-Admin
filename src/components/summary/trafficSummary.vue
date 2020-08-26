<template>
  <div>
    <div>今日流量</div>
    <div class="flex_container">
      <div class="rowHeader">
        <div class="subHeader">今天</div>
        <div class="subHeader">昨天</div>
      </div>
      <div>
        <div class="subHeader">
          浏览量（PV）
        </div>
        <div
          :class="{
            up:
              this.todayTrafficSummary.pvNumber >
              this.yesterdayTrafficSummary.pvNumber,
            down:
              this.todayTrafficSummary.pvNumber <
              this.yesterdayTrafficSummary.pvNumber,
          }"
        >
          {{ this.todayTrafficSummary.pvNumber }}
        </div>
        <div>
          {{ this.yesterdayTrafficSummary.pvNumber }}
        </div>
      </div>
      <div>
        <div class="subHeader">
          访客数（UV）
        </div>
        <div
          :class="{
            up:
              this.todayTrafficSummary.uvNumber >
              this.yesterdayTrafficSummary.uvNumber,
            down:
              this.todayTrafficSummary.uvNumber <
              this.yesterdayTrafficSummary.uvNumber,
          }"
        >
          {{ this.todayTrafficSummary.uvNumber }}
        </div>
        <div>{{ this.yesterdayTrafficSummary.uvNumber }}</div>
      </div>
      <div>
        <div class="subHeader">
          IP数
        </div>
        <div
          :class="{
            up:
              this.todayTrafficSummary.ipNumber >
              this.yesterdayTrafficSummary.ipNumber,
            down:
              this.todayTrafficSummary.ipNumber <
              this.yesterdayTrafficSummary.ipNumber,
          }"
        >
          {{ this.todayTrafficSummary.ipNumber }}
        </div>
        <div>{{ this.yesterdayTrafficSummary.ipNumber }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import countTO from "vue-count-to";
export default {
  data() {
    return {
      todayTrafficSummary: {
        pvNumber: "",
        uvNumber: "",
        ipNumber: "",
      },
      yesterdayTrafficSummary: {
        pvNumber: "",
        uvNumber: "",
        ipNumber: "",
      },
    };
  },
  methods: {
    async refreshData() {
      this.todayTrafficSummary = await this.getData("today");
      this.yesterdayTrafficSummary = await this.getData("yesterday");
    },
    async getData(v) {
      try {
        let payload = await this.$service.post(
          "/api/summary/handle/trafficSummary",
          {
            type: v,
          }
        );
        return payload.result;
      } catch (error) {
        this.$message.error("数据加载错误");
      }
    },
  },
  created() {
    this.refreshData();
  },
  components: {
    countTO,
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/site.scss";
.flex_container {
  .rowHeader {
    div {
      font-size: $default_fontSize2;
    }
  }
  .up {
    color: green;
  }
  .down {
    color: red;
  }
}
</style>
