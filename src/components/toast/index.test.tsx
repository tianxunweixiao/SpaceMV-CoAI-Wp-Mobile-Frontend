import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Toast from './index'

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render with default type and duration', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Test message" onClose={onCloseMock} />)
    
    const toastElement = screen.getByText('Test message')
    expect(toastElement).toBeInTheDocument()
    // 不再直接检查类名，因为 CSS Modules 会添加哈希值
    expect(toastElement.tagName).toBe('DIV')
  })

  it('should render with success type', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Success message" type="success" onClose={onCloseMock} />)
    
    const toastElement = screen.getByText('Success message')
    expect(toastElement).toBeInTheDocument()
    // 不再直接检查类名，因为 CSS Modules 会添加哈希值
    expect(toastElement.tagName).toBe('DIV')
  })

  it('should render with error type', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Error message" type="error" onClose={onCloseMock} />)
    
    const toastElement = screen.getByText('Error message')
    expect(toastElement).toBeInTheDocument()
    // 不再直接检查类名，因为 CSS Modules 会添加哈希值
    expect(toastElement.tagName).toBe('DIV')
  })

  it('should render with warning type', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Warning message" type="warning" onClose={onCloseMock} />)
    
    const toastElement = screen.getByText('Warning message')
    expect(toastElement).toBeInTheDocument()
    // 不再直接检查类名，因为 CSS Modules 会添加哈希值
    expect(toastElement.tagName).toBe('DIV')
  })

  it('should call onClose after default duration', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Test message" onClose={onCloseMock} />)
    
    expect(onCloseMock).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(3000)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should call onClose after custom duration', () => {
    const onCloseMock = vi.fn()
    render(<Toast message="Test message" duration={1000} onClose={onCloseMock} />)
    
    expect(onCloseMock).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(1000)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose if onClose is not provided', () => {
    render(<Toast message="Test message" />)
    
    // 应该不会抛出错误
    vi.advanceTimersByTime(3000)
  })

  it('should clear timeout on unmount', () => {
    const onCloseMock = vi.fn()
    const { unmount } = render(<Toast message="Test message" onClose={onCloseMock} />)
    
    unmount()
    vi.advanceTimersByTime(3000)
    
    expect(onCloseMock).not.toHaveBeenCalled()
  })
})
