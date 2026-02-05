import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../services/axiosConfig'
import { getProductInfoConfig, ProductData, ApiResponse, getLLMProductBasicInfoByPublishStatus, getDeviceProductBasicInfoByPublishStatus, getLLMApplicationScenariosByPublishStatus, getDeviceApplicationScenariosByPublishStatus, getLLMTypicalCaseProductsByPublishStatus, getDeviceTypicalCaseProductsByPublishStatus } from './index'

vi.mock('../../services/axiosConfig', () => ({
  default: {
    get: vi.fn()
  }
}))

const mockAxios = axiosInstance as any

describe('product API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProductInfoConfig', () => {
    it('should call display endpoint when not in preview mode', async () => {
      const mockResponse: ApiResponse<ProductData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '1'
        }
      }

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getProductInfoConfig(false)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/productConfig/display')
      expect(result).toEqual(mockResponse)
    })

    it('should call preview endpoint when in preview mode and type is product', async () => {
      const mockResponse: ApiResponse<ProductData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '0'
        }
      }

      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?type=product'
        },
        writable: true
      })

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getProductInfoConfig(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/productConfig/preview')
      expect(result).toEqual(mockResponse)
    })

    it('should call display endpoint when in preview mode but type is not product', async () => {
      const mockResponse: ApiResponse<ProductData> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '1'
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

      const result = await getProductInfoConfig(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/productConfig/display')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('API Error')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(getProductInfoConfig(false)).rejects.toThrow('API Error')
    })
  })

  describe('helper functions', () => {
    it('getLLMProductBasicInfoByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxLLMProductBasicInfoTemp: {
          createBy: 'test',
          createTime: null,
          updateBy: 'test',
          updateTime: null,
          savedBy: 'test',
          savedTime: '2023-01-01',
          publishedBy: '',
          publishedTime: null,
          remark: '',
          id: 1,
          productType: '1',
          productName: 'LLM Product',
          productIntroduction: 'Introduction',
          backgroundImageUrl: 'http://test.com/image.png',
          detailedIntroduction: 'Detailed Introduction'
        }
      }

      const result = getLLMProductBasicInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMProductBasicInfoTemp)
    })

    it('getLLMProductBasicInfoByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxLLMProductBasicInfo: {
          createBy: 'test',
          createTime: null,
          updateBy: 'test',
          updateTime: null,
          savedBy: 'test',
          savedTime: '2023-01-01',
          publishedBy: 'test',
          publishedTime: '2023-01-01',
          remark: '',
          id: 1,
          productType: '1',
          productName: 'LLM Product',
          productIntroduction: 'Introduction',
          backgroundImageUrl: 'http://test.com/image.png',
          detailedIntroduction: 'Detailed Introduction'
        }
      }

      const result = getLLMProductBasicInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMProductBasicInfo)
    })

    it('getDeviceProductBasicInfoByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxDeviceProductBasicInfoTemp: {
          createBy: 'test',
          createTime: null,
          updateBy: 'test',
          updateTime: null,
          savedBy: 'test',
          savedTime: '2023-01-01',
          publishedBy: '',
          publishedTime: null,
          remark: '',
          id: 1,
          productType: '2',
          productName: 'Device Product',
          productIntroduction: 'Introduction',
          backgroundImageUrl: 'http://test.com/image.png',
          detailedIntroduction: 'Detailed Introduction'
        }
      }

      const result = getDeviceProductBasicInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceProductBasicInfoTemp)
    })

    it('getDeviceProductBasicInfoByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxDeviceProductBasicInfo: {
          createBy: 'test',
          createTime: null,
          updateBy: 'test',
          updateTime: null,
          savedBy: 'test',
          savedTime: '2023-01-01',
          publishedBy: 'test',
          publishedTime: '2023-01-01',
          remark: '',
          id: 1,
          productType: '2',
          productName: 'Device Product',
          productIntroduction: 'Introduction',
          backgroundImageUrl: 'http://test.com/image.png',
          detailedIntroduction: 'Detailed Introduction'
        }
      }

      const result = getDeviceProductBasicInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceProductBasicInfo)
    })

    it('getLLMApplicationScenariosByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxLLMApplicationScenariosTemp: []
      }

      const result = getLLMApplicationScenariosByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMApplicationScenariosTemp)
    })

    it('getLLMApplicationScenariosByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxLLMApplicationScenarios: []
      }

      const result = getLLMApplicationScenariosByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMApplicationScenarios)
    })

    it('getDeviceApplicationScenariosByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxDeviceApplicationScenariosTemp: []
      }

      const result = getDeviceApplicationScenariosByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceApplicationScenariosTemp)
    })

    it('getDeviceApplicationScenariosByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxDeviceApplicationScenarios: []
      }

      const result = getDeviceApplicationScenariosByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceApplicationScenarios)
    })

    it('getLLMTypicalCaseProductsByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxLLMTypicalCaseProductsTemp: []
      }

      const result = getLLMTypicalCaseProductsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMTypicalCaseProductsTemp)
    })

    it('getLLMTypicalCaseProductsByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxLLMTypicalCaseProducts: []
      }

      const result = getLLMTypicalCaseProductsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxLLMTypicalCaseProducts)
    })

    it('getDeviceTypicalCaseProductsByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: ProductData = {
        isPublish: '0',
        txwxDeviceTypicalCaseProductsTemp: []
      }

      const result = getDeviceTypicalCaseProductsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceTypicalCaseProductsTemp)
    })

    it('getDeviceTypicalCaseProductsByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: ProductData = {
        isPublish: '1',
        txwxDeviceTypicalCaseProducts: []
      }

      const result = getDeviceTypicalCaseProductsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxDeviceTypicalCaseProducts)
    })
  })
})
