import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * k6负载测试脚本
 *
 * 测试Maui Rentals搜索API的性能和可扩展性
 *
 * 运行命令：
 * k6 run k6/load-test.js
 *
 * @module k6/load-test
 */

// 自定义指标
const errorRate = new Rate('errors');
const searchDuration = new Trend('search_duration');

// 测试配置
export const options = {
  // 负载测试阶段
  stages: [
    { duration: '1m', target: 10 },  // 1分钟内上升到10用户
    { duration: '2m', target: 50 },  // 2分钟内上升到50用户
    { duration: '2m', target: 50 },  // 保持50用户2分钟
    { duration: '1m', target: 0 },   // 1分钟内降到0
  ],

  // 性能阈值
  thresholds: {
    'http_req_duration': ['p(95)<3000'], // 95%请求应在3秒内
    'http_req_failed': ['rate<0.01'],    // 错误率应低于1%
    'errors': ['rate<0.05'],             // 自定义错误率低于5%
    'search_duration': ['p(95)<3000'],   // 95%搜索应在3秒内
  },

  // HTTP配置
  http: {
    timeout: '30s',
  },
};

// 基础URL
const BASE_URL = __ENV.BASE_URL || 'https://booking.maui-rentals.com';

// 测试数据
const locations = ['Auckland', 'Christchurch', 'Queenstown', 'Wellington'];
const pickupDates = ['2025-12-01', '2025-12-15', '2026-01-01', '2026-01-15'];

/**
 * 生成随机日期范围
 */
function getRandomDateRange() {
  const pickupDate = pickupDates[Math.floor(Math.random() * pickupDates.length)];
  const pickupDateObj = new Date(pickupDate);
  const dropoffDateObj = new Date(pickupDateObj);
  dropoffDateObj.setDate(dropoffDateObj.getDate() + Math.floor(Math.random() * 10) + 3);

  const dropoffDate = dropoffDateObj.toISOString().split('T')[0];

  return { pickupDate, dropoffDate };
}

/**
 * Setup - 在测试开始前执行
 */
export function setup() {
  console.log('Starting load test...');
  console.log(`Base URL: ${BASE_URL}`);

  // 测试基础连接
  const res = http.get(BASE_URL);
  const connectionOk = check(res, {
    'connection successful': (r) => r.status === 200 || r.status === 403,
  });

  if (!connectionOk) {
    console.error('Failed to connect to base URL');
  }

  return { startTime: new Date() };
}

/**
 * 主测试函数 - 每个虚拟用户执行
 */
export default function (data) {
  // 选择随机地点
  const pickupLocation = locations[Math.floor(Math.random() * locations.length)];
  const dropoffLocation = locations[Math.floor(Math.random() * locations.length)];
  const { pickupDate, dropoffDate } = getRandomDateRange();

  // 构建搜索URL
  const searchUrl = `${BASE_URL}/api/search?pickupLocation=${pickupLocation}&dropoffLocation=${dropoffLocation}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`;

  // 执行搜索请求
  const searchStart = Date.now();
  const res = http.get(searchUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'k6-load-test/1.0',
    },
    tags: {
      name: 'search_api',
    },
  });
  const searchEnd = Date.now();

  // 记录搜索持续时间
  searchDuration.add(searchEnd - searchStart);

  // 验证响应
  const checkResult = check(res, {
    'status is 200': (r) => r.status === 200,
    'status is not 5xx': (r) => r.status < 500,
    'response has body': (r) => r.body.length > 0,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  // 记录错误
  errorRate.add(!checkResult);

  // 如果响应成功，验证数据结构
  if (res.status === 200) {
    try {
      const data = JSON.parse(res.body);
      check(data, {
        'has results': (d) => d.results !== undefined,
        'has total': (d) => d.total !== undefined,
      });
    } catch (e) {
      errorRate.add(1);
      console.error('Failed to parse response:', e);
    }
  }

  // 模拟用户思考时间（1-3秒）
  sleep(Math.random() * 2 + 1);

  // 模拟浏览页面
  http.get(BASE_URL, {
    tags: { name: 'browse_page' },
  });

  sleep(Math.random() * 2);
}

/**
 * Teardown - 测试结束后执行
 */
export function teardown(data) {
  console.log('Load test completed');
  console.log(`Started at: ${data.startTime}`);
  console.log(`Ended at: ${new Date()}`);
}

/**
 * 处理总结数据
 */
export function handleSummary(data) {
  console.log('Test Summary:');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%`);
  console.log(`Avg Response Time: ${data.metrics.http_req_duration.values.avg}ms`);
  console.log(`P95 Response Time: ${data.metrics.http_req_duration.values['p(95)']}ms`);

  return {
    'summary.json': JSON.stringify(data),
  };
}
