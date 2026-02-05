import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import SmallDevice from './index'

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
vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  getProductDetail: vi.fn(),
  getProductInfoConfig: vi.fn(),
  getDeviceProductBasicInfoByPublishStatus: vi.fn(),
  getDeviceApplicationScenariosByPublishStatus: vi.fn(),
  getDeviceTypicalCaseProductsByPublishStatus: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/small-device',
  })),
  useParams: vi.fn(() => ({
    id: undefined,
  })),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getProductInfoConfig, getDeviceProductBasicInfoByPublishStatus, getDeviceApplicationScenariosByPublishStatus, getDeviceTypicalCaseProductsByPublishStatus } from '@/api/product'
import { useNavigate } from 'react-router-dom'

describe('SmallDevice Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render SmallDevice page with initial state', () => {
    // Mock API response
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getDeviceProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <SmallDevice />
      </Provider>
    )

    // Check if page structure is rendered
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should fetch and display small device products', async () => {
    // Mock API response
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getDeviceProductBasicInfoByPublishStatus as any).mockReturnValue({
      productName: '小设备产品',
      productIntroduction: '小设备产品介绍',
      backgroundImageUrl: 'test.jpg',
    })
    ;(getDeviceApplicationScenariosByPublishStatus as any).mockReturnValue([
      {
        scenarioName: '应用场景1',
        detailedIntroduction: '场景1详细介绍',
        backgroundImageUrl: 'test.jpg',
      },
    ])
    ;(getDeviceTypicalCaseProductsByPublishStatus as any).mockReturnValue([
      {
        productName: '典型产品1',
        productIntroduction: '产品1介绍',
        detailedIntroduction: '产品1详细介绍',
        standardFunctions: ['功能1', '功能2'],
        imageUrl: 'test.jpg',
      },
    ])

    render(
      <Provider store={mockStore}>
        <SmallDevice />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if products are displayed
    await waitFor(() => {
      expect(screen.getByText('小设备产品')).toBeInTheDocument()
      expect(screen.getByText('小设备产品介绍')).toBeInTheDocument()
      expect(screen.getByText('应用场景1')).toBeInTheDocument()
      expect(screen.getByText('产品1介绍')).toBeInTheDocument()
    })
  })

  it('should handle API error', async () => {
    // Mock API error
    ;(getProductInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getDeviceProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <SmallDevice />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should display empty state when no products', async () => {
    // Mock API response with empty data
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getDeviceProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getDeviceTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <SmallDevice />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if empty state is displayed
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })
})
