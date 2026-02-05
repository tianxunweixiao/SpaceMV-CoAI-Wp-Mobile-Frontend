import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import IconFont from './index'

describe('IconFont Component', () => {
  it('should render IconFont component with type prop', () => {
    render(<IconFont type="test-icon" />)

    // Check if component is rendered
    const icon = screen.getByRole('img')
    expect(icon).toBeInTheDocument()
  })

  it('should render IconFont component with additional props', () => {
    render(<IconFont type="test-icon" className="custom-class" style={{ color: 'red' }} />)

    // Check if component is rendered with className
    const icon = screen.getByRole('img')
    expect(icon.className).toContain('custom-class')
    expect(icon.style.color).toBe('red')
  })

  it('should render IconFont component with default props', () => {
    render(<IconFont type="test-icon" />)

    // Check if component is rendered without errors
    const icon = screen.getByRole('img')
    expect(icon).toBeInTheDocument()
  })
})
