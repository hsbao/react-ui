import React, { useState, ChangeEvent } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import Button from './components/Button/button'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'
import Icon from './components/Icon/icon'
import Input from './components/Input'
import AutoComplete from './components/AutoComplete'
import Upload from './components/Upload'
import { UploadFile } from './components/Upload/upload'

library.add(fas)

const handleFetch = (query: string) => {
  return fetch(`https://api.github.com/search/users?q=${query}`)
    .then((res) => res.json())
    .then(({ items }) => {
      console.log(items)
      return items
        .slice(0, 10)
        .map((item: any) => ({ value: item.login, ...item }))
    })
}

const defaultFileList: UploadFile[] = [
  {
    uid: '123',
    size: 1234,
    name: 'hello.md',
    status: 'uploading',
    percent: 30,
  },
  { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
  { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 },
]

function App() {
  const [val, setVal] = useState('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setVal(e.target.value)
  }

  const onProgress = (percentage: number, file: File) => {
    console.log(percentage, file)
  }
  const onSuccess = (res: any, file: File) => {
    console.log(res, file)
  }
  const onError = (err: any, file: File) => {
    console.log(err, file)
  }
  // const beforeUpload = (file: File) => {
  //   if (Math.round(file.size / 1024) > 50) {
  //     alert('图片太大了')
  //     return false
  //   }
  //   return true
  // }
  // const beforeUploadPromise = (file: File) => {
  //   const newFile = new File([file], 'new_name.png', { type: file.type })
  //   return Promise.resolve(newFile)
  // }
  const onChange = (file: File) => {
    console.log('onChange', file)
  }
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

      <div style={{ marginBottom: '20px' }}>
        <Icon icon='arrow-down' size='3x' theme='primary' />
      </div>
      <div style={{ marginBottom: '20px', width: '200px' }}>
        <Input
          value={val}
          onChange={handleChange}
          prepend='https://'
          append='.com'
        />
      </div>

      <div style={{ marginBottom: '20px', width: '200px' }}>
        <AutoComplete value={'123'} fetchSuggestions={handleFetch} />
      </div>
      <div style={{ marginBottom: '20px', width: '200px' }}>
        {/* https://jsonplaceholder.typicode.com/posts/ */}
        <Upload
          action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
          onProgress={onProgress}
          onSuccess={onSuccess}
          onError={onError}
          // beforeUpload={beforeUpload}
          onChange={onChange}
          defaultFileList={defaultFileList}
          name='fileName'
          accept='.jpg'
          multiple
          data={{ key: 'val' }}
          drag
        >
          <Icon icon='upload' size='3x' theme='secondary' />
          <br />
          <p>Drag file over to upload</p>
        </Upload>
      </div>
    </div>
  )
}

export default App
