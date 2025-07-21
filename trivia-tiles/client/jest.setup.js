// Import testing library matchers
require('@testing-library/jest-dom');

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
  pageview: jest.fn(),
  set: jest.fn(),
}));

// Mock window.gtag
global.gtag = jest.fn();

// Setup DOM environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
