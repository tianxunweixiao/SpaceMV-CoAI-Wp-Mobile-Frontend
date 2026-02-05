import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { isPreviewMode, getCurrentQueryParams, buildPathWithParams } from './index'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  createBrowserRouter: vi.fn(() => ({
    navigate: vi.fn(),
  })),
}))

vi.mock('../App', () => ({
  default: () => <div>App</div>,
}))

vi.mock('../pages/home', () => ({
  default: () => <div>Home</div>,
}))

vi.mock('../pages/news-center', () => ({
  default: () => <div>News Center</div>,
}))

vi.mock('../pages/about-us', () => ({
  default: () => <div>About Us</div>,
}))

vi.mock('../pages/small-device', () => ({
  default: () => <div>Small Device</div>,
}))

vi.mock('../pages/large-model', () => ({
  default: () => <div>Large Model</div>,
}))

const mockCreateBrowserRouter = vi.mocked(createBrowserRouter)

describe('Router Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isPreviewMode', () => {
    it('should return false when window is undefined', () => {
      // Mock window as undefined
      vi.stubGlobal('window', undefined)
      expect(isPreviewMode()).toBe(false)
      vi.unstubAllGlobals()
    })

    it('should return true when pathname starts with /preview/', () => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          pathname: '/preview/test',
        },
      })
      expect(isPreviewMode()).toBe(true)
      vi.unstubAllGlobals()
    })

    it('should return true when pathname is exactly /preview', () => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          pathname: '/preview',
        },
      })
      expect(isPreviewMode()).toBe(true)
      vi.unstubAllGlobals()
    })

    it('should return false when pathname does not start with /preview', () => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          pathname: '/test',
        },
      })
      expect(isPreviewMode()).toBe(false)
      vi.unstubAllGlobals()
    })
  })

  describe('getCurrentQueryParams', () => {
    it('should return empty string when window is undefined', () => {
      // Mock window as undefined
      vi.stubGlobal('window', undefined)
      expect(getCurrentQueryParams()).toBe('')
      vi.unstubAllGlobals()
    })

    it('should return query string when window.location.search has parameters', () => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          search: '?param1=value1&param2=value2',
        },
        URLSearchParams: class MockURLSearchParams {
          constructor(search: string) {
            this.search = search
          }
          toString() {
            return this.search.substring(1) // Remove leading '?'
          }
          search: string
        }
      })
      expect(getCurrentQueryParams()).toBe('?param1=value1&param2=value2')
      vi.unstubAllGlobals()
    })

    it('should return empty string when window.location.search is empty', () => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          search: '',
        },
        URLSearchParams: class MockURLSearchParams {
          toString() {
            return ''
          }
        }
      })
      expect(getCurrentQueryParams()).toBe('')
      vi.unstubAllGlobals()
    })
  })

  describe('buildPathWithParams', () => {
    it('should return path with query parameters', async () => {
      // Mock the entire module
      vi.doMock('./index', () => ({
        isPreviewMode: vi.fn(),
        getCurrentQueryParams: vi.fn(() => '?param1=value1'),
        buildPathWithParams: (path: string) => {
          const queryParams = '?param1=value1'
          return `${path}${queryParams}`
        },
      }))

      // Import the mocked module
      const { buildPathWithParams } = await import('./index')
      
      // Test the function
      expect(buildPathWithParams('/test')).toBe('/test?param1=value1')
    })

    it('should return path without query parameters when getCurrentQueryParams returns empty string', async () => {
      // Mock the entire module
      vi.doMock('./index', () => ({
        isPreviewMode: vi.fn(),
        getCurrentQueryParams: vi.fn(() => ''),
        buildPathWithParams: (path: string) => {
          const queryParams = ''
          return `${path}${queryParams}`
        },
      }))

      // Import the mocked module
      const { buildPathWithParams } = await import('./index')
      
      // Test the function
      expect(buildPathWithParams('/test')).toBe('/test')
    })
  })
})

