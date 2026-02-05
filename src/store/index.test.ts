import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './modules/menuReducer'

// Mock redux-persist
vi.mock('redux-persist', () => ({
  persistReducer: (config: any, reducer: any) => reducer,
  persistStore: (store: any) => ({
    persist: vi.fn(),
    purge: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  }),
}))

vi.mock('redux-persist/lib/storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}))

describe('Redux Store', () => {
  let testStore: any

  beforeEach(() => {
    // Create a new store for each test
    testStore = configureStore({
      reducer: {
        menu: menuReducer,
      },
    })
  })

  it('should create store with correct configuration', () => {
    // Check if store is created successfully
    expect(testStore).toBeDefined()
    expect(typeof testStore.subscribe).toBe('function')
    expect(typeof testStore.dispatch).toBe('function')
    expect(typeof testStore.getState).toBe('function')
  })

  it('should have subscribe method', () => {
    expect(testStore.subscribe).toBeDefined()
    expect(typeof testStore.subscribe).toBe('function')
  })

  it('should have dispatch method', () => {
    expect(testStore.dispatch).toBeDefined()
    expect(typeof testStore.dispatch).toBe('function')
  })

  it('should have getState method', () => {
    expect(testStore.getState).toBeDefined()
    expect(typeof testStore.getState).toBe('function')
  })

  it('should have menu state', () => {
    const state = testStore.getState()
    expect(state).toHaveProperty('menu')
  })
})
