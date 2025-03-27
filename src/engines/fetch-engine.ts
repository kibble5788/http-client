import { HttpRequestConfig, HttpRequestEngine, HttpResponse } from '../interfaces';

/**
 * 基于Fetch API的HTTP请求引擎实现
 */
export class FetchRequestEngine implements HttpRequestEngine {
  async execute<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    // 应用请求拦截器
    if (config.requestInterceptor) {
      config = config.requestInterceptor(config);
    }

    // 处理查询参数
    let url = config.url;
    if (config.params) {
      const queryParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    // 准备请求选项
    const fetchOptions: RequestInit = {
      method: config.method || 'GET',
      headers: config.headers as HeadersInit,
      credentials: config.withCredentials ? 'include' : 'same-origin',
    };

    // 处理请求体
    if (config.body) {
      if (typeof config.body === 'object' && !(config.body instanceof FormData) && !(config.body instanceof Blob)) {
        fetchOptions.body = JSON.stringify(config.body);
        // 如果没有设置Content-Type，自动设置为application/json
        if (fetchOptions.headers && !Object.keys(fetchOptions.headers as Record<string, string>).some(h => h.toLowerCase() === 'content-type')) {
          (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
        }
      } else {
        fetchOptions.body = config.body;
      }
    }

    try {
      // 处理超时
      let timeoutId: number | undefined;
      let fetchPromise = fetch(url, fetchOptions);

      if (config.timeout) {
        const timeoutPromise = new Promise<Response>((_, reject) => {
          timeoutId = window.setTimeout(() => {
            reject(new Error(`Request timeout of ${config.timeout}ms exceeded`));
          }, config.timeout);
        });

        // 竞争两个Promise
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);
        
        // 解析响应头
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        // 根据响应类型解析数据
        let data: T;
        const responseType = config.responseType || 'json';
        
        switch(responseType) {
          case 'json':
            data = await response.json();
            break;
          case 'text':
            data = await response.text() as unknown as T;
            break;
          case 'blob':
            data = await response.blob() as unknown as T;
            break;
          case 'arraybuffer':
            data = await response.arrayBuffer() as unknown as T;
            break;
          case 'formdata':
            data = await response.formData() as unknown as T;
            break;
          default:
            data = await response.json();
        }

        // 创建标准化响应
        const httpResponse: HttpResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers,
          originalResponse: response
        };

        // 应用响应拦截器
        if (config.responseInterceptor) {
          return config.responseInterceptor(httpResponse);
        }

        return httpResponse;
      } else {
        // 无超时处理
        const response = await fetchPromise;
        
        // 解析响应头
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        // 根据响应类型解析数据
        let data: T;
        const responseType = config.responseType || 'json';
        
        switch(responseType) {
          case 'json':
            data = await response.json();
            break;
          case 'text':
            data = await response.text() as unknown as T;
            break;
          case 'blob':
            data = await response.blob() as unknown as T;
            break;
          case 'arraybuffer':
            data = await response.arrayBuffer() as unknown as T;
            break;
          case 'formdata':
            data = await response.formData() as unknown as T;
            break;
          default:
            data = await response.json();
        }

        // 创建标准化响应
        const httpResponse: HttpResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers,
          originalResponse: response
        };

        // 应用响应拦截器
        if (config.responseInterceptor) {
          return config.responseInterceptor(httpResponse);
        }

        return httpResponse;
      }
    } catch (error) {
      throw error;
    }
  }
} 