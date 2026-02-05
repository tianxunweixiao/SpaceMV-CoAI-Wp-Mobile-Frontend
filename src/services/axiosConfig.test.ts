import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// 创建一个全局变量来存储 mockAxiosInstance
let mockAxiosInstance: any

// Mock axios.create
vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn((success, error) => {
          // 存储拦截器函数以便测试
          instance._requestInterceptor = success
          instance._requestErrorInterceptor = error
          return 1
        }),
      },
      response: {
        use: vi.fn((success, error) => {
          // 存储拦截器函数以便测试
          instance._responseInterceptor = success
          instance._responseErrorInterceptor = error
          return 1
        }),
      },
    },
  }

  const mockAxios = {
    create: vi.fn(() => {
      mockAxiosInstance = instance
      return instance
    })
  }

  return {
    default: mockAxios
  }
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Mock import.meta.env
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080/api')

describe('axiosConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create axios instance with correct config', async () => {
    // Import the actual axiosConfig to trigger the instance creation
    await import('./axiosConfig')
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8080/api',
      timeout: 10000,
    })
  })

  it('should test request interceptor with token', async () => {
    // Mock localStorage with token
    mockLocalStorage.getItem.mockReturnValue('test-token')

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the request interceptor function from the mock instance
    const requestInterceptor = mockAxiosInstance._requestInterceptor

    // Test config with token
    const config = {
      headers: {},
      method: 'get',
      url: '/test',
      params: {}
    }

    const result = await requestInterceptor(config)

    expect(result.headers.Authorization).toBe('Bearer test-token')
  })

  it('should test request interceptor without token', async () => {
    // Mock localStorage without token
    mockLocalStorage.getItem.mockReturnValue(null)

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the request interceptor function from the mock instance
    const requestInterceptor = mockAxiosInstance._requestInterceptor

    // Test config without token
    const config = {
      headers: {},
      method: 'get',
      url: '/test',
      params: {}
    }

    const result = await requestInterceptor(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('should test request interceptor with get params', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the request interceptor function from the mock instance
    const requestInterceptor = mockAxiosInstance._requestInterceptor

    // Test config with get params
    const config = {
      headers: {},
      method: 'get',
      url: '/test',
      params: {
        id: 1,
        name: 'test',
        empty: '',
        nullValue: null,
        undefinedValue: undefined
      }
    }

    const result = await requestInterceptor(config)

    expect(result.url).toBe('/test?id=1&name=test')
    expect(result.params).toEqual({})
  })

  it('should test request interceptor error handling', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the request error interceptor function from the mock instance
    const requestErrorInterceptor = mockAxiosInstance._requestErrorInterceptor

    const error = new Error('Request error')

    await expect(requestErrorInterceptor(error)).rejects.toThrow('Request error')
  })

  it('should test response interceptor with success', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test successful response
    const response = {
      data: {
        code: 200,
        msg: 'success',
        data: {}
      },
      request: {
        responseType: ''
      }
    }

    const result = await responseInterceptor(response)

    expect(result).toEqual({ code: 200, msg: 'success', data: {} })
  })

  it('should test response interceptor with blob data', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test blob response
    const blobData = new Blob()
    const response = {
      data: blobData,
      request: {
        responseType: 'blob'
      }
    }

    const result = await responseInterceptor(response)

    expect(result).toBe(blobData)
  })

  it('should test response interceptor with arraybuffer data', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test arraybuffer response
    const arrayBufferData = new ArrayBuffer(8)
    const response = {
      data: arrayBufferData,
      request: {
        responseType: 'arraybuffer'
      }
    }

    const result = await responseInterceptor(response)

    expect(result).toBe(arrayBufferData)
  })

  it('should test response interceptor with 401 error', async () => {
    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test 401 error response
    const response = {
      data: {
        code: 401,
        message: 'Unauthorized'
      },
      request: {
        responseType: ''
      }
    }

    await expect(responseInterceptor(response)).rejects.toThrow('Unauthorized')
  })

  it('should test response interceptor with 500 error', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test 500 error response
    const response = {
      data: {
        code: 500,
        message: 'Server error'
      },
      request: {
        responseType: ''
      }
    }

    await expect(responseInterceptor(response)).rejects.toThrow('Server error')
    expect(consoleError).toHaveBeenCalledWith('系统错误:', 'Server error')

    consoleError.mockRestore()
  })

  it('should test response interceptor with 601 warning', async () => {
    // Mock console.warn
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test 601 warning response
    const response = {
      data: {
        code: 601,
        message: 'Warning'
      },
      request: {
        responseType: ''
      }
    }

    await expect(responseInterceptor(response)).rejects.toThrow('Warning')
    expect(consoleWarn).toHaveBeenCalledWith('警告:', 'Warning')

    consoleWarn.mockRestore()
  })

  it('should test response interceptor with other error', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response interceptor function from the mock instance
    const responseInterceptor = mockAxiosInstance._responseInterceptor

    // Test other error response
    const response = {
      data: {
        code: 400,
        message: 'Bad request'
      },
      request: {
        responseType: ''
      }
    }

    await expect(responseInterceptor(response)).rejects.toThrow('Bad request')
    expect(consoleError).toHaveBeenCalledWith('接口错误:', 'Bad request')

    consoleError.mockRestore()
  })

  it('should test response interceptor error handling with network error', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response error interceptor function from the mock instance
    const responseErrorInterceptor = mockAxiosInstance._responseErrorInterceptor

    // Test network error
    const error = new Error('Network Error')

    await expect(responseErrorInterceptor(error)).rejects.toThrow('Network Error')
    expect(consoleError).toHaveBeenCalledWith('网络请求失败:', 'Network Error')
    expect(consoleError).toHaveBeenCalledWith('后端接口连接异常')

    consoleError.mockRestore()
  })

  it('should test response interceptor error handling with timeout', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response error interceptor function from the mock instance
    const responseErrorInterceptor = mockAxiosInstance._responseErrorInterceptor

    // Test timeout error
    const error = new Error('timeout of 10000ms exceeded')

    await expect(responseErrorInterceptor(error)).rejects.toThrow('timeout of 10000ms exceeded')
    expect(consoleError).toHaveBeenCalledWith('网络请求失败:', 'timeout of 10000ms exceeded')
    expect(consoleError).toHaveBeenCalledWith('系统接口请求超时')

    consoleError.mockRestore()
  })

  it('should test response interceptor error handling with status code error', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response error interceptor function from the mock instance
    const responseErrorInterceptor = mockAxiosInstance._responseErrorInterceptor

    // Test status code error
    const error = new Error('Request failed with status code 404')

    await expect(responseErrorInterceptor(error)).rejects.toThrow('Request failed with status code 404')
    expect(consoleError).toHaveBeenCalledWith('网络请求失败:', 'Request failed with status code 404')
    expect(consoleError).toHaveBeenCalledWith('系统接口404异常')

    consoleError.mockRestore()
  })

  it('should test response interceptor error handling with generic error', async () => {
    // Mock console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Import the actual axiosConfig to trigger the interceptor setup
    await import('./axiosConfig')

    // Get the response error interceptor function from the mock instance
    const responseErrorInterceptor = mockAxiosInstance._responseErrorInterceptor

    // Test generic error
    const error = new Error('Generic error')

    await expect(responseErrorInterceptor(error)).rejects.toThrow('Generic error')
    expect(consoleError).toHaveBeenCalledWith('网络请求失败:', 'Generic error')
    expect(consoleError).toHaveBeenCalledWith('网络请求失败')

    consoleError.mockRestore()
  })
})
