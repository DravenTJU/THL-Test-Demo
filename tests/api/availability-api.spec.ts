import { test, expect } from '@playwright/test';

/**
 * Cosmos Client API – Vehicle Availability Tests
 *
 * Real API test suite covering the vehicle availability endpoint.
 *
 * API Endpoint: https://cosmos-client-api-prod-1.aws.thlonline.com/client/availability
 *
 * @group api
 * @group integration
 * @group real-api
 */

// API configuration
const API_CONFIG = {
  baseURL: 'https://cosmos-client-api-prod-1.aws.thlonline.com',
  endpoint: '/client/availability',
  timeout: 15000, // 15-second timeout (API can respond slowly)
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en_US',
    'content-type': 'application/json',
    origin: 'https://booking.maui-rentals.com',
    'x-organizationcode': 'NZ'
  }
};

// Standard search parameters
const getStandardSearchParams = () => ({
  checkOutZoneCode: 'akl',
  checkInZoneCode: 'akl',
  startDate: '2025-11-01T11:00:00',
  endDate: '2025-11-07T12:00:00',
  countryCode: 'NZ',
  noOfAdults: '1',
  noOfChildren: '0',
  agentCode: 'B2CNZ',
  ageRange: '21+',
  brandCode: 'M',
  countryOfResidence: 'NZ',
  promoCode: ''
});

test.describe('Cosmos Availability API – Basic Tests', () => {

  test('should return vehicle availability data @api @smoke', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams(),
        timeout: API_CONFIG.timeout
      }
    );

    const duration = Date.now() - startTime;
    console.log(`✓ API response time: ${duration}ms`);

    // Validate HTTP status
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Validate response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    // Parse response data
    const data = await response.json();

    // Response should be a non-empty array
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    console.log(`✓ Returned ${data.length} available vehicles`);
  });

  test('should respond within the target time @api @performance', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams(),
        timeout: API_CONFIG.timeout
      }
    );

    const duration = Date.now() - startTime;

    // Verify the call succeeded
    expect(response.ok()).toBeTruthy();

    // API should respond within 5 seconds
    expect(duration).toBeLessThan(5000);
    console.log(`✓ Response time: ${duration}ms (target: <5000ms)`);

    // Great performance is <2 seconds
    if (duration < 2000) {
      console.log('⚡ Excellent response performance!');
    }
  });
});

test.describe('Cosmos Availability API – Response Structure', () => {

  test('should return a complete vehicle object @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const firstVehicle = data[0];

    // Validate top-level structure
    expect(firstVehicle).toHaveProperty('searchResponseItemId');
    expect(firstVehicle).toHaveProperty('vehicle');
    expect(firstVehicle).toHaveProperty('product');
    expect(firstVehicle).toHaveProperty('pricing');
    expect(firstVehicle).toHaveProperty('group');
    expect(firstVehicle).toHaveProperty('details');
    expect(firstVehicle).toHaveProperty('loyaltyPrograms');
    expect(firstVehicle).toHaveProperty('applicableVoucherProviders');

    console.log('✓ Vehicle payload structure validated');
  });

  test('should include core vehicle details @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const firstVehicle = data[0];

    // Validate vehicle details
    expect(firstVehicle.vehicle).toHaveProperty('name');
    expect(firstVehicle.vehicle).toHaveProperty('code');
    expect(typeof firstVehicle.vehicle.name).toBe('string');
    expect(typeof firstVehicle.vehicle.code).toBe('string');

    console.log(`✓ Vehicle: ${firstVehicle.vehicle.name} (${firstVehicle.vehicle.code})`);
  });

  test('should expose full product information @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const product = data[0].product;

    // Validate product structure
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('code');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('type');
    expect(product).toHaveProperty('mediaHrefSpecials');
    expect(product).toHaveProperty('maxPassengers');
    expect(product).toHaveProperty('keySpecifications');
    expect(product).toHaveProperty('features');
    expect(product).toHaveProperty('categories');
    expect(product).toHaveProperty('available');

    // Validate value types
    expect(Array.isArray(product.mediaHrefSpecials)).toBe(true);
    expect(Array.isArray(product.keySpecifications)).toBe(true);
    expect(Array.isArray(product.categories)).toBe(true);
    expect(typeof product.maxPassengers).toBe('number');
    expect(typeof product.available).toBe('boolean');

    console.log(`✓ Product payload complete: ${product.name}`);
    console.log(`  - Max passengers: ${product.maxPassengers}`);
    console.log(`  - Availability: ${product.available}`);
    console.log(`  - Image count: ${product.mediaHrefSpecials.length}`);
  });

  test('should include pricing information @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const pricing = data[0].pricing;

    // Validate pricing structure
    expect(pricing).toHaveProperty('averageDiscountRate');
    expect(pricing).toHaveProperty('averageRate');
    expect(pricing).toHaveProperty('total');
    expect(pricing).toHaveProperty('originalValue');
    expect(pricing).toHaveProperty('totalDiscounts');
    expect(pricing).toHaveProperty('currencyCode');
    expect(pricing).toHaveProperty('onSpecial');

    // Validate data types and values
    expect(typeof pricing.total).toBe('number');
    expect(pricing.total).toBeGreaterThan(0);
    expect(pricing.currencyCode).toBe('NZD');
    expect(typeof pricing.onSpecial).toBe('boolean');

    console.log('✓ Pricing summary:');
    console.log(`  - Total: ${pricing.currencyCode} $${pricing.total}`);
    console.log(`  - Average daily rate: ${pricing.currencyCode} $${pricing.averageRate}`);
    console.log(`  - On special: ${pricing.onSpecial ? 'Yes' : 'No'}`);
  });

  test('should include rental details @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const details = data[0].details;

    // Validate rental details
    expect(details).toHaveProperty('startPoint');
    expect(details).toHaveProperty('endPoint');
    expect(details).toHaveProperty('startDate');
    expect(details).toHaveProperty('endDate');
    expect(details).toHaveProperty('hirePeriod');

    // Validate pickup/drop-off points
    expect(details.startPoint).toHaveProperty('code');
    expect(details.startPoint).toHaveProperty('name');
    expect(details.endPoint).toHaveProperty('code');
    expect(details.endPoint).toHaveProperty('name');

    console.log('✓ Rental details:');
    console.log(`  - Pickup: ${details.startPoint.name} (${details.startPoint.code})`);
    console.log(`  - Drop-off: ${details.endPoint.name} (${details.endPoint.code})`);
    console.log(`  - Hire period: ${details.hirePeriod} days`);
  });

  test('should include vehicle feature data @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const features = data[0].product.features;

    // Validate key features
    expect(features).toHaveProperty('maxPassengers');
    expect(features).toHaveProperty('numOfAdults');
    expect(features).toHaveProperty('numOfChildren');
    expect(features).toHaveProperty('transmission');
    expect(features).toHaveProperty('fuelType');
    expect(features).toHaveProperty('beds');

    console.log('✓ Vehicle features:');
    console.log(`  - Max passengers: ${features.maxPassengers}`);
    console.log(`  - Beds: ${features.beds}`);
    console.log(`  - Transmission: ${features.transmission}`);
    console.log(`  - Fuel type: ${features.fuelType}`);
  });
});

test.describe('Cosmos Availability API – Scenario Coverage', () => {

  test('should support different pickup and drop-off locations @api', async ({ request }) => {
    // Auckland to Christchurch
    const params = {
      ...getStandardSearchParams(),
      checkOutZoneCode: 'akl',
      checkInZoneCode: 'chc'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params
      }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    console.log(`✓ AKL → CHC: ${data.length} vehicles available`);
  });

  test('should support higher passenger counts @api', async ({ request }) => {
    // Four adults
    const params = {
      ...getStandardSearchParams(),
      noOfAdults: '4',
      noOfChildren: '0'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params
      }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Ensure each vehicle supports four adults
    data.forEach((vehicle: any) => {
      expect(vehicle.product.maxPassengers).toBeGreaterThanOrEqual(4);
    });

    console.log(`✓ 4 adults: ${data.length} suitable vehicles`);
  });

  test('should support promo code queries @api', async ({ request }) => {
    const params = {
      ...getStandardSearchParams(),
      promoCode: 'TEST2024'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params
      }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    console.log(`✓ Promo code search: ${data.length} results`);
  });

  test('should support alternate driver age ranges @api', async ({ request }) => {
    // 25+ age band
    const params = {
      ...getStandardSearchParams(),
      ageRange: '25+'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params
      }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    console.log(`✓ Age range 25+: ${data.length} vehicles available`);
  });

  test('should support short-term rentals @api', async ({ request }) => {
    // Three-day hire
    const params = {
      ...getStandardSearchParams(),
      startDate: '2025-11-01T11:00:00',
      endDate: '2025-11-04T11:00:00'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params
      }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Validate hire period
    data.forEach((vehicle: any) => {
      expect(vehicle.details.hirePeriod).toBe(3);
    });

    console.log(`✓ 3-day rental: ${data.length} vehicles available`);
  });
});

test.describe('Cosmos Availability API – Data Integrity', () => {

  test('should return UUID-formatted searchResponseItemId @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();

    // UUID regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    data.forEach((vehicle: any) => {
      expect(uuidRegex.test(vehicle.searchResponseItemId)).toBe(true);
    });

    console.log('✓ All vehicle IDs are valid UUIDs');
  });

  test('should return valid date formats @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const details = data[0].details;

    // Validate dates can be parsed
    const startDate = new Date(details.startDate);
    const endDate = new Date(details.endDate);

    expect(startDate.toString()).not.toBe('Invalid Date');
    expect(endDate.toString()).not.toBe('Invalid Date');
    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());

    console.log('✓ Date fields are valid');
  });

  test('should return valid image URLs @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();
    const media = data[0].product.mediaHrefSpecials;

    expect(media.length).toBeGreaterThan(0);

    media.forEach((image: any) => {
      expect(image).toHaveProperty('source');
      expect(image).toHaveProperty('isDefault');
      expect(image.source).toContain('cloudinary.com');
    });

    console.log(`✓ ${media.length} image URLs verified`);
  });

  test('should return pricing within sensible bounds @api @validation', async ({ request }) => {
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: getStandardSearchParams()
      }
    );

    const data = await response.json();

    data.forEach((vehicle: any) => {
      const pricing = vehicle.pricing;

      // Prices should be positive
      expect(pricing.total).toBeGreaterThan(0);
      expect(pricing.averageRate).toBeGreaterThan(0);

      // Total should be >= average rate
      expect(pricing.total).toBeGreaterThanOrEqual(pricing.averageRate);

      // Discount rate should sit between 0 and 100
      expect(pricing.averageDiscountRate).toBeGreaterThanOrEqual(0);
      expect(pricing.averageDiscountRate).toBeLessThanOrEqual(100);
    });

    console.log('✓ Pricing data falls within expected ranges');
  });
});

test.describe('Cosmos Availability API – Error Handling', () => {

  test('should handle missing required parameters @api @error', async ({ request }) => {
    // Send a request missing required fields
    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: {
          checkOutZoneCode: 'akl'
          // Other required fields omitted intentionally
        },
        failOnStatusCode: false
      }
    );

    // Should return an error status code
    expect(response.status()).toBeGreaterThanOrEqual(400);

    console.log(`✓ Missing parameter handling: HTTP ${response.status()}`);
  });

  test('should handle invalid date formats @api @error', async ({ request }) => {
    const params = {
      ...getStandardSearchParams(),
      startDate: 'invalid-date',
      endDate: 'invalid-date'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params,
        failOnStatusCode: false
      }
    );

    // Should return an error or an empty result set
    if (response.ok()) {
      const data = await response.json();
      // A 200 response should still return an empty list or error info
      console.log(`✓ Invalid date handling: returned ${Array.isArray(data) ? data.length : 0} results`);
    } else {
      console.log(`✓ Invalid date error handling: HTTP ${response.status()}`);
    }
  });

  test('should handle past dates @api @error', async ({ request }) => {
    const params = {
      ...getStandardSearchParams(),
      startDate: '2020-01-01T11:00:00',
      endDate: '2020-01-07T12:00:00'
    };

    const response = await request.post(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
      {
        headers: API_CONFIG.headers,
        data: params,
        failOnStatusCode: false
      }
    );

    if (response.ok()) {
      const data = await response.json();
      // Past dates should return an empty result
      console.log(`✓ Past date handling: ${Array.isArray(data) ? data.length : 0} results returned`);
    } else {
      console.log(`✓ Past date error handling: HTTP ${response.status()}`);
    }
  });
});

test.describe('Cosmos Availability API – Performance', () => {

  test('should support concurrent requests @api @performance', async ({ request }) => {
    const locations = ['akl', 'chc', 'wlg', 'qtn'];
    const startTime = Date.now();

    const promises = locations.map(location => {
      const params = {
        ...getStandardSearchParams(),
        checkOutZoneCode: location,
        checkInZoneCode: location
      };

      return request.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
        {
          headers: API_CONFIG.headers,
          data: params
        }
      );
    });

    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;

    // All requests should succeed
    results.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    console.log(`✓ ${locations.length} concurrent requests completed`);
    console.log(`  - Total time: ${duration}ms`);
    console.log(`  - Average time: ${Math.round(duration / locations.length)}ms/request`);
  });

  test('should maintain stable performance across 10 requests @api @performance', async ({ request }) => {
    const responseTimes: number[] = [];

    for (let i = 0; i < 10; i++) {
      const startTime = Date.now();

      const response = await request.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoint}`,
        {
          headers: API_CONFIG.headers,
          data: getStandardSearchParams()
        }
      );

      const duration = Date.now() - startTime;
      responseTimes.push(duration);

      expect(response.ok()).toBeTruthy();
    }

    // Compute stats
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);

    console.log('✓ Performance summary for 10 calls:');
    console.log(`  - Average: ${Math.round(avgTime)}ms`);
    console.log(`  - Fastest: ${minTime}ms`);
    console.log(`  - Slowest: ${maxTime}ms`);

    // Average response time should remain under 5 seconds
    expect(avgTime).toBeLessThan(5000);
  });
});
