import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Welcome page', module)
  .add('welcome', () => {
    return (
      <>
        <h1>REACT LIB UI 是一款基于 React 和 TypeScript 的 UI 组件库</h1>
        <p>不建议你将此 UI 库用于生产环境</p>
      </>
    )
  }, { info : { disable: true }})