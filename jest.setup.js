import '@testing-library/jest-dom'

// Mock browser APIs for jsdom environment if necessary
if (typeof window !== 'undefined' && typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: jest.fn() })
}
