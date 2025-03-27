import { HttpClient, HttpRequestConfig, HttpRequestEngine, HttpResponse } from './interfaces';

/**
 * HTTP客户端实现类
 * 遵循依赖倒置原则，通过构造函数注入HttpRequestEngine
 */
export class HttpClientImpl implements HttpClient {
  private engine: HttpRequestEngine;
  private defaultConfig: Partial<HttpRequestConfig>;

  /**
   * 创建HttpClient实例
   * @param engine 请求引擎实现
   * @param defaultConfig 默认请求配置
   */
  constructor(engine: HttpRequestEngine, defaultConfig: Partial<HttpRequestConfig> = {}) {
    this.engine = engine;
    this.defaultConfig = defaultConfig;
  }

  /**
   * 发送HTTP请求
   * @param config 请求配置
   * @returns Promise<HttpResponse<T>>
   */
  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    // 合并默认配置和请求配置
    const mergedConfig: HttpRequestConfig = {
      ...this.defaultConfig,
      ...config,
      headers: {
        ...this.defaultConfig.headers,
        ...config.headers
      }
    };

    return this.engine.execute<T>(mergedConfig);
  }

  /**
   * 发送GET请求
   * @param url 请求URL
   * @param config 请求配置(不包含url和method)
   * @returns Promise<HttpResponse<T>>
   */
  async get<T = any>(
    url: string, 
    config?: Omit<HttpRequestConfig, 'url' | 'method'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      ...config
    });
  }

  /**
   * 发送POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置(不包含url、method和body)
   * @returns Promise<HttpResponse<T>>
   */
  async post<T = any>(
    url: string, 
    data?: any, 
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      body: data,
      ...config
    });
  }

  /**
   * 发送PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置(不包含url、method和body)
   * @returns Promise<HttpResponse<T>>
   */
  async put<T = any>(
    url: string, 
    data?: any, 
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      body: data,
      ...config
    });
  }

  /**
   * 发送DELETE请求
   * @param url 请求URL
   * @param config 请求配置(不包含url和method)
   * @returns Promise<HttpResponse<T>>
   */
  async delete<T = any>(
    url: string, 
    config?: Omit<HttpRequestConfig, 'url' | 'method'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config
    });
  }

  /**
   * 发送PATCH请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置(不包含url、method和body)
   * @returns Promise<HttpResponse<T>>
   */
  async patch<T = any>(
    url: string, 
    data?: any, 
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      body: data,
      ...config
    });
  }
} 