import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'

// Mock components
vi.mock('./pages/home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}))

vi.mock('./components/header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('./components/footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

vi.mock('./store', () => ({
  default: {
    subscribe: vi.fn(),
    dispatch: vi.fn(),
    getState: vi.fn(() => ({})),
  },
}))

import Home from './pages/home'

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render App component with initial structure', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )

    // Check if main structure is rendered
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render correctly with BrowserRouter', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )

    // Check if app renders without errors
    expect(document.body).toBeInTheDocument()
  })
})
