import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '../api/AxiosInstance';

beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'mocked-jwt-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

describe('axiosInstance', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  test('should add Authorization header if JWT token exists', async () => {
    mock.onGet('/test').reply(200, { message: 'Success' });
    const response = await axiosInstance.get('/test');
    expect(response.config.headers.Authorization).toBe('Bearer mocked-jwt-token');
    expect(response.status).toBe(200);
  });

  test('should not add Authorization header if JWT token does not exist', async () => {
    localStorage.getItem = jest.fn(() => null);
    mock.onGet('/test').reply(200, { message: 'Success' });
    const response = await axiosInstance.get('/test');
    expect(response.config.headers.Authorization).toBeUndefined();
    expect(response.status).toBe(200);
  });

  test('should handle request errors', async () => {
    mock.onGet('/test').networkError();
    await expect(axiosInstance.get('/test')).rejects.toThrow();
  });

  test('should handle request errors (other cases)', async () => {
    mock.onGet('/test').reply(500, { error: 'Internal Server Error' });
    await expect(axiosInstance.get('/test')).rejects.toThrow('Request failed with status code 500');
  });
});
