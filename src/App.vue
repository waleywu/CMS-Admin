<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: "App",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  background-color: #f3f3f3;
  font-size: 14px;
}
#app {
  font-family: Helvetica, Arial, sans-serif, "Avenir";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
