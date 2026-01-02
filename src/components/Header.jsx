import React from 'react'
import { Layout, Typography, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title } = Typography

const HeaderComponent = () => (
  <AntHeader style={{ background: 'transparent', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f1724', fontWeight: 700 }}>Q</div>
        <Title level={4} style={{ margin: 0, color: '#fff' }}>Questions & Answers</Title>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input placeholder="Tìm câu hỏi..." prefix={<SearchOutlined />} style={{ width: 240 }} />
        <Button type="primary">Thêm câu hỏi</Button>
      </div>
    </div>
  </AntHeader>
)

export default HeaderComponent
