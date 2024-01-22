import { ContentTypeEnum, MethodEnum } from './config';
import { message as $message } from 'antd';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';

// import { objectPick, trimSpace } from '@/utils/util';
// import { globalErrorHandler } from '@/utils/errorHandler';
import { isObject, isBlod, isFormData, isFunction } from '@/utils/is';
// import { useUserStore } from '@/store/user';
// import { useDownload } from '@/hooks/useDownload';
// import { useMessage } from '@/hooks/useMessage';
// import { AxiosCanceler } from './helper/cancelToken';
const defaultConfig = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_BASE_API,
  // 设置超时时间
  timeout: 50000,
  // 跨域时候允许携带凭证
  withCredentials: true,
  headers: {
    'Content-type': ContentTypeEnum.FORM_URLENCODED
  }
};
export type IOptions = Partial<typeof defaultOptions> & {
  repeatRequest?: 'cancel' | 'forbid' | undefined;
  errorHandler?: (params: any) => void;
  // loadingRef?: Ref<boolean>;
  key?: string; // 唯一标识符
};

const defaultOptions = {
  onlyData: true,
  loading: false,
  loadingText: 'Loading...',
  withToken: true,
  successDialog: false,
  successText: 'success',
  errorDialog: false,
  errorText: '',
  paramsTrim: true // 参数是否前后去除空格
};

export interface Result<T = any> {
  code: string;
  data: T;
  message: string;
  result: Boolean;
}
class RequestHttp {
  private service: AxiosInstance;
  // private axiosCanceler: AxiosCanceler;
  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    // this.axiosCanceler = new AxiosCanceler();
    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: any) => {
        // const userStore = useUserStore();
        // 是否需要添加请求token
        // if (config.withToken && config.headers && typeof config.headers.set === 'function') {
        //   config.headers.set('loginToken', userStore.loginToken);
        // }
        // if (config?.repeatRequest === 'cancel') {
        //   this.axiosCanceler.addPending(config);
        // }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: any) => {
        const { config = {}, data = {} } = response;
        // this.axiosCanceler.removePending(config);
        config['cache-control'] = 'no-cache';
        if (config.onlyData) {
          return data;
        }
        return response;
      },
      (error: AxiosError) => {
        // if (axios.isAxiosError(error)) {
        //   const { config } = error as any;
        //   // if (config.repeatRequest && config.repeatRequest === 'forbid') {
        //   //   this.axiosCanceler.removePending(config);
        //   // }
        // }
        return Promise.reject(error);
      }
    );
  }
  // 请求成功处理
  // successHandler(options: IOptions) {
  //   if (options.successDialog) {
  //     $message.success(options.successText || 'success');
  //   }
  // }
  // 请求失败处理
  errorHandler(error: any, options: IOptions): any {
    try {
      let dataInfo = error || {};
      if (axios.isAxiosError(error)) {
        const { response, name } = error;
        if (name === 'CanceledError') return ['CanceledError', null];
        const { data = {} } = response || {};
        if (isObject(data)) {
          dataInfo = data;
        }
      }

      if (options.errorDialog) {
        $message.error(options.errorText || dataInfo.msg || dataInfo.message || 'error');
      }

      if (isFunction(options.errorHandler)) {
        options.errorHandler(dataInfo);
      }

      // if (dataInfo.code && dataInfo.code === '401') {
      //   const userStore = useUserStore();
      //   $message.warning('登陆失效，请重新登陆');
      //   userStore.logout();
      // } else {
      //   globalErrorHandler(error);
      // }

      return [dataInfo, undefined];
    } catch (error) {
      // globalErrorHandler(error);
      return [error, undefined];
    }
  }
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || defaultConfig.headers;
    const contentType = headers?.['Content-type'];

    // if (options.paramsTrim) {
    //   if (config.data) config.data = trimSpace(config.data);
    //   if (config.params) config.params = trimSpace(config.params);
    // }

    // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
    if (config.method?.toUpperCase() === MethodEnum.GET) {
      const now = new Date().getTime();
      return {
        ...config,
        params: Object.assign(config.params || {}, { _t: now })
      };
    }

    if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data')) {
      return config;
    }
    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    };
  }

  uploadFile<T = any>(config: AxiosRequestConfig, options?: IOptions) {
    let formData = {} as FormData;
    if (isFormData(config?.data)) {
      formData = config?.data;
    } else {
      formData = new window.FormData();
      if (config.data && isObject(config.data)) {
        Object.keys(config.data).forEach(key => {
          const value = config.data![key];
          if (Array.isArray(value)) {
            value.forEach(item => {
              formData.append(`${key}[]`, item);
            });
            return;
          }

          formData.append(key, config.data![key]);
        });
      }
    }

    return this.request<T>(
      {
        ...config,
        method: MethodEnum.POST,
        data: formData,
        headers: {
          'Content-type': ContentTypeEnum.FORM_DATA
        }
      },
      options
    );
  }

  get<T = any>(config: AxiosRequestConfig, options?: IOptions) {
    return this.request<T>(
      { ...config, headers: { 'Content-type': ContentTypeEnum.JSON }, method: MethodEnum.GET },
      options
    );
  }

  post<T = any>(config: AxiosRequestConfig, options?: IOptions) {
    return this.request<T>({ ...config, method: MethodEnum.POST }, options);
  }

  postJson<T = any>(config: AxiosRequestConfig, options?: IOptions) {
    return this.request<T>(
      { ...config, headers: { 'Content-type': ContentTypeEnum.JSON }, method: MethodEnum.POST },
      options
    );
  }

  // async downloadFile<T = any, U = any>(config: AxiosRequestConfig, options?: IOptions) {
  //   const [err, data] = await this.request<T, U>(
  //     {
  //       headers: { 'Content-type': ContentTypeEnum.FORM_URLENCODED },
  //       ...config,
  //       method: MethodEnum.POST,
  //       responseType: 'blob'
  //     },
  //     options
  //   );
  //   useDownload({ blob: data, isNotify: false });
  //   return Promise.resolve([err, data]);
  // }

  // async downloadJsonFile(config: AxiosRequestConfig, options?: IOptions) {
  //   return await this.downloadFile({ ...config, headers: { 'Content-type': ContentTypeEnum.JSON } }, options);
  // }

  private request<T = any>(config: AxiosRequestConfig, options?: IOptions): Promise<T> {
    // const cloneConfig = cloneDeep(config);
    // if (options?.repeatRequest === 'forbid') {
    //   const result = this.axiosCanceler.addPendingItem(cloneConfig);
    //   if (result) return Promise.resolve(['重复请求', undefined] as [U, undefined]);
    // }
    // const userStore = useUserStore();
    const finalOptions = Object.assign({}, defaultOptions, options);
    // const handleConfig = this.supportFormData(cloneConfig, finalOptions);
    // // 选择出需要的参数放到请求config中
    // const finalConfig = Object.assign(
    //   {},
    //   handleConfig,
    //   objectPick(finalOptions, ['onlyData', 'withToken', 'repeatRequest', 'key'])
    // );
    // const finalConfig = Object.assign(
    //   {},
    //   handleConfig,
    //   objectPick(finalOptions, ['onlyData', 'withToken', 'repeatRequest', 'key'])
    // );
    // if (finalOptions.loading) {
    //   userStore.loadingText = finalOptions.loadingText;
    //   userStore.fullLoading = true;
    // }

    // if (finalOptions.loadingRef && isRef(finalOptions.loadingRef)) {
    //   finalOptions.loadingRef.value = true;
    // }

    return this.service
      .request(config)
      .then<any>((res: any) => {
        const responseData = finalOptions.onlyData ? res : res.data;
        if (isBlod(responseData)) {
          return [null, responseData];
        }

        const { data, result } = responseData;

        if (result) {
          // this.successHandler(finalOptions);
          return [null, data];
        } else {
          return this.errorHandler(responseData, finalOptions);
        }
      })
      .catch((e: any) => {
        return this.errorHandler(e, finalOptions);
      });
  }
}

export default new RequestHttp(defaultConfig);
