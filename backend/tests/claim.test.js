const request = require('supertest');
const app = require('../server');

describe('POST /api/claims', () => {
  it('should create a new claim successfully', async () => {
    const response = await request(app)
      .post('/api/claims')
      .field('name', 'Test User')
      .field('phoneNumber', '9876543210')
      .field('email', 'test@example.com')
      .field('place', 'Kochi')
      .field('description', 'Test claim')
      .field('hospital', 'Test Hospital')
      .field('hospitalLocation', 'Test Location')
      .attach('file', '__tests__/testfile.png'); // ensure this file exists

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
  });
});
