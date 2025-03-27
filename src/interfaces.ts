/**
 * HTTP请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * HTTP响应接口
 */
export interface HttpResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** HTTP状态码 */
  status: number;
  /** HTTP状态文本 */
  statusText: string;
  /** 响应头 */
  headers: Record<string, string>;
  /** 原始响应对象 */
  originalResponse?: any;
}

/**
 * HTTP请求配置
 */
export interface HttpRequestConfig {
  /** 请求URL */
  url: string;
  /** 请求方法 */
  method?: HttpMethod;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: any;
  /** 超时时间(毫秒) */
  timeout?: number;
  /** 是否携带凭证(cookies) */
  withCredentials?: boolean;
  /** 响应类型 */
  responseType?: XMLHttpRequestResponseType | 'json' | 'text' | 'blob' | 'arraybuffer' | 'formdata';
  /** 请求参数 */
  params?: Record<string, any>;
  /** 请求拦截器 */
  requestInterceptor?: (config: HttpRequestConfig) => HttpRequestConfig;
  /** 响应拦截器 */
  responseInterceptor?: <T>(response: HttpResponse<T>) => HttpResponse<T>;
}

/**
 * HTTP客户端接口
 * 定义了高层业务所需的HTTP操作
 */
export interface HttpClient {
  request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
  get<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
  post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
  put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
  delete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;
}

/**
 * HTTP请求引擎接口
 * 这是底层实现的抽象，可以有不同的实现(Fetch或XHR)
 */
export interface HttpRequestEngine {
  execute<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
} 