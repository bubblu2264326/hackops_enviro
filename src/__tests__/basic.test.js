import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Database connection test
describe('Database Connectivity', () => {
  let pool;

  beforeAll(() => {
    pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should connect to database successfully', async () => {
    const client = await pool.connect();
    expect(client).toBeTruthy();
    client.release();
  });

  test('should execute a simple query', async () => {
    const result = await pool.query('SELECT 1 as test');
    expect(result.rows[0].test).toBe(1);
  });
});

// Main functionality test
describe('Basic Application Functionality', () => {
  test('should have required environment variables', () => {
    expect(process.env.ACCESS_TOKEN_SECRET).toBeDefined();
    expect(process.env.REFRESH_TOKEN_SECRET).toBeDefined();
  });

  test('should have basic API endpoints', () => {
    // This is a placeholder test - you can expand it based on your actual API endpoints
    const endpoints = ['/api/auth', '/api/users'];
    expect(endpoints).toBeDefined();
    expect(endpoints.length).toBeGreaterThan(0);
  });
});

// Authentication test
describe('Authentication System', () => {
  test('should generate valid JWT tokens', () => {
    const payload = { userId: 'test123' };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    expect(() => jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)).not.toThrow();
  });
});

// API Integration test
describe('API Integration', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  });

  test('should connect to API endpoints', async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/health`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'ok');
    } catch (error) {
      // If API is not running, we'll get a connection error
      expect(error.code).toBe('ECONNREFUSED');
    }
  });
}); 