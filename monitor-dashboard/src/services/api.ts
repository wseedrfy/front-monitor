import axios from 'axios';
import { LogItem, Statistics } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3031/api'
});

export const fetchLogs = async (params?: {
  type?: string;
  startTime?: number;
  endTime?: number;
  page?: number;
  pageSize?: number;
}) => {
  const response = await api.get<{
    data: LogItem[];
    total: number;
  }>('/logs', { params });
  return response.data;
};

export const fetchStatistics = async (timeRange?: {
  startTime?: number;
  endTime?: number;
}) => {
  const response = await api.get<Statistics>('/statistics', {
    params: timeRange
  });
  return response.data;
};

export const fetchErrorTrend = async (timeRange: {
  startTime: number;
  endTime: number;
}) => {
  const response = await api.get('/error-trend', {
    params: timeRange
  });
  return response.data;
};

export const fetchPerformanceMetrics = async (timeRange?: {
  startTime?: number;
  endTime?: number;
}) => {
  const response = await api.get('/performance', {
    params: timeRange
  });
  return response.data;
}; 