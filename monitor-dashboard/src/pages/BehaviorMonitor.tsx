import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Space, Tag, Select, Row, Col, Statistic } from 'antd';
import { Line } from '@ant-design/charts';
import { fetchLogs, fetchBehaviorTrend, fetchStatistics } from '../services/api';
import { LogItem, BehaviorTypes } from '../types';
import dayjs from 'dayjs';
import { UserOutlined, AimOutlined, GlobalOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const BehaviorMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [selectedType, setSelectedType] = useState<string>();
  const [timeRange, setTimeRange] = useState<[number, number]>([
    dayjs().subtract(7, 'day').valueOf(),
    dayjs().valueOf()
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, trendData, statsData] = await Promise.all([
        fetchLogs({
          type: selectedType,
          startTime: timeRange[0],
          endTime: timeRange[1],
          category: 'BEHAVIOR'
        }),
        fetchBehaviorTrend({
          startTime: timeRange[0],
          endTime: timeRange[1]
        }),
        fetchStatistics({
          startTime: timeRange[0],
          endTime: timeRange[1],
          category: 'BEHAVIOR'
        })
      ]);
      setLogs(logsData.data);
      setTrendData(trendData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, selectedType]);

  const columns = [
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === BehaviorTypes.CLICK ? 'blue' : type === BehaviorTypes.ROUTE ? 'green' : 'orange'}>
          {type}
        </Tag>
      )
    },
    {
      title: '事件详情',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => {
        const eventData = typeof data === 'string' ? JSON.parse(data) : data;
        switch (eventData.type) {
          case BehaviorTypes.CLICK:
            return `点击了 ${eventData.element} (${eventData.xpath})`;
          case BehaviorTypes.ROUTE:
            return `路由从 ${eventData.from} 变更到 ${eventData.to}`;
          case BehaviorTypes.CUSTOM:
            return `${eventData.message || '自定义事件'}`;
          default:
            return JSON.stringify(eventData);
        }
      }
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      )
    }
  ];

  const config = {
    data: trendData,
    padding: [20, 20, 20, 20],
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'right-top' as const
    },
    xAxis: {
      type: 'time',
      label: {
        formatter: (v: string) => dayjs(v).format('MM-DD HH:mm')
      }
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}次`
      }
    }
  };

  const timeRangePresets: { label: string; value: () => [dayjs.Dayjs, dayjs.Dayjs] }[] = [
    { 
      label: '今天', 
      value: () => [dayjs().startOf('day'), dayjs()]
    },
    { 
      label: '昨天', 
      value: () => [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')]
    },
    { 
      label: '最近7天', 
      value: () => [dayjs().subtract(7, 'day'), dayjs()]
    },
    { 
      label: '最近30天', 
      value: () => [dayjs().subtract(30, 'day'), dayjs()]
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="点击事件"
                value={statistics.clickCount || 0}
                prefix={<AimOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="路由变更"
                value={statistics.routeCount || 0}
                prefix={<GlobalOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="用户会话"
                value={statistics.sessionCount || 0}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="行为趋势">
          <Space style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 200 }}
              placeholder="选择行为类型"
              allowClear
              onChange={setSelectedType}
              options={Object.entries(BehaviorTypes).map(([key, value]) => ({
                label: key,
                value: value
              }))}
            />
            <RangePicker
              showTime
              presets={timeRangePresets}
              onChange={(dates) => {
                if (dates) {
                  setTimeRange([dates[0]!.valueOf(), dates[1]!.valueOf()]);
                }
              }}
            />
          </Space>
          <Line {...config} />
        </Card>

        <Card title="行为日志">
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条`
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default BehaviorMonitor; 