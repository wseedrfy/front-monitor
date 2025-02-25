/// <reference types="jest" />

import { errorMonitor } from '../../src/core/error';
import { transportData } from '../../src/core/__mocks__/transport';

jest.mock('../../src/core/transport', () => ({
  transportData: {
    send: jest.fn(),
    bindOptions: jest.fn()
  }
}));

describe('ErrorMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle console errors', () => {
    console.error('Test error');
    expect(transportData.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error',
        type: 'CONSOLE_ERROR'
      })
    );
  });

  it('should handle window errors', () => {
    const errorEvent = new ErrorEvent('error', {
      error: new Error('Test error'),
      message: 'Test error'
    });
    window.dispatchEvent(errorEvent);

    expect(transportData.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error',
        type: 'WINDOW_ERROR'
      })
    );
  });
}); 