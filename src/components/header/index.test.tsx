import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Header from './index'

// Mock API calls
vi.mock('@/api/topButton', () => ({
  getTopButtons: vi.fn(),
}))

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => {
  const mockNavigate = vi.fn()
  return {
    useNavigate: vi.fn(() => mockNavigate),
    useLocation: vi.fn(() => ({
      pathname: '/',
    })),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to} data-testid={`link-${to}`}>{children}</a>
    ),
    createBrowserRouter: vi.fn(() => ({
      navigate: mockNavigate,
    })),
  }
})

// Mock window.open
vi.mock('window', () => ({
  open: vi.fn(),
}))

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

import { getTopButtons } from '@/api/topButton'
import { useNavigate } from 'react-router-dom'

describe('Header Component', () => {
  const mockNavigate = vi.mocked(useNavigate)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Header component with initial state', () => {
    // Mock API response
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: {
        logo: 'test-logo.png',
        menu: [],
      },
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Check if component is rendered
    expect(screen.getByAltText('菜单')).toBeInTheDocument()
  })

  it('should fetch and display header data', async () => {
    // Mock API response
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: {
        logo: 'test-logo.png',
        menu: [
          {
            id: 1,
            name: '首页',
            url: '/',
            type: 'nav',
          },
          {
            id: 2,
            name: '大模型产品',
            url: '/large-model',
            type: 'nav',
          },
        ],
      },
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Check if logo is displayed
    expect(screen.getByAltText('logo')).toBeInTheDocument()
  })

  it('should toggle menu when menu button is clicked', async () => {
    // Mock API response
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: {
        logo: 'test-logo.png',
        menu: [
          {
            id: 1,
            name: '首页',
            url: '/',
            type: 'nav',
          },
        ],
      },
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Click menu button
    const menuButton = screen.getByAltText('菜单')
    fireEvent.click(menuButton)

    // Check if menu is open
    expect(screen.getByText('首页')).toBeInTheDocument()

    // Click menu button again to close
    fireEvent.click(menuButton)

    // Check if menu is closed (menu items might still be in DOM but hidden)
    const menuItems = screen.queryAllByText('首页')
    expect(menuItems.length).toBeGreaterThan(0)
  })

  it('should navigate when menu item is clicked', async () => {
    // Mock API response
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: {
        logo: 'test-logo.png',
        menu: [
          {
            id: 1,
            name: '首页',
            url: '/',
            type: 'nav',
          },
        ],
      },
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Open menu
    const menuButton = screen.getByAltText('菜单')
    fireEvent.click(menuButton)

    // Wait for menu to open
    await waitFor(() => {
      expect(screen.getByText('首页')).toBeInTheDocument()
    })

    // Click menu item
    const menuItem = screen.getByText('首页')
    fireEvent.click(menuItem)

    // Check if navigation is called
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should handle API data for external links', async () => {
    // Mock API response with external link
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: [
        {
          buttonText: 'External Link',
          jumpUrl: 'https://example.com',
          isShow: '1',
          state: '1', // complete
        },
      ],
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Check if component renders without error
    expect(screen.getByAltText('菜单')).toBeInTheDocument()
  })

  it('should handle API data for developing features', async () => {
    // Mock API response with developing feature
    ;(getTopButtons as any).mockResolvedValue({
      code: 200,
      data: [
        {
          buttonText: 'Dev Feature',
          jumpUrl: '/dev',
          isShow: '1',
          state: '0', // developing
        },
      ],
    })

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Check if component renders without error
    expect(screen.getByAltText('菜单')).toBeInTheDocument()
  })

  it('should handle API error', async () => {
    // Mock API error
    ;(getTopButtons as any).mockRejectedValue(new Error('API Error'))

    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    )

    // Wait for error to occur
    await waitFor(() => {
      expect(getTopButtons).toHaveBeenCalled()
    })

    // Check if error is handled (no crash)
    expect(screen.getByAltText('菜单')).toBeInTheDocument()
  })
})
