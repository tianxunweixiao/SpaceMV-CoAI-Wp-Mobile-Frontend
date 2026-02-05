import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../services/axiosConfig'
import { getTopButtons, TopButton, ButtonStatus, ButtonType } from './index'

// Mock axios instance
vi.mock('../../services/axiosConfig', () => ({
  default: {
    get: vi.fn()
  }
}))

const mockAxios = axiosInstance as any

describe('topButton API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        search: ''
      },
      writable: true
    })
  })

  it('should call display endpoint when not in preview mode', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: []
    }

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getTopButtons(false)

    expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
    expect(result).toEqual(mockResponse)
  })

  it('should call preview endpoint when in preview mode and type is topButton', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: []
    }

    // Mock window.location.search with type=topButton
    Object.defineProperty(window, 'location', {
      value: {
        search: '?type=topButton'
      },
      writable: true
    })

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getTopButtons(true)

    expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/buttonConfig/preview/001')
    expect(result).toEqual(mockResponse)
  })

  it('should call display endpoint when in preview mode but type is not topButton', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: []
    }

    // Mock window.location.search with different type
    Object.defineProperty(window, 'location', {
      value: {
        search: '?type=other'
      },
      writable: true
    })

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getTopButtons(true)

    expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
    expect(result).toEqual(mockResponse)
  })

  it('should call display endpoint when in preview mode but no type parameter', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: []
    }

    // Mock window.location.search with no type parameter
    Object.defineProperty(window, 'location', {
      value: {
        search: ''
      },
      writable: true
    })

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getTopButtons(true)

    expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    const mockError = new Error('API Error')
    mockAxios.get.mockRejectedValue(mockError)

    await expect(getTopButtons(false)).rejects.toThrow('API Error')
  })

  it('should return correct data structure', async () => {
    const mockButtons: TopButton[] = [
      {
        buttonId: '1',
        buttonType: ButtonType.text,
        buttonText: 'Button 1',
        jumpUrl: 'http://example.com',
        isShow: '1',
        state: ButtonStatus.complete
      },
      {
        buttonId: '2',
        buttonType: ButtonType.image,
        imageUrl: 'http://example.com/image.png',
        jumpUrl: 'http://example.com',
        isShow: '1',
        state: ButtonStatus.developing
      }
    ]

    const mockResponse = {
      code: 200,
      msg: 'success',
      data: mockButtons
    }

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getTopButtons(false)

    expect(result.data).toEqual(mockButtons)
    expect(result.data[0].buttonId).toBe('1')
    expect(result.data[0].buttonType).toBe(ButtonType.text)
    expect(result.data[1].buttonType).toBe(ButtonType.image)
  })

  it('should handle window being undefined (SSR scenario)', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: []
    }

    // Mock window as undefined to simulate SSR
    const originalWindow = global.window
    delete (global as any).window

    try {
      mockAxios.get.mockResolvedValue(mockResponse)
      const result = await getTopButtons(true)
      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
      expect(result).toEqual(mockResponse)
    } finally {
      // Restore window
      (global as any).window = originalWindow
    }
  })
})
