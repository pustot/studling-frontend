import axios, { AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const base_url: string = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8080/' : 'http://47.119.29.186:8080/' // process.env.REACT_APP_HOUDUAN_DIZHI!;
console.log(process.env.REACT_APP_ENV)

const axiosInstance: AxiosInstance = axios.create({
  baseURL: base_url,
  responseType: 'json'
});

// 获取JWT令牌的函数
async function getJwtToken() {
  try {
    // 如果你的后端需要验证用户的身份并可能需要读取用户的基本信息（如邮箱、用户名等），那么应该使用idToken。
    // 如果你的后端仅需要验证请求是否来自一个授权的会话，且主要关注于授权访问特定的资源或服务，而不需要用户的个人身份信息，那么使用accessToken更合适。
    // 后端需要知道边个用户训练紧等等，噉 idToken
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    return idToken;
  } catch (error) {
    console.error("Error getting JWT token", error);
    return null;
  }
}

// 设置请求拦截器，为每个请求添加JWT令牌
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getJwtToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export default axiosInstance;
