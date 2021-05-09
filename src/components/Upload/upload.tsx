import React, { ChangeEvent, FC, useRef, useState } from 'react'
import axios from 'axios'

import UploadList from './uploadList'
import Dragger from './dragger'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
// 定义上传文件的列表以及对应的状态等等
export interface UploadFile {
  uid: string
  size: number
  name: string
  status?: UploadFileStatus
  percent?: number
  raw?: File // 源文件
  response?: any
  error?: any
}

export interface UploadProps {
  action: string
  defaultFileList?: UploadFile[]
  beforeUpload?: (file: File) => boolean | Promise<File>
  onProgress?: (percentage: number, file: File) => void
  onSuccess?: (res: any, file: File) => void
  onError?: (err: any, file: File) => void
  onChange?: (file: File) => void
  onRemove?: (file: UploadFile) => void
  headers?: { [key: string]: any }
  name?: string
  data?: { [key: string]: any } // 用户上传其他额外的数据
  withCredentials?: boolean // 是否携带cookie
  accept?: string
  multiple?: boolean
  drag?: boolean // 是否拖拽
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    onProgress,
    onSuccess,
    onError,
    beforeUpload,
    onChange,
    onRemove,
    headers,
    name,
    data,
    withCredentials,
    accept,
    multiple,
    drag,
    children,
  } = props

  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])

  // TS提供的Partial，可将传入的类型变成可选类型
  // 更新文件状态
  const updateFileList = (
    updateFile: UploadFile,
    updateObj: Partial<UploadFile>
  ) => {
    setFileList((prevList) => {
      return prevList.map((file) => {
        if (file.uid === updateFile.uid) {
          // 只能当前的文件
          return { ...file, ...updateObj }
        } else {
          return file
        }
      })
    })
  }

  // input file ref
  const fileInput = useRef<HTMLInputElement>(null)

  // 触发input click
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  // 选择文件: onChange 对应的是ChangeEvent，ChangeEvent可以接受一个泛型，代表当前元素的类型为input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) {
      return
    }
    uploadFiles(files)
    // 上传后清空input
    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  // 上传文件
  const uploadFiles = (files: FileList) => {
    // files: FileList是一个类数组，需要转成数组
    let postFiles = Array.from(files)
    postFiles.forEach((file) => {
      // 如果没有beforeUpload，就直接上传
      if (!beforeUpload) {
        post(file)
      } else {
        // beforeUpload返回结果可能是promise，也可能是boolean
        // 返回false，就不要上传了
        const result = beforeUpload(file)
        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile)
          })
        } else if (result) {
          post(file)
        }
      }
    })
  }

  const post = (file: File) => {
    let _file: UploadFile = {
      uid: Date.now() + '_upload-file-uid',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    }
    //setFileList([_file, ...fileList])
    setFileList((prevList) => {
      return [_file, ...prevList]
    })

    const formData = new FormData()
    formData.append(name || 'file', file)

    // 用户上传其他额外的数据
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
    }

    axios
      .post(action, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials,
        // 监测上传进度
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: 'uploading' })
            onProgress && onProgress(percentage, file) // 上传过程中，并且传了onProgress
          }
        },
      })
      .then((res) => {
        updateFileList(_file, { status: 'success', response: res.data })

        onSuccess && onSuccess(res.data, file)
        onChange && onChange(file)
      })
      .catch((err) => {
        updateFileList(_file, { status: 'error', error: err })

        onError && onError(err, file)
        onChange && onChange(file)
      })
  }

  // 删除文件
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid)
    })
    if (onRemove) {
      onRemove(file)
    }
  }

  return (
    <div className='viking-upload-component'>
      <div
        className='viking-upload-input'
        style={{ display: 'inline-block' }}
        onClick={handleClick}
      >
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files)
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          type='file'
          className='viking-file-input'
          ref={fileInput}
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* 上传文件列表 */}
      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  )
}

export default Upload
