import axios from 'axios';
import { LogItem, Statistics, BehaviorStatistics } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3031/api'
});

export const fetchLogs = async (params?: {
  type?: string;
  startTime?: number;
  endTime?: number;
  page?: number;
  pageSize?: number;
  category?: 'ERROR' | 'BEHAVIOR';
}) => {
  const response = await api.get<{
    data: LogItem[];
    total: number;
  }>('/logs', { params });
  return response.data;
};

export const fetchStatistics = async (params?: {
  startTime?: number;
  endTime?: number;
  category?: 'ERROR' | 'BEHAVIOR';
}) => {
  const response = await api.get<Statistics | BehaviorStatistics>('/statistics', {
    params
  });
  return response.data;
};

export const fetchErrorTrend = async (params: {
  startTime: number;
  endTime: number;
}) => {
  const response = await api.get('/error-trend', {
    params
  });
  return response.data;
};

export const fetchBehaviorTrend = async (params: {
  startTime: number;
  endTime: number;
}) => {
  const response = await api.get('/behavior-trend', {
    params
  });
  return response.data;
};

export const fetchPerformanceMetrics = async (params?: {
  startTime?: number;
  endTime?: number;
}) => {
  const response = await api.get('/performance', {
    params
  });
  return response.data;
}; 