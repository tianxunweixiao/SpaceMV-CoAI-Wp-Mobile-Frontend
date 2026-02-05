import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../services/axiosConfig'
import { getCompanyInfoConfig, CompanyInfoConfig, ApiResponse, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus, getProductCertsByPublishStatus, getCompanyProfileByPublishStatus } from './index'

vi.mock('../../services/axiosConfig', () => ({
  default: {
    get: vi.fn()
  }
}))

const mockAxios = axiosInstance as any

describe('company API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCompanyInfoConfig', () => {
    it('should call display endpoint when not in preview mode', async () => {
      const mockResponse: ApiResponse<CompanyInfoConfig> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '1'
        }
      }

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getCompanyInfoConfig(false)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/companyDetail/display')
      expect(result).toEqual(mockResponse)
    })

    it('should call preview endpoint when in preview mode and type is company', async () => {
      const mockResponse: ApiResponse<CompanyInfoConfig> = {
        code: 200,
        msg: 'success',
        data: {
          isPublish: '0'
        }
      }

      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?type=company'
        },
        writable: true
      })

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await getCompanyInfoConfig(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/companyDetail/preview')
      expect(result).toEqual(mockResponse)
    })

    it('should call display endpoint when in preview mode but type is not company', async () => {
      const mockResponse: ApiResponse<CompanyInfoConfig> = {
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

      const result = await getCompanyInfoConfig(true)

      expect(mockAxios.get).toHaveBeenCalledWith('/crm-website/companyDetail/display')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('API Error')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(getCompanyInfoConfig(false)).rejects.toThrow('API Error')
    })
  })

  describe('helper functions', () => {
    it('getCompanyInfoByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '0',
        txwxCompanyInfoTemp: {
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
          companyName: 'Test Company',
          copyrightInfo: 'Copyright',
          versionNumber: '1.0.0',
          companyAddress: 'Test Address',
          addrUrl: 'http://test.com',
          securityRecord: 'Record',
          icpRecord: 'ICP',
          businessCooperation: 'Cooperation',
          resumeDelivery: 'Resume',
          logoUrl: 'http://test.com/logo.png'
        }
      }

      const result = getCompanyInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxCompanyInfoTemp)
    })

    it('getCompanyInfoByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '1',
        txwxCompanyInfo: {
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
          companyName: 'Test Company',
          copyrightInfo: 'Copyright',
          versionNumber: '1.0.0',
          companyAddress: 'Test Address',
          addrUrl: 'http://test.com',
          securityRecord: 'Record',
          icpRecord: 'ICP',
          businessCooperation: 'Cooperation',
          resumeDelivery: 'Resume',
          logoUrl: 'http://test.com/logo.png'
        }
      }

      const result = getCompanyInfoByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxCompanyInfo)
    })

    it('getFocusItemsByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '0',
        txwxFocusTemp: []
      }

      const result = getFocusItemsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxFocusTemp)
    })

    it('getFocusItemsByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '1',
        txwxFocus: []
      }

      const result = getFocusItemsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxFocus)
    })

    it('getProductCertsByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '0',
        txwxProductCertsTemp: []
      }

      const result = getProductCertsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxProductCertsTemp)
    })

    it('getProductCertsByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '1',
        txwxProductCerts: []
      }

      const result = getProductCertsByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxProductCerts)
    })

    it('getCompanyProfileByPublishStatus should return temp when isPublish is 0', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '0',
        txwxCompanyProfileTemp: {
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
          profileOne: 'Profile 1',
          profileTwo: 'Profile 2',
          profileThree: 'Profile 3'
        }
      }

      const result = getCompanyProfileByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxCompanyProfileTemp)
    })

    it('getCompanyProfileByPublishStatus should return published when isPublish is 1', () => {
      const mockConfig: CompanyInfoConfig = {
        isPublish: '1',
        txwxCompanyProfile: {
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
          profileOne: 'Profile 1',
          profileTwo: 'Profile 2',
          profileThree: 'Profile 3'
        }
      }

      const result = getCompanyProfileByPublishStatus(mockConfig)
      expect(result).toEqual(mockConfig.txwxCompanyProfile)
    })
  })
})
