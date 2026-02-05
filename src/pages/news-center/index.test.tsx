import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NewsCenter from './index'

// Mock components
vi.mock('@/components/iconfont', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/news-center',
  })),
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

// Mock window.location.href
vi.mock('window', () => ({
  location: {
    href: '',
  },
}))


describe('NewsCenter Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render NewsCenter page with initial state', () => {
    render(<NewsCenter />)

    // Check if page elements are rendered
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
  })

  it('should display news list from local constant', () => {
    render(<NewsCenter />)

    // Check if news are displayed (assuming NEWS_MAP has at least one item)
    expect(screen.getByText('新闻一')).toBeInTheDocument()
    expect(screen.getByText('新闻二')).toBeInTheDocument()
    expect(screen.getByText('新闻三')).toBeInTheDocument()
  })

  it('should navigate to news detail page when clicked', () => {
    // Mock window.location.href
    let mockHref = ''
    Object.defineProperty(window, 'location', {
      value: {
        get href() { return mockHref },
        set href(value) { mockHref = value }
      },
      writable: true
    })

    render(<NewsCenter />)

    // Click on news item
    const newsItem = screen.getByText('新闻一')
    fireEvent.click(newsItem)

    // Check if navigation is triggered
    expect(mockHref).not.toBe('')
  })

  it('should render news images', () => {
    render(<NewsCenter />)

    // Check if images are rendered
    const images = screen.getAllByAltText('主要图片')
    expect(images.length).toBeGreaterThan(0)
  })
})
