import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/', // 使用环境变量作为基础URL
  timeout: 10000, // 请求超时时间
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8'
  // }
});

// 是否显示重新登录
let isRelogin = { show: false };

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers as any)?.isToken === false;
    if (!isToken) {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url || '';
      url += '?';
      const params = config.params;
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    
    // 二进制数据则直接返回
    const isBlob = response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer';
    if (isBlob) {
      return res;
    }
    
    // 统一错误处理
    if (res.code !== 200) {
      // 根据错误码处理不同情况
      if (res.code === 401) {
        if (!isRelogin.show) {
          isRelogin.show = true;
          // 登录过期，这里可以添加重新登录逻辑
          console.warn('登录状态已过期，请重新登录');
          // 示例：跳转到登录页
          // location.href = '/login';
        }
        return Promise.reject(new Error(res.message || '登录状态已过期，请重新登录'));
      } else if (res.code === 500) {
        console.error('系统错误:', res.message);
      } else if (res.code === 601) {
        console.warn('警告:', res.message);
      } else {
        console.error('接口错误:', res.message);
      }
      return Promise.reject(new Error(res.message || '接口请求失败'));
    } else {
      return Promise.resolve(res);
    }
  },
  (error: AxiosError) => {
    console.error('网络请求失败:', error.message);
    let message = '网络请求失败';
    if (error.message === 'Network Error') {
      message = '后端接口连接异常';
    } else if (error.message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (error.message.includes('Request failed with status code')) {
      const statusCode = error.message.substr(error.message.length - 3);
      message = `系统接口${statusCode}异常`;
    }
    console.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;