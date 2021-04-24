import React from 'react'

import Button from './components/Button/button'

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
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Button btnType='link' href='www.baidu.com'>
          按钮
        </Button>
      </div>
    </div>
  )
}

export default App
