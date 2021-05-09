import React, { FC, useState, DragEvent } from 'react'
import classNames from 'classnames'

interface DraggerProps {
  onFile: (files: FileList) => void
}

export const Dragger: FC<DraggerProps> = (props) => {
  const { onFile, children } = props
  const [dragOver, setDragOver] = useState(false)
  const klass = classNames('viking-uploader-dragger', {
    'is-dragover': dragOver,
  })
  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(false)
    // e.dataTransfer.files：拖拽的文件
    onFile(e.dataTransfer.files)
  }
  const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
    e.preventDefault()
    setDragOver(over)
  }

  // onDragOver: 拖拽到特定的元素之上
  // onDragLeave: 拖拽离开元素之外
  // onDrop: 拖拽到元素内
  return (
    <div
      className={klass}
      onDragOver={(e) => {
        handleDrag(e, true)
      }}
      onDragLeave={(e) => {
        handleDrag(e, false)
      }}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

export default Dragger
