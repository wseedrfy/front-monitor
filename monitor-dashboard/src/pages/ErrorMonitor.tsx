import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Space, Tag } from 'antd';
import { Line } from '@ant-design/charts';
import { fetchLogs, fetchErrorTrend } from '../services/api';
import { LogItem, ErrorTypes, Severity } from '../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ErrorMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([
    dayjs().subtract(7, 'day').valueOf(),
    dayjs().valueOf()
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, trendData] = await Promise.all([
        fetchLogs({
          startTime: timeRange[0],
          endTime: timeRange[1]
        }),
        fetchErrorTrend({
          startTime: timeRange[0],
          endTime: timeRange[1]
        })
      ]);
      setLogs(logsData.data);
      setTrendData(trendData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

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
        <Tag color={type.includes('ERROR') ? 'error' : 'default'}>
          {type}
        </Tag>
      )
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message'
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
    padding: 'auto',
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'top-right'
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
    },
    point: {
      size: 5,
      shape: 'diamond'
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="错误趋势">
          <Space style={{ marginBottom: 16 }}>
            <RangePicker
              showTime
              onChange={(dates) => {
                if (dates) {
                  setTimeRange([dates[0]!.valueOf(), dates[1]!.valueOf()]);
                }
              }}
            />
          </Space>
          <Line {...config} padding={[20, 20, 20, 20]} />
        </Card>

        <Card title="错误日志">
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

export default ErrorMonitor; 