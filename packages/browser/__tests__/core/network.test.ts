/// <reference types="jest" />

import { networkMonitor } from '../../src/core/network';
import { transportData } from '../../src/core/__mocks__/transport';

jest.mock('../../src/core/transport', () => ({
  transportData: {
    send: jest.fn(),
    bindOptions: jest.fn()
  }
}));

describe('NetworkMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with online status', () => {
    const status = networkMonitor.getNetworkStatus();
    expect(status.online).toBe(true);
  });

  it('should handle online event', () => {
    window.dispatchEvent(new Event('online'));
    expect(transportData.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Network Status Changed',
        data: expect.objectContaining({
          to: expect.objectContaining({ online: true })
        })
      })
    );
  });

  it('should handle offline event', () => {
    window.dispatchEvent(new Event('offline'));
    expect(transportData.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Network Status Changed',
        data: expect.objectContaining({
          to: expect.objectContaining({ online: false })
        })
      })
    );
  });
}); 