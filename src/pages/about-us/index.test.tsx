import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import AboutUs from './index'

// Mock store
const mockStore = {
  subscribe: vi.fn(),
  dispatch: vi.fn(),
  getState: vi.fn(() => ({
    menu: {
      selMenuIdx: 0,
      open: false,
    },
  })),
  replaceReducer: vi.fn(),
  [Symbol.observable]: vi.fn(function() {
    const observable = {
      subscribe: vi.fn(),
      [Symbol.observable]: vi.fn(() => observable),
    };
    return observable;
  }),
}

// Mock API calls
vi.mock('@/api/company', () => ({
  getCompanyInfoConfig: vi.fn(),
  getCompanyInfoByPublishStatus: vi.fn(),
  getFocusItemsByPublishStatus: vi.fn(),
  getProductCertsByPublishStatus: vi.fn(),
  getCompanyProfileByPublishStatus: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/about-us',
  })),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getCompanyInfoConfig, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus, getProductCertsByPublishStatus, getCompanyProfileByPublishStatus } from '@/api/company'

describe('AboutUs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render AboutUs page with initial state', () => {
    // Mock API responses
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Check if page elements are rendered
    expect(screen.getByText('公司简介')).toBeInTheDocument()
    expect(screen.getByText('产品认证')).toBeInTheDocument()
  })

  it('should fetch and display company info', async () => {
    // Mock API response
    const mockCompanyInfo = {
      companyProfile: {
        profileTwo: '<p>Test company introduction</p>',
      },
    }
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({ code: 200, data: mockCompanyInfo })
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue({
      profileTwo: '<p>Test company introduction</p>',
    })

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if company info is displayed
    await waitFor(() => {
      expect(document.querySelector('.company-con')).toBeInTheDocument()
    })
  })

  it('should fetch and display certificates', async () => {
    // Mock API response
    const mockCompanyInfo = {
      productCerts: [
        {
          id: 1,
          imageUrl: 'cert1.jpg',
        },
        {
          id: 2,
          imageUrl: 'cert2.jpg',
        },
      ],
    }
    
    const mockProductCerts = [
      {
        id: 1,
        imageUrl: 'cert1.jpg',
      },
      {
        id: 2,
        imageUrl: 'cert2.jpg',
      },
    ]
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({ code: 200, data: mockCompanyInfo })
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(mockProductCerts)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if certificates are displayed
    await waitFor(() => {
      const certificateItems = document.querySelectorAll('.product-item')
      expect(certificateItems.length).toBe(2)
    })
  })

  it('should handle certificate click and open preview', async () => {
    // Mock API response
    const mockCompanyInfo = {
      productCerts: [
        {
          id: 1,
          imageUrl: 'cert1.jpg',
        },
      ],
    }
    
    const mockProductCerts = [
      {
        id: 1,
        imageUrl: 'cert1.jpg',
      },
    ]
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({ code: 200, data: mockCompanyInfo })
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(mockProductCerts)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for certificates to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Click on certificate
    await waitFor(() => {
      const certificateItems = document.querySelectorAll('.product-item')
      expect(certificateItems.length).toBe(1)
      fireEvent.click(certificateItems[0])
    })

    // Check if preview is open
    await waitFor(() => {
      expect(document.querySelector('.image-review')).toBeInTheDocument()
    })
  })

  it('should handle API error for company info', async () => {
    // Mock API error
    ;(getCompanyInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('公司简介')).toBeInTheDocument()
  })

  it('should handle API error for company info config', async () => {
    // Mock API error
    ;(getCompanyInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('公司简介')).toBeInTheDocument()
  })

  it('should handle touch events for certificate preview', async () => {
    // Mock API response
    const mockCompanyInfo = {
      productCerts: [
        {
          id: 1,
          imageUrl: 'cert1.jpg',
        },
        {
          id: 2,
          imageUrl: 'cert2.jpg',
        },
      ],
    }
    
    const mockProductCerts = [
      {
        id: 1,
        imageUrl: 'cert1.jpg',
      },
      {
        id: 2,
        imageUrl: 'cert2.jpg',
      },
    ]
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({ code: 200, data: mockCompanyInfo })
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)
    ;(getProductCertsByPublishStatus as any).mockReturnValue(mockProductCerts)
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <AboutUs />
      </Provider>
    )

    // Wait for certificates to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Open preview
    await waitFor(() => {
      const certificateItems = document.querySelectorAll('.product-item')
      expect(certificateItems.length).toBe(2)
      fireEvent.click(certificateItems[0])
    })

    // Wait for preview to open
    await waitFor(() => {
      expect(document.querySelector('.image-review')).toBeInTheDocument()
    })

    // Simulate touch swipe
    await waitFor(() => {
      const previewImage = document.querySelector('.preview-content img')
      expect(previewImage).toBeInTheDocument()
      if (previewImage) {
        fireEvent.touchStart(previewImage, { touches: [{ clientX: 100, clientY: 100 }] })
        fireEvent.touchMove(previewImage, { touches: [{ clientX: 200, clientY: 100 }] })
        fireEvent.touchEnd(previewImage)
      }
    })

    // Check if preview is still open
    expect(document.querySelector('.image-review')).toBeInTheDocument()
  })
})
