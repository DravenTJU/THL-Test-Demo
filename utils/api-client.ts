import { APIRequestContext } from '@playwright/test';

/**
 * API客户端类
 * 封装API请求和响应处理
 */

export interface SearchAPIRequest {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  vehicleType?: string;
  passengers?: number;
}

export interface SearchAPIResponse {
  results: VehicleResult[];
  total: number;
  filters: SearchFilters;
}

export interface VehicleResult {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: {
    daily: number;
    total: number;
    currency: string;
  };
  features: string[];
  image: string;
  availability: boolean;
}

export interface SearchFilters {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  days: number;
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
}

/**
 * API客户端类
 */
export class APIClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://booking.maui-rentals.com';
  }

  /**
   * 搜索车辆
   * @param searchParams - 搜索参数
   * @returns API响应
   */
  async searchVehicles(searchParams: SearchAPIRequest): Promise<SearchAPIResponse> {
    const response = await this.request.get(`${this.baseURL}/api/search`, {
      params: {
        pickupLocation: searchParams.pickupLocation,
        dropoffLocation: searchParams.dropoffLocation,
        pickupDate: searchParams.pickupDate,
        dropoffDate: searchParams.dropoffDate,
        ...(searchParams.vehicleType && { vehicleType: searchParams.vehicleType }),
        ...(searchParams.passengers && { passengers: searchParams.passengers.toString() }),
      },
      timeout: 30000,
    });

    if (!response.ok()) {
      throw new Error(`Search API failed: ${response.status()} ${response.statusText()}`);
    }

    return await response.json() as SearchAPIResponse;
  }

  /**
   * 获取可用地点列表
   * @param country - 国家代码（可选）
   * @returns 地点列表
   */
  async getLocations(country?: string): Promise<LocationData[]> {
    const params = country ? { country } : {};
    const response = await this.request.get(`${this.baseURL}/api/locations`, {
      params,
      timeout: 15000,
    });

    if (!response.ok()) {
      throw new Error(`Locations API failed: ${response.status()} ${response.statusText()}`);
    }

    const data = await response.json();
    return data as LocationData[];
  }

  /**
   * 检查车辆可用性
   * @param vehicleId - 车辆ID
   * @param dates - 日期范围
   * @returns 可用性信息
   */
  async checkAvailability(
    vehicleId: string,
    dates: { pickupDate: string; dropoffDate: string }
  ): Promise<{ available: boolean; vehicleCount: number; message?: string }> {
    const response = await this.request.get(`${this.baseURL}/api/availability/${vehicleId}`, {
      params: {
        pickupDate: dates.pickupDate,
        dropoffDate: dates.dropoffDate,
      },
      timeout: 15000,
    });

    if (!response.ok()) {
      throw new Error(`Availability API failed: ${response.status()} ${response.statusText()}`);
    }

    return await response.json();
  }

  /**
   * 验证API响应结构
   * @param response - API响应
   * @param expectedFields - 期望的字段
   */
  validateResponseStructure(response: unknown, expectedFields: string[]): void {
    if (typeof response !== 'object' || response === null) {
      throw new Error('Response is not an object');
    }

    const responseObj = response as Record<string, unknown>;
    const missingFields = expectedFields.filter((field) => !(field in responseObj));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * 获取响应头
   * @param response - Playwright Response对象
   * @returns 响应头对象
   */
  static getResponseHeaders(response: { headers: () => Record<string, string> }): Record<string, string> {
    return response.headers();
  }

  /**
   * 验证响应时间
   * @param startTime - 请求开始时间
   * @param maxDuration - 最大允许时间（毫秒）
   * @returns 实际耗时
   */
  static validateResponseTime(startTime: number, maxDuration: number): number {
    const duration = Date.now() - startTime;
    if (duration > maxDuration) {
      throw new Error(`Response time ${duration}ms exceeded maximum ${maxDuration}ms`);
    }
    return duration;
  }
}

/**
 * Mock服务器路由配置
 */
export class MockAPI {
  /**
   * 创建搜索API的mock响应
   * @param mockData - Mock数据
   * @returns Mock配置
   */
  static createSearchMock(mockData: SearchAPIResponse): {
    url: string | RegExp;
    response: SearchAPIResponse;
  } {
    return {
      url: /\/api\/search/,
      response: mockData,
    };
  }

  /**
   * 创建地点API的mock响应
   * @param mockData - Mock数据
   * @returns Mock配置
   */
  static createLocationsMock(mockData: LocationData[]): {
    url: string | RegExp;
    response: LocationData[];
  } {
    return {
      url: /\/api\/locations/,
      response: mockData,
    };
  }

  /**
   * 创建错误响应mock
   * @param statusCode - HTTP状态码
   * @param errorMessage - 错误消息
   * @returns Mock配置
   */
  static createErrorMock(
    statusCode: number,
    errorMessage: string
  ): {
    url: string | RegExp;
    status: number;
    response: { error: { code: string; message: string } };
  } {
    return {
      url: /\/api\//,
      status: statusCode,
      response: {
        error: {
          code: 'API_ERROR',
          message: errorMessage,
        },
      },
    };
  }
}
