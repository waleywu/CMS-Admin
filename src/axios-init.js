/* eslint-disable */
import axios from "axios";
import qs from "qs";
import store from "./store/index";
import * as cfg from "./app.cfg";
import { SERVICE_BASE_URL } from "./static/config";
let { log } = console;
axios.defaults.baseURL = SERVICE_BASE_URL;
axios.defaults.headers.post["Content-Type"] =
  "application/x-wwww-form-urlencoded";
axios.defaults.crossDomain = true;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  (config) => {
    transformRequest: (data, headers) => {
      return qs.stringify({ ...data });
    };
    if (config.method !== "get")
      config.headers.common.Authorization = store.state.token; //带上token
    return config;
  },
  (error) => {
    return Promise.reject({ error: 1, msg: error, result: null });
  }
);
axios.interceptors.response.use(
  (rep) => {
    let { error, msg, result } = rep.data;
    return Promise.resolve({ error, msg, result });
  },
  (err) => {
    return Promise.reject({
      error: 3,
      msg: `系统错误，请联系管理员`,
      result: null,
    });
  }
);
export default axios;
