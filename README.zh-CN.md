<div align="center">
  <h1>HTTP 客户端库</h1>
</div>

<div align="center">

这是一个基于依赖倒置原则设计的 TypeScript HTTP 请求库，支持在底层使用 Fetch API 或 XMLHttpRequest。

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/arco-design/arco-design/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>
 

## 特性

- 🔄 依赖倒置设计 - 高层模块不依赖于低层模块的具体实现
- 🔌 可插拔引擎 - 支持 Fetch API 和 XMLHttpRequest
- 🔧 灵活配置 - 丰富的请求配置选项
- 🔗 拦截器支持 - 可拦截请求和响应进行自定义处理
- 📦 类型安全 - 使用 TypeScript 编写，提供完整的类型定义

## 安装

```bash
npm install http-client
```

## 使用方法

### 基本用法

```typescript
import HttpClientFactory from 'http-client';

// 创建 HTTP 客户端（默认使用 Fetch 引擎）
const httpClient = HttpClientFactory.create();

// 发送 GET 请求
httpClient.get('https://api.example.com/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

// 发送 POST 请求
httpClient.post('https://api.example.com/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})
  .then(response => {
    console.log(response.data);
  });
```

### 选择引擎

```typescript
// 使用 Fetch API 引擎
const fetchClient = HttpClientFactory.createFetch();

// 使用 XMLHttpRequest 引擎
const xhrClient = HttpClientFactory.createXhr();

// 或通过参数选择
const client = HttpClientFactory.create('xhr'); // 'fetch' 或 'xhr'
```

### 配置请求

```typescript
// 设置默认配置
const httpClient = HttpClientFactory.create('fetch', {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  timeout: 5000,
  withCredentials: true
});

// 特定请求的配置
httpClient.get('https://api.example.com/posts', {
  params: { // URL 查询参数
    page: 1,
    limit: 10
  },
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### 使用拦截器

```typescript
const httpClient = HttpClientFactory.create('fetch', {
  // 请求拦截器
  requestInterceptor: (config) => {
    // 在发送请求前添加认证头
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${getToken()}`
      }
    };
  },
  
  // 响应拦截器
  responseInterceptor: (response) => {
    // 可以统一处理响应
    if (response.status >= 400) {
      handleError(response);
    }
    return response;
  }
});
```

## API 参考

### HttpClientFactory

- `create(engineType?: 'fetch' | 'xhr', defaultConfig?: Partial<HttpRequestConfig>): HttpClient`
- `createFetch(defaultConfig?: Partial<HttpRequestConfig>): HttpClient`
- `createXhr(defaultConfig?: Partial<HttpRequestConfig>): HttpClient`

### HttpClient

- `request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>`
- `get<T = any>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>`
- `post<T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>`
- `put<T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>`
- `delete<T = any>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>`
- `patch<T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>`

### HttpRequestConfig

```typescript
interface HttpRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formdata';
  requestInterceptor?: (config: HttpRequestConfig) => HttpRequestConfig;
  responseInterceptor?: <T>(response: HttpResponse<T>) => HttpResponse<T>;
}
```

### HttpResponse

```typescript
interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  originalResponse?: any;
}
```

## 许可证

MIT
