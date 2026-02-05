import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Home from './index'

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
  [Symbol.observable]: vi.fn(() => {
    const observer = {
      subscribe: vi.fn(),
      [Symbol.observable]: vi.fn(() => observer)
    };
    return observer;
  }),


}

// Mock API calls
vi.mock('@/api/company', () => ({
  getCompanyInfoConfig: vi.fn(),
  getCompanyProfileByPublishStatus: vi.fn(),
  getCompanyInfoByPublishStatus: vi.fn(),
  getFocusItemsByPublishStatus: vi.fn(),
}))

vi.mock('@/api/mainPage', () => ({
  getMainPageContent: vi.fn(),
}))

// Mock components
vi.mock('@/components/carousel', () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="carousel">
      {data.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  ),
}))

vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/',
  })),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getCompanyInfoConfig, getCompanyProfileByPublishStatus, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus } from '@/api/company'
import { getMainPageContent } from '@/api/mainPage'
import { useNavigate } from 'react-router-dom'
describe('Home Page', () => {
  const mockNavigate = vi.mocked(useNavigate)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Home page with initial state', () => {
    // Mock API responses
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getMainPageContent as any).mockResolvedValue({
      code: 200,
      data: {
        carouselImageLists: [],
        mainProducts: [],
      },
    })
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <Home />
      </Provider>
    )

    // Check if page structure is rendered
    expect(document.querySelector('#top')).toBeInTheDocument()
  })

  it('should fetch and display home data', async () => {
    // Mock API responses
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getMainPageContent as any).mockResolvedValue({
      code: 200,
      data: {
        carouselImageLists: [
          {
            id: 1,
            imageUrl: 'banner1.jpg',
            isShow: '1',
          },
        ],
        mainProducts: [
          {
            id: 1,
            productName: 'Product 1',
            imageUrl: 'product1.jpg',
            jumpUrl: '/product/1',
          },
        ],
      },
    })
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <Home />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getMainPageContent).toHaveBeenCalled()
    })

    // Check if page structure is rendered
    expect(document.querySelector('#top')).toBeInTheDocument()
  })

  it('should handle API error for company info', async () => {
    // Mock API error
    ;(getCompanyInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getMainPageContent as any).mockResolvedValue({
      code: 200,
      data: {
        carouselImageLists: [],
        mainProducts: [],
      },
    })
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <Home />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getCompanyInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(document.querySelector('#top')).toBeInTheDocument()
  })

  it('should handle API error for main page content', async () => {
    // Mock API error
    ;(getCompanyInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getMainPageContent as any).mockRejectedValue(new Error('API Error'))
    ;(getCompanyProfileByPublishStatus as any).mockReturnValue(null)
    ;(getCompanyInfoByPublishStatus as any).mockReturnValue(null)
    ;(getFocusItemsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <Home />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getMainPageContent).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(document.querySelector('#top')).toBeInTheDocument()
  })
})
