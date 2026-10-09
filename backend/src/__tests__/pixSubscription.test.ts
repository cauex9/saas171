import assert from 'assert';
import http from 'http';
import app from '../app';
import { PaymentService } from '../services/paymentService';
import { env } from '../config/env';

async function runTests() {
  console.log('🚀 Starting Pix Subscription Tests...\n');

  // Test 1: Service level execution (mock / dev mode)
  const service = new PaymentService();
  const validPayload = {
    identifier: `test_${Date.now()}`,
    amount: 80,
    product: {
      id: 'prod_h71akcfur0xf',
      name: 'Plano Pro 1',
      quantity: 1,
      price: 80
    },
    subscription: {
      periodicityType: 'MONTHS' as const,
      periodicity: 1,
      firstChargeIn: 0
    },
    client: {
      name: 'João da Silva',
      email: 'joao@gmail.com',
      phone: '(11) 99999-9999',
      document: '123.456.789-00'
    },
    dueDate: '2026-10-10',
    metadata: {
      provider: 'Checkout',
      orderId: '1234'
    },
    callbackUrl: 'https://minha.api.com/pix/callback/w53kuxynyq'
  };

  const response = await service.createPixSubscription(validPayload);
  assert.ok(response.transactionId, 'Transaction ID should be returned');
  assert.strictEqual(response.status, 'OK', 'Status should be OK');
  assert.ok(response.pix?.code, 'PIX copy-paste code should be returned');
  assert.strictEqual(response.subscription.periodicityType, 'MONTHS');
  assert.strictEqual(response.subscription.periodicity, 1);
  console.log('✅ Test 1 Passed: PaymentService createPixSubscription returns valid response structure.');

  // Test 2: HTTP Endpoint POST /api/payments/pix/subscription - Success Case
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const httpRes = await fetch(`${baseUrl}/api/payments/pix/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload)
    });

    assert.strictEqual(httpRes.status, 200, 'HTTP status should be 200');
    const json: any = await httpRes.json();
    assert.strictEqual(json.status, 'OK');
    assert.ok(json.transactionId);
    assert.ok(json.pix.code);
    assert.ok(json.subscription.id);
    console.log('✅ Test 2 Passed: HTTP POST /api/payments/pix/subscription returns 200 OK.');

    // Test 3: HTTP Endpoint POST /api/payments/pix/subscription - Validation Error (400 Bad Request)
    const invalidPayload = {
      identifier: 'test_invalid',
      amount: -5, // Invalid negative amount
      product: {
        id: 'prod_1',
        name: 'Product 1',
        price: -5
      },
      subscription: {
        periodicityType: 'INVALID_ENUM', // Invalid periodicity type
        periodicity: 0
      },
      client: {
        name: '',
        email: 'not-an-email'
      }
    };

    const errRes = await fetch(`${baseUrl}/api/payments/pix/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload)
    });

    assert.strictEqual(errRes.status, 400, 'HTTP status should be 400 for invalid data');
    const errJson: any = await errRes.json();
    assert.strictEqual(errJson.statusCode, 400);
    assert.strictEqual(errJson.errorCode, 'GATEWAY_INVALID_DATA');
    assert.ok(Array.isArray(errJson.details), 'details should be an array of validation errors');
    assert.ok(errJson.details.length >= 3, 'should contain multiple validation issues');
    console.log('✅ Test 3 Passed: HTTP POST /api/payments/pix/subscription returns 400 Bad Request with validation details.');

    // Test 4: Header Transmission Verification with mock HTTP server as PoseidonPay Gateway
    const mockGatewayHeaders: Record<string, string> = {};
    let mockGatewayBody: any = null;

    const mockGatewayServer = http.createServer((req, res) => {
      mockGatewayHeaders['x-public-key'] = req.headers['x-public-key'] as string;
      mockGatewayHeaders['x-secret-key'] = req.headers['x-secret-key'] as string;
      
      let bodyStr = '';
      req.on('data', chunk => bodyStr += chunk);
      req.on('end', () => {
        mockGatewayBody = JSON.parse(bodyStr || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          transactionId: 'gw_tx_123',
          status: 'OK',
          fee: 4,
          pix: { code: '00020101...', expiresAt: '2026-10-10T00:00:00Z' },
          subscription: {
            id: 'gw_sub_123',
            periodicity: 1,
            periodicityType: 'MONTHS',
            nextChargeAt: '2026-11-10T00:00:00Z',
            startAt: '2026-10-10T00:00:00Z',
            status: 'INACTIVE'
          }
        }));
      });
    });

    await new Promise<void>((res) => mockGatewayServer.listen(0, res));
    const gwAddress = mockGatewayServer.address() as { port: number };
    
    // Set custom env variables for test
    const origUrl = env.poseidonpayApiUrl;
    const origPub = env.poseidonpayPublicKey;
    const origSec = env.poseidonpaySecretKey;

    env.poseidonpayApiUrl = `http://127.0.0.1:${gwAddress.port}`;
    env.poseidonpayPublicKey = 'pub_key_test_123';
    env.poseidonpaySecretKey = 'sec_key_test_456';

    const gwService = new PaymentService();
    const gwResult = await gwService.createPixSubscription(validPayload);

    assert.strictEqual(mockGatewayHeaders['x-public-key'], 'pub_key_test_123', 'x-public-key header must match env');
    assert.strictEqual(mockGatewayHeaders['x-secret-key'], 'sec_key_test_456', 'x-secret-key header must match env');
    assert.strictEqual(gwResult.transactionId, 'gw_tx_123');
    assert.strictEqual(mockGatewayBody.identifier, validPayload.identifier);

    // Restore env
    env.poseidonpayApiUrl = origUrl;
    env.poseidonpayPublicKey = origPub;
    env.poseidonpaySecretKey = origSec;
    mockGatewayServer.close();

    console.log('✅ Test 4 Passed: Headers x-public-key and x-secret-key correctly transmitted to PoseidonPay gateway URL.');

  } finally {
    server.close();
  }

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
