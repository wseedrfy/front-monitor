import React from 'react';
import { Layout, Menu } from 'antd';
import {
  WarningOutlined,
  DashboardOutlined,
  UserOutlined
} from '@ant-design/icons';
import ErrorMonitor from './pages/ErrorMonitor';
import PerformanceMonitor from './pages/PerformanceMonitor';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState('1');

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <ErrorMonitor />;
      case '2':
        return <PerformanceMonitor />;
      default:
        return <ErrorMonitor />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <div style={{ 
          color: '#1890ff', 
          fontSize: '18px', 
          fontWeight: 'bold',
          padding: '0 24px'
        }}>
          监控数据看板
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '1',
                icon: <WarningOutlined />,
                label: '错误监控',
              },
              {
                key: '2',
                icon: <DashboardOutlined />,
                label: '性能监控',
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: '用户行为',
              }
            ]}
            onClick={({ key }) => setSelectedKey(key)}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0, 
            minHeight: 280 
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
