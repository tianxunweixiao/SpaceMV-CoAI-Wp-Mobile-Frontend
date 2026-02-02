import { createBrowserRouter, RouteObject } from 'react-router-dom'
import App from '@/App'

// 创建基础路由配置函数，用于共享正常模式和预览模式的路由
function createBaseRoutes(): RouteObject[] {
  return [
    {
      index: true,
      lazy: async () => {
        const data = await import('@/pages/home')
        return { element: <data.default /> }
      }
    },
    {
      path: 'news',
      lazy: async () => {
        const data = await import('@/pages/news-center')
        return { element: <data.default /> }
      }
    },
    {
      path: 'about',
      lazy: async () => {
        const data = await import('@/pages/about-us')
        return { element: <data.default /> }
      }
    },
    {
      path: 'device',
      lazy: async () => {
        const data = await import('@/pages/small-device')
        return { element: <data.default /> }
      }
    },
    {
      path: 'model',
      lazy: async () => {
        const data = await import('@/pages/large-model')
        return { element: <data.default /> }
      }
    }
  ]
}

// 创建路由配置
const routers = createBrowserRouter([
  // 正常模式路由
  {
    path: '/',
    element: <App />,
    children: createBaseRoutes()
  },
  // 预览模式路由（带/preview前缀）
  {
    path: '/preview',
    element: <App />,
    children: createBaseRoutes()
  }
], { basename: '/' })

// 预览模式检测函数
export function isPreviewMode(): boolean {
  return typeof window !== 'undefined' && 
         (window.location.pathname.startsWith('/preview/') || window.location.pathname === '/preview')
}

// 获取当前查询参数字符串
export function getCurrentQueryParams(): string {
  if (typeof window === 'undefined') return ''
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.toString() ? `?${searchParams.toString()}` : ''
}

// 构建带查询参数的完整路径
export function buildPathWithParams(path: string): string {
  const queryParams = getCurrentQueryParams()
  return `${path}${queryParams}`
}

export default routers
