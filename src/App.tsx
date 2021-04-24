import React from 'react'

import Button from './components/Button/button'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'

function App() {
  return (
    <div className='App'>
      <div style={{ marginBottom: '20px' }}>
        <Button
          onClick={() => {
            alert(111)
          }}
        >
          按钮
        </Button>
        <Button disabled>按钮</Button>
        <Button btnType='primary'>主要按钮</Button>
        <Button btnType='danger' disabled>
          错误按钮
        </Button>
        <Button size='lg'>lg 按钮</Button>
        <Button btnType='link' href='www.baidu.com'>
          按钮
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Menu defaultIndex='0' onSelect={(index) => alert(index)}>
          <MenuItem>menu item 1</MenuItem>
          <MenuItem disabled>menu item 2</MenuItem>
          <MenuItem>menu item 3</MenuItem>
          <SubMenu title='哈哈哈哈'>
            <MenuItem>11111</MenuItem>
            <MenuItem>222222</MenuItem>
          </SubMenu>
        </Menu>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Menu
          defaultIndex='0'
          onSelect={(index) => alert(index)}
          mode='vertical'
        >
          <MenuItem>menu item 1</MenuItem>
          <MenuItem disabled>menu item 2</MenuItem>
          <MenuItem>menu item 3</MenuItem>
          <SubMenu title='哈哈哈哈'>
            <MenuItem>11111</MenuItem>
            <MenuItem>222222</MenuItem>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

export default App
