import { HttpClient, HttpRequestConfig } from './interfaces';
import { HttpClientImpl } from './http-client';
import { FetchRequestEngine } from './engines/fetch-engine';
import { XhrRequestEngine } from './engines/xhr-engine';

/**
 * HTTP客户端引擎类型
 */
export type HttpEngineType = 'fetch' | 'xhr';

/**
 * HTTP客户端工厂类
 * 用于创建不同底层实现的HTTP客户端
 */
export class HttpClientFactory {
  /**
   * 创建HTTP客户端
   * @param engineType 引擎类型，'fetch'或'xhr'
   * @param defaultConfig 默认配置
   * @returns HttpClient实例
   */
  static create(engineType: HttpEngineType = 'fetch', defaultConfig: Partial<HttpRequestConfig> = {}): HttpClient {
    switch (engineType) {
      case 'fetch':
        return new HttpClientImpl(new FetchRequestEngine(), defaultConfig);
      case 'xhr':
        return new HttpClientImpl(new XhrRequestEngine(), defaultConfig);
      default:
        throw new Error(`不支持的引擎类型: ${engineType}`);
    }
  }

 
} 