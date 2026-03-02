import axios, { type AxiosError } from 'axios';
import Cookies from 'js-cookie';

const REFRESH_TOKEN_URL = '/refresh';

export function createAxiosRequestInterceptor() {
  axios.interceptors.request.use((config) => {
    const accessToken = Cookies.get('accessToken');

    config.baseURL = import.meta.env.VITE_BASE_URL;
    config.withCredentials = true;

    if (accessToken && config.url !== REFRESH_TOKEN_URL) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  });
}

export function createAxiosResponseInterceptor() {
  const refreshToken = Cookies.get('refreshToken');

  let isRefreshing = false;
  let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: Error) => void;
  }[] = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const errorHandler = async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      axios.interceptors.response.eject(interceptor);

      try {
        const response = await axios.post(REFRESH_TOKEN_URL, { refreshToken });

        Cookies.set('accessToken', response.data.token);
        Cookies.set('refreshToken', response.data.refreshToken);

        error.response.config.headers['Authorization'] =
          `Bearer ${response.data.token}`;

        processQueue(null, response.data.token);

        return axios(error.response.config);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        window.location.href = '/';
      } finally {
        isRefreshing = false;
        createAxiosResponseInterceptor();
      }
    } else {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          error.response!.config.headers['Authorization'] = `Bearer ${token}`;

          return axios(error.response!.config);
        })
        .catch((err) => {
          return Promise.reject(new Error(String(err)));
        });
    }
  };

  const interceptor = axios.interceptors.response.use(
    (response) => response,
    errorHandler,
  );
}
