import _ from "lodash";
var storeCfg = {
  state: {
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    token: sessionStorage.getItem("token") || null,
    selectedCategoryId: null,
    tableFilterParams: new Map([
      [
        "article",
        {
          filter: {},
          fields: "",
          sort: {
            createDate: -1,
          },
          pageNumber: 1,
          pageSize: 20,
        },
      ],
      [
        "user",
        {
          filter: {},
          fields: "-password",
          sort: {
            name: 1,
          },
          pageNumber: 1,
          pageSize: 20,
        },
      ],
    ]),
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
      sessionStorage.setItem("token", token);
    },
    loginSuccess(state, payload) {
      //  console.log(payload)
      state.token = payload.result.token;
      sessionStorage.setItem("token", state.token);
      state.user = payload.result.user;
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
    reset(state) {
      state.user = state.token = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
    changeCategory(state, categoryId) {
      state.selectedCategoryId = categoryId;
    },
    saveTableFilterParams(state, params) {
      _.merge(state.tableFilterParams, params);
    },
  },
};

export default storeCfg;
