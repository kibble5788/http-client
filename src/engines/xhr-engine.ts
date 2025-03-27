import { HttpRequestConfig, HttpRequestEngine, HttpResponse } from '../interfaces';

/**
 * 基于XMLHttpRequest的HTTP请求引擎实现
 */
export class XhrRequestEngine implements HttpRequestEngine {
  async execute<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    // 应用请求拦截器
    if (config.requestInterceptor) {
      config = config.requestInterceptor(config);
    }

    // 返回一个Promise以符合接口约定
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
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

      // 初始化请求
      xhr.open(config.method || 'GET', url, true);
      
      // 设置响应类型
      if (config.responseType && config.responseType !== 'formdata') {
        xhr.responseType = config.responseType as XMLHttpRequestResponseType;
      }

      // 设置请求头
      if (config.headers) {
        Object.entries(config.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // 处理凭证
      if (config.withCredentials) {
        xhr.withCredentials = true;
      }

      // 设置超时
      if (config.timeout) {
        xhr.timeout = config.timeout;
      }

      // 加载完成事件
      xhr.onload = () => {
        // 解析响应头
        const headers: Record<string, string> = {};
        const headerString = xhr.getAllResponseHeaders();
        const headerPairs = headerString.split('\r\n');
        
        for (const pair of headerPairs) {
          if (pair.trim()) {
            const index = pair.indexOf(':');
            const key = pair.substring(0, index).trim().toLowerCase();
            const value = pair.substring(index + 1).trim();
            headers[key] = value;
          }
        }

        // 解析响应数据
        let data: T;
        
        if (xhr.responseType === '' || xhr.responseType === 'text') {
          try {
            // 尝试解析为JSON
            data = JSON.parse(xhr.responseText) as T;
          } catch (e) {
            // 如果解析失败，返回原始文本
            data = xhr.responseText as unknown as T;
          }
        } else {
          data = xhr.response as T;
        }

        // 创建标准化响应
        const response: HttpResponse<T> = {
          data,
          status: xhr.status,
          statusText: xhr.statusText,
          headers,
          originalResponse: xhr
        };

        // 应用响应拦截器
        if (config.responseInterceptor) {
          resolve(config.responseInterceptor(response));
        } else {
          resolve(response);
        }
      };

      // 错误处理
      xhr.onerror = () => {
        reject(new Error('Network Error'));
      };

      // 超时处理
      xhr.ontimeout = () => {
        reject(new Error(`Request timeout of ${config.timeout}ms exceeded`));
      };

      // 发送请求
      if (config.body) {
        let body = config.body;
        
        // 如果body是对象且不是FormData或Blob，尝试JSON序列化
        if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
          body = JSON.stringify(body);
          
          // 如果没有显式设置Content-Type，默认为application/json
          if (!config.headers || !Object.keys(config.headers).some(h => h.toLowerCase() === 'content-type')) {
            xhr.setRequestHeader('Content-Type', 'application/json');
          }
        }
        
        xhr.send(body);
      } else {
        xhr.send();
      }
    });
  }
} 