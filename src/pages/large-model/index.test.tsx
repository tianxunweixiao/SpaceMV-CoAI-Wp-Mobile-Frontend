import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import LargeModel from './index'

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
  getLLMProductBasicInfoByPublishStatus: vi.fn(),
  getLLMApplicationScenariosByPublishStatus: vi.fn(),
  getLLMTypicalCaseProductsByPublishStatus: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/large-model',
  })),
  useParams: vi.fn(() => ({
    id: undefined,
  })),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

import { getProductInfoConfig, getLLMProductBasicInfoByPublishStatus, getLLMApplicationScenariosByPublishStatus, getLLMTypicalCaseProductsByPublishStatus } from '@/api/product'
import { useNavigate } from 'react-router-dom'

describe('LargeModel Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render LargeModel page with initial state', () => {
    // Mock API response
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getLLMProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getLLMApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getLLMTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <LargeModel />
      </Provider>
    )

    // Check if page structure is rendered
    expect(screen.getByText('典型案例')).toBeInTheDocument()
  })

  it('should fetch and display large model products', async () => {
    // Mock API response
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getLLMProductBasicInfoByPublishStatus as any).mockReturnValue({
      productName: '大模型产品',
      productIntroduction: '大模型产品介绍',
      backgroundImageUrl: 'test.jpg',
    })
    ;(getLLMApplicationScenariosByPublishStatus as any).mockReturnValue([
      {
        scenarioName: '应用场景1',
        scenarioIntroduction: '场景1介绍',
        backgroundImageUrl: 'test.jpg',
      },
    ])
    ;(getLLMTypicalCaseProductsByPublishStatus as any).mockReturnValue([
      {
        productName: '典型案例1',
        imageUrl: 'test.jpg',
        standardFunctions: ['功能1', '功能2'],
      },
    ])

    render(
      <Provider store={mockStore}>
        <LargeModel />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if products are displayed
    await waitFor(() => {
      expect(screen.getByText('大模型产品')).toBeInTheDocument()
      expect(screen.getByText('大模型产品介绍')).toBeInTheDocument()
      expect(screen.getByText('应用场景1')).toBeInTheDocument()
      expect(screen.getByText('典型案例')).toBeInTheDocument()
    })
  })

  it('should handle API error', async () => {
    // Mock API error
    ;(getProductInfoConfig as any).mockRejectedValue(new Error('API Error'))
    ;(getLLMProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getLLMApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getLLMTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <LargeModel />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByText('典型案例')).toBeInTheDocument()
  })

  it('should display empty state when no products', async () => {
    // Mock API response with empty data
    ;(getProductInfoConfig as any).mockResolvedValue({
      code: 200,
      data: {},
    })
    ;(getLLMProductBasicInfoByPublishStatus as any).mockReturnValue(null)
    ;(getLLMApplicationScenariosByPublishStatus as any).mockReturnValue(null)
    ;(getLLMTypicalCaseProductsByPublishStatus as any).mockReturnValue(null)

    render(
      <Provider store={mockStore}>
        <LargeModel />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getProductInfoConfig).toHaveBeenCalled()
    })

    // Check if empty state is displayed
    expect(screen.getByText('典型案例')).toBeInTheDocument()
  })
})
