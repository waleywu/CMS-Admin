/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import login from "../views/login";
import appIndex from "../views/index";
import articleList from "../components/article/articleList";
import summaryIndex from "../components/summary/index";
import "element-ui/lib/theme-chalk/index.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

var router = new Router({
  mode: "history",
  redirct: "/login",
  routes: [
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/",
      name: "appIndex",
      component: appIndex,
      children: [
        {
          path: "articleList",
          name: "articleList",
          component: articleList,
          meta: {
            name: "文章列表",
            right: 1,
          },
        },
        {
          path: "summary",
          name: "summary",
          component: summaryIndex,
          meta: {
            name: "统计概述",
            right: 2,
          },
        },
        {
          path: "article/createNew",
          name: "createArticle",
          component: () => import("../components/article/article"),
          meta: {
            name: "新建文章",
            right: 3,
          },
        },
        {
          path: "article/:id",
          name: "editArticle",
          component: () => import("../components/article/article"),
          meta: {
            name: "编辑文章",
            right: 4,
          },
        },
        {
          path: "configuration/seo",
          name: "seo",
          component: () => import("../components/configuration/seo"),
          meta: {
            name: "全局SEO设置",
            right: 5,
          },
        },
        {
          path: "configuration/userList",
          name: "userList",
          component: () => import("../components/configuration/userList"),
          meta: {
            name: "用户列表",
            right: 6,
          },
        },
        {
          path: "configuration/sensitiveWord",
          name: "sensitiveWord",
          component: () => import("../components/configuration/sensitiveWord"),
          meta: {
            name: "敏感词管理",
            right: 7,
          },
        },
        {
          path: "configuration/createUser",
          name: "createUser",
          component: () => import("../components/configuration/createUser"),
          meta: {
            name: "新建用户",
            right: 8,
          },
        },
        { path: "*", component: summaryIndex },
      ],
      beforeEnter(to, from, next) {
        console.log("beforeEnter");
        let token = sessionStorage.getItem("token");
        if (token === undefined || token === null) next("/login");
        else next();
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  console.log("be");
  NProgress.start();
  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});
export default router;
