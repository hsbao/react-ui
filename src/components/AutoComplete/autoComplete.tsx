import React, { 
	FC, 
	ReactElement, 
	useState, 
	useRef, 
	ChangeEvent, 
	KeyboardEvent, 
	useEffect 
} from 'react'
import classNames from 'classnames'

import Input, { InputProps } from '../Input/input'
import Icon from '../Icon/icon'
import Transition from '../Transition/transition'

import useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'

interface DataSourceObject {
  value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject


// Omit是typescript提供的方法，用于忽略某个属性
// 因为Input组件带了onSelect，和我们的onSelect冲突了
// 这个时候就可以使用Omit来把onSelect忽略
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  fetchSuggestions: (
    str: string
  ) => DataSourceType[] | Promise<DataSourceType[]>
  onSelect?: (item: DataSourceType) => void
  renderOption?: (item: DataSourceType) => ReactElement
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
	const {
    fetchSuggestions,
    onSelect,
    value,
    renderOption,
    ...restProps
  } = props

  const [ inputValue, setInputValue ] = useState(value as string)
  const [ suggestions, setSugestions ] = useState<DataSourceType[]>([])
  const [ loading, setLoading ] = useState(false)
  const [ showDropdown, setShowDropdown] = useState(false)
  const [ highlightIndex, setHighlightIndex] = useState(-1)
  const triggerSearch = useRef(false)
  const componentRef = useRef<HTMLDivElement>(null)

	// 防抖处理
  const debouncedValue = useDebounce(inputValue, 300)

	// 点击隐藏
  useClickOutside(componentRef, () => { setSugestions([])})

  useEffect(() => {
    if (debouncedValue && triggerSearch.current) {
      setSugestions([])

			// 当输入框的值变化（经过防抖处理过的），动态获取列表
      const results = fetchSuggestions(debouncedValue)

      if (results instanceof Promise) { // Promise的情况
        setLoading(true)
        results.then(data => {
          setLoading(false)
          setSugestions(data)
          if (data.length > 0) {
            setShowDropdown(true)
          }
        })
      } else { // 如果是返回一个数组，则直接使用
        setSugestions(results)
        setShowDropdown(true)
        if (results.length > 0) {
          setShowDropdown(true)
        } 
      }
    } else {
      setShowDropdown(false)
    }
    setHighlightIndex(-1)
  }, [debouncedValue, fetchSuggestions])

  const highlight = (index: number) => {
    if (index < 0) index = 0
    if (index >= suggestions.length) {
      index = suggestions.length - 1
    }
    setHighlightIndex(index)
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch(e.keyCode) {
      case 13:
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex])
        }
        break
      case 38:
        highlight(highlightIndex - 1)
        break
      case 40:
        highlight(highlightIndex + 1)
        break
      case 27:
        setShowDropdown(false)
        break
      default:
        break
    }
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setInputValue(value)
    triggerSearch.current = true
  }

	// 点击下拉列表，把选中的值回显到输入框
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value)
    setShowDropdown(false)
    if (onSelect) {
      onSelect(item)
    }
    triggerSearch.current = false
  }

	// 默认是把内容直接展示在li，也可以自定义渲染其他元素
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value
  }

  const generateDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {setSugestions([])}}
      >
        <ul className="cmp-suggestion-list">
          { loading &&
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin/>
            </div>
          }
          {suggestions.map((item, index) => {
            const cnames = classNames('suggestion-item', {
              'is-active': index === highlightIndex
            })
            return (
              <li key={index} className={cnames} onClick={() => handleSelect(item)}>
                {renderTemplate(item)}
              </li>
            )
          })}
        </ul>
      </Transition>
    )
  }
  return (
    <div className="cmp-auto-complete" ref={componentRef}>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {generateDropdown()}
    </div>
  )
}

AutoComplete.displayName = 'AutoComplete'

export default AutoComplete
