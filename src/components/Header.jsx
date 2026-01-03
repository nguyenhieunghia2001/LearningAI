import React from 'react'
import { Layout, Typography, Menu } from 'antd'

const { Header: AntHeader } = Layout
const { Title } = Typography

const HeaderComponent = ({ selectedKey = 'fundamentals', onMenuClick }) => (
  <AntHeader style={{ background: 'linear-gradient(135deg, #512da8 0%, #673ab7 100%)', padding: '12px 24px', borderBottom: 'none', minHeight: 88 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f1724', fontWeight: 800, fontSize: 20 }}>C#</div>
        <Title level={3} style={{ margin: 0, color: '#fff' }}>C# Interview</Title>
      </div>

      {/* Site-level navigation menu */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => onMenuClick && onMenuClick(key)}
        items={[
          { key: 'fundamentals', label: 'CSharp Fundamentals' },
          { key: 'oop', label: 'OOP' }
        ]}
        style={{ background: 'transparent', color: '#fff', fontSize: 16 }}
      />
    </div>
  </AntHeader>
)

export default HeaderComponent
