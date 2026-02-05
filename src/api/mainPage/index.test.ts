import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../services/axiosConfig'
import { getMainPageContent, MainPageData, ApiResponse } from './index'

vi.mock('../../services/axiosConfig', () => ({
  default: {
    get: vi.fn()
  }
}))

const mockAxios = axiosInstance as any

describe('mainPage API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMainPageContent', () => {
    it('should call display endpoint when not in preview mode', async () => {
      const mockResponse: ApiResponse<MainPageData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '1',
          carouselImageLists: [],
          mainProducts: [],
          typicalCustomer: { imageUrl: '' },
          carouselImageListsTemp: [],
          mainProductsTemp: [],
          typicalCustomerTemp: { imageUrl: '' }
        }
      }

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getMainPageContent(false)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/homepageConfig/display')
      expect(result).toEqual(mockResponse)
    })

    it('should call preview endpoint when in preview mode and type is mainPage', async () => {
      const mockResponse: ApiResponse<MainPageData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '0',
          carouselImageLists: [],
          mainProducts: [],
          typicalCustomer: { imageUrl: '' },
          carouselImageListsTemp: [],
          mainProductsTemp: [],
          typicalCustomerTemp: { imageUrl: '' }
        }
      }

      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?type=mainPage'
        },
        writable: true
      })

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getMainPageContent(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/homepageConfig/preview')
      expect(result).toEqual(mockResponse)
    })

    it('should call display endpoint when in preview mode but type is not mainPage', async () => {
      const mockResponse: ApiResponse<MainPageData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '1',
          carouselImageLists: [],
          mainProducts: [],
          typicalCustomer: { imageUrl: '' },
          carouselImageListsTemp: [],
          mainProductsTemp: [],
          typicalCustomerTemp: { imageUrl: '' }
        }
      }

      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?type=other'
        },
        writable: true
      })

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getMainPageContent(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/homepageConfig/display')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('API Error')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(getMainPageContent(false)).rejects.toThrow('API Error')
    })
  })
})
