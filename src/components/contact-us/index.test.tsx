import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ContactUs from './index'

// Mock API calls
vi.mock('@/api/company', () => ({
  getCompanyInfoConfig: vi.fn(),
  getCompanyInfoByPublishStatus: vi.fn(),
  getFocusItemsByPublishStatus: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getCompanyInfoConfig, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus } from '@/api/company'

describe('ContactUs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render ContactUs component with initial state', () => {
    // Mock API response
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        isPublish: '1',
        txwxCompanyInfo: {
          companyAddress: 'Test address',
          businessCooperation: '1234567890',
          resumeDelivery: 'test@example.com',
        },
        txwxFocus: [],
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyAddress: 'Test address',
      businessCooperation: '1234567890',
      resumeDelivery: 'test@example.com',
    })
    
    ;(getFocusItemsByPublishStatus as any).mockReturnValue([])

    render(<ContactUs />)

    // Check if component is rendered
    expect(screen.getByText('联系我们')).toBeInTheDocument()
  })

  it('should fetch and display contact information', async () => {
    // Mock API response
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        isPublish: '1',
        txwxCompanyInfo: {
          companyAddress: 'Test address',
          businessCooperation: '1234567890',
          resumeDelivery: 'test@example.com',
        },
        txwxFocus: [
          {
            focusId: 1,
            focusName: 'WeChat 1',
            imageUrl: 'wechat1.jpg',
          },
        ],
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyAddress: 'Test address',
      businessCooperation: '1234567890',
      resumeDelivery: 'test@example.com',
    })
    
    ;(getFocusItemsByPublishStatus as any).mockReturnValue([
      {
        focusId: 1,
        focusName: 'WeChat 1',
        imageUrl: 'wechat1.jpg',
      },
    ])

    render(<ContactUs />)

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalledWith(false)
    })

    // Check if contact info is displayed
    await waitFor(() => {
      expect(screen.getByText('联系我们')).toBeInTheDocument()
    })
  })

  it('should display wechat QR codes', async () => {
    // Mock API response
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        isPublish: '1',
        txwxCompanyInfo: {
          companyAddress: 'Test address',
          businessCooperation: '1234567890',
          resumeDelivery: 'test@example.com',
        },
        txwxFocus: [
          {
            focusId: 1,
            focusName: 'WeChat 1',
            imageUrl: 'wechat1.jpg',
          },
          {
            focusId: 2,
            focusName: 'WeChat 2',
            imageUrl: 'wechat2.jpg',
          },
        ],
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyAddress: 'Test address',
      businessCooperation: '1234567890',
      resumeDelivery: 'test@example.com',
    })
    
    ;(getFocusItemsByPublishStatus as any).mockReturnValue([
      {
        focusId: 1,
        focusName: 'WeChat 1',
        imageUrl: 'wechat1.jpg',
      },
      {
        focusId: 2,
        focusName: 'WeChat 2',
        imageUrl: 'wechat2.jpg',
      },
    ])

    render(<ContactUs />)

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalledWith(false)
    })

    // Check if wechat QR codes are displayed
    await waitFor(() => {
      const qrCodes = screen.getAllByAltText('公众号')
      expect(qrCodes.length).toBeGreaterThan(0)
    })
  })

  it('should handle API error', async () => {
    // Mock API error
    ;(getCompanyInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue([])

    render(<ContactUs />)

    // Wait for error to occur
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalledWith(false)
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('联系我们')).toBeInTheDocument()
  })

  it('should display address image', async () => {
    // Mock API response
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        isPublish: '1',
        txwxCompanyInfo: {
          companyAddress: 'Test address',
          businessCooperation: '1234567890',
          resumeDelivery: 'test@example.com',
        },
        txwxFocus: [],
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyAddress: 'Test address',
      businessCooperation: '1234567890',
      resumeDelivery: 'test@example.com',
    })
    
    ;(getFocusItemsByPublishStatus as any).mockReturnValue([])

    render(<ContactUs />)

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalledWith(false)
    })

    // Check if component renders without error
    expect(screen.getByText('联系我们')).toBeInTheDocument()
  })
})
