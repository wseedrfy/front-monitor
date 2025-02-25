/// <reference types="jest" />

import { pageLoadMonitor } from '../../src/core/pageLoad';
import { transportData } from '../../src/core/__mocks__/transport';

jest.mock('../../src/core/transport', () => ({
  transportData: {
    send: jest.fn(),
    bindOptions: jest.fn()
  }
}));

describe('PageLoadMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should collect page load metrics', () => {
    window.dispatchEvent(new Event('load'));
    
    // 等待setTimeout执行
    jest.runAllTimers();

    expect(transportData.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Page Load Performance Metrics',
        data: expect.objectContaining({
          dnsTime: 100,  // 1200 - 1100
          tcpTime: 100,  // 1400 - 1300
          whiteScreenTime: 500,  // 1500 - 1000
          domParseTime: 100,  // 1600 - 1500
          domReadyTime: 700,  // 1700 - 1000
          loadTime: 800  // 1800 - 1000
        })
      })
    );
  });
}); 