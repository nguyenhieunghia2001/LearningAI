import React, { useEffect, useState } from 'react'
import { Menu, Drawer, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import './Header.css'

const HeaderComponent = ({ selectedKey = 'fundamentals', onMenuClick }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Add a body class so content can shift when sidebar visible on desktop
    document.body.classList.add('has-left-nav')
    return () => document.body.classList.remove('has-left-nav')
  }, [])

  const items = [
    { key: 'fundamentals', label: 'CSharp Fundamentals' },
    { key: 'oop', label: 'OOP' },
    { key: 'collections', label: 'Collections & LINQ' }
  ]

  const handleMenuClick = ({ key }) => {
    onMenuClick && onMenuClick(key)
    setOpen(false)
  }

  return (
    <>
      {/* Left vertical nav for desktop */}
      <aside className="left-nav">
        <div className="brand">
          <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f1724', fontWeight: 800 }}>C#</div>
          <div style={{ fontSize: 16 }}>C# Interview</div>
        </div>

        <div className="menu">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={items}
          />
        </div>
      </aside>

      {/* Top bar (sticky) with mobile menu button */}
      <div className="header-top">
        <div className="title">C# Interview</div>
        <div>
          <Button className="mobile-menu-btn" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
        </div>
      </div>

      {/* Drawer for mobile */}
      <Drawer
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: 16 }}>
          <div className="brand" style={{ marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f1724', fontWeight: 800 }}>C#</div>
            <div style={{ fontSize: 15, marginLeft: 8 }}>C# Interview</div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={items}
          />
        </div>
      </Drawer>
    </>
  )
}

export default HeaderComponent
