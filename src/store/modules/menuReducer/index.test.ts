import { describe, it, expect, vi, beforeEach } from 'vitest'
import menuReducer, { setMenuIdx, setMenuOpen } from './index'

describe('menuReducer', () => {
  const initialState = {
    selMenuIdx: 0,
    open: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state when no action is dispatched', () => {
    const result = menuReducer(undefined, { type: 'unknown' })
    expect(result).toEqual(initialState)
  })

  it('should handle setMenuIdx action', () => {
    // Mock window.scrollTo
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const action = setMenuIdx(2)
    const result = menuReducer(initialState, action)

    expect(result).toEqual({
      selMenuIdx: 2,
      open: false
    })
    expect(scrollToMock).toHaveBeenCalledWith(0, 0)

    scrollToMock.mockRestore()
  })

  it('should handle setMenuOpen action with true value', () => {
    const action = setMenuOpen(true)
    const result = menuReducer(initialState, action)

    expect(result).toEqual({
      selMenuIdx: 0,
      open: true
    })
  })

  it('should handle setMenuOpen action with false value', () => {
    const currentState = {
      selMenuIdx: 0,
      open: true
    }

    const action = setMenuOpen(false)
    const result = menuReducer(currentState, action)

    expect(result).toEqual({
      selMenuIdx: 0,
      open: false
    })
  })

  it('should preserve selMenuIdx when setting menu open state', () => {
    const currentState = {
      selMenuIdx: 3,
      open: false
    }

    const action = setMenuOpen(true)
    const result = menuReducer(currentState, action)

    expect(result).toEqual({
      selMenuIdx: 3,
      open: true
    })
  })
})
