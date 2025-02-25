/// <reference types="jest" />

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    timing: {
      navigationStart: 1000,
      domainLookupStart: 1100,
      domainLookupEnd: 1200,
      connectStart: 1300,
      connectEnd: 1400,
      domInteractive: 1500,
      domComplete: 1600,
      domContentLoadedEventEnd: 1700,
      loadEventEnd: 1800
    },
    getEntriesByType: jest.fn().mockReturnValue([]),
    memory: {
      usedJSHeapSize: 1000000,
      jsHeapSizeLimit: 2000000
    }
  }
});

// Mock navigator.connection
Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
    addEventListener: jest.fn()
  }
}); 