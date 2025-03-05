import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import { fetchPerformanceMetrics } from '../services/api';
import { PerformanceMetrics } from '../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<[number, number]>([
    dayjs().subtract(1, 'day').valueOf(),
    dayjs().valueOf()
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPerformanceMetrics({
        startTime: timeRange[0],
        endTime: timeRange[1]
      });
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const formatTime = (ms?: number) => {
    if (!ms) return '-';
    return `${ms.toFixed(2)}ms`;
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="性能指标"
        extra={
          <RangePicker
            showTime
            onChange={(dates) => {
              if (dates) {
                setTimeRange([dates[0]!.valueOf(), dates[1]!.valueOf()]);
              }
            }}
          />
        }
        loading={loading}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="页面加载">
              <Statistic title="DOM加载完成" value={formatTime(metrics.domLoad)} />
              <Statistic title="页面完全加载" value={formatTime(metrics.loadTime)} />
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title="网络性能">
              <Statistic title="DNS查询" value={formatTime(metrics.DNS)} />
              <Statistic title="TCP连接" value={formatTime(metrics.TCP)} />
              <Statistic title="首字节时间" value={formatTime(metrics.TTFB)} />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="核心指标">
              <Statistic title="First Paint" value={formatTime(metrics.FP)} />
              <Statistic title="First Contentful Paint" value={formatTime(metrics.FCP)} />
              <Statistic title="Largest Contentful Paint" value={formatTime(metrics.LCP)} />
              <Statistic title="First Input Delay" value={formatTime(metrics.FID)} />
              <Statistic 
                title="Cumulative Layout Shift" 
                value={metrics.CLS?.toFixed(3) || '-'} 
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PerformanceMonitor; 