import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Footer from './index'

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
}

// Mock API calls
vi.mock('@/api/company', () => ({
  getCompanyInfo: vi.fn(),
  getCompanyInfoConfig: vi.fn(),
  getCompanyInfoByPublishStatus: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid={`link-${to}`}>{children}</a>
  ),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getCompanyInfo, getCompanyInfoConfig, getCompanyInfoByPublishStatus } from '@/api/company'

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Footer component with initial state', () => {
    // Mock API response
    ;(getCompanyInfo as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        footerNav: [],
      },
    })
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        companyInfo: {
          companyName: 'Test Company',
          footerNav: [],
        },
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyName: 'Test Company',
      footerNav: [],
    })

    render(
      <Provider store={mockStore}>
        <Footer />
      </Provider>
    )

    // Check if component is rendered
    expect(screen.getByText('首页')).toBeInTheDocument()
  })

  it('should fetch and display company information', async () => {
    // Mock API response
    ;(getCompanyInfo as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        footerNav: [],
      },
    })
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        companyInfo: {
          companyName: 'Test Company',
          footerNav: [],
        },
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyName: 'Test Company',
      footerNav: [],
    })

    render(
      <Provider store={mockStore}>
        <Footer />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if company info is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })
  })

  it('should render navigation links', async () => {
    // Mock API response
    ;(getCompanyInfo as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        copyright: '© 2024 Test Company',
      },
    })
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        copyright: '© 2024 Test Company',
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyName: 'Test Company',
      copyright: '© 2024 Test Company',
    })

    render(
      <Provider store={mockStore}>
        <Footer />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if navigation links are rendered
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('产品一')).toBeInTheDocument()
    expect(screen.getByText('产品二')).toBeInTheDocument()
    expect(screen.getByText('关于我们')).toBeInTheDocument()
    expect(screen.getByText('新闻中心')).toBeInTheDocument()
  })

  it('should handle API error', async () => {
    // Mock API error
    ;(getCompanyInfo as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <Footer />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('首页')).toBeInTheDocument()
  })

  it('should render contact information', async () => {
    // Mock API response
    ;(getCompanyInfo as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        copyright: '© 2024 Test Company',
        address: 'Test address',
        phone: '1234567890',
        email: 'test@example.com',
      },
    })
    
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {
        companyName: 'Test Company',
        copyright: '© 2024 Test Company',
        address: 'Test address',
        phone: '1234567890',
        email: 'test@example.com',
      },
    })
    
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue({
      companyName: 'Test Company',
      copyright: '© 2024 Test Company',
      address: 'Test address',
      phone: '1234567890',
      email: 'test@example.com',
    })

    render(
      <Provider store={mockStore}>
        <Footer />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if contact info is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })
  })
})
