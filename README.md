
<div align="center">
  <h1>HTTP Client Library</h1>
</div>

<div align="center">

This is a TypeScript HTTP request library designed based on the dependency inversion principle, supporting the use of Fetch API or XMLHttpRequest at the underlying layer.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/arco-design/arco-design/blob/main/LICENSE)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>
 

## Features

- 🔄 Dependency Inversion Design - High-level modules do not depend on specific implementations of low-level modules
- 🔌 Pluggable Engines - Supports Fetch API and XMLHttpRequest
- 🔧 Flexible Configuration - Rich request configuration options
- 🔗 Interceptor Support - Can intercept requests and responses for custom processing
- 📦 Type Safety - Written in TypeScript, providing complete type definitions

## Installation

```bash
npm install http-client
```

## Usage

### Basic Usage

```typescript
import HttpClientFactory from 'http-client';

// Create HTTP client (uses Fetch engine by default)
const httpClient = HttpClientFactory.create();

// Send GET request
httpClient.get('https://api.example.com/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

// Send POST request
httpClient.post('https://api.example.com/users', {
  name: 'Zhang San',
  email: 'zhangsan@example.com'
})
  .then(response => {
    console.log(response.data);
  });
```

### Selecting an Engine

```typescript
// Use Fetch API engine
const fetchClient = HttpClientFactory.createFetch();

// Use XMLHttpRequest engine
const xhrClient = HttpClientFactory.createXhr();

// Or select through parameters
const client = HttpClientFactory.create('xhr'); // 'fetch' or 'xhr'
```

### Configuring Requests

```typescript
// Set default configuration
const httpClient = HttpClientFactory.create('fetch', {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  timeout: 5000,
  withCredentials: true
});

// Configuration for specific requests
httpClient.get('https://api.example.com/posts', {
  params: { // URL query parameters
    page: 1,
    limit: 10
  },
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### Using Interceptors

```typescript
const httpClient = HttpClientFactory.create('fetch', {
  // Request interceptor
  requestInterceptor: (config) => {
    // Add authentication header before sending request
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${getToken()}`
      }
    };
  },
  
  // Response interceptor
  responseInterceptor: (response) => {
    // Can handle responses uniformly
    if (response.status >= 400) {
      handleError(response);
    }
    return response;
  }
});
```

## API Reference

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

## License

MIT 
