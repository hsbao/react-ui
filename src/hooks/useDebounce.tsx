import { useState, useEffect } from 'react'

// 防抖
function useDebounce(value: any, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

	// 在一定时间内，如果输入框的值变化，就触发useEffect，然后会清除上一次的setTimeout
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
