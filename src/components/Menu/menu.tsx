import React, { createContext, useState } from 'react'
import classNames from 'classnames'

import { MenuItemProps } from './menuItem'

type MenuMode = 'horizonal' | 'vertical'
type SelectCallback = (selectedIndex: string) => void

export interface MenuProps {
  defaultIndex?: string
  className?: string
  style?: React.CSSProperties // 自定义的style，使用react提供的内置类型CSSProperties
  mode?: MenuMode
  onSelect?: SelectCallback

  /**设置子菜单的默认打开 只在纵向模式下生效 */
  defaultOpenSubMenus?: string[]
}

export interface IMenuContext {
  index?: string
  onSelect?: SelectCallback
  mode?: MenuMode
  defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({ index: '0' })

const Menu: React.FC<MenuProps> = (props) => {
  const {
    style,
    className,
    children,
    mode,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus,
  } = props

  // 创建一个state，记录当前选中的index
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)

  const hanldeClickMenuIten = (index: string) => {
    setCurrentIndex(index)
    onSelect && onSelect(index)
  }

  // 创建一个context，让子组件能获取到当前选中的index和用户自定义的onSelect方法
  const context: IMenuContext = {
    index: currentIndex ? currentIndex : '0',
    onSelect: hanldeClickMenuIten,
    mode,
    defaultOpenSubMenus,
  }

  const classes = classNames('cmp-menu', className, {
    'cmp-menu-vertical': mode === 'vertical',
    'cmp-menu-horizontal': mode !== 'vertical',
  })

  // 避免直接对children进行map之类的操作
  // react提供了React.Children.map，用于对children进行遍历操作
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>
      const { displayName } = childElement.type // 拿到每一个child

      // 限制一下Menu的子元素只能MenuItem
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        // 返回新的react元素，并可以在此添加props
        // 返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。
        // 新的子元素将取代现有的子元素，而来自原始元素的 key 和 ref 将被保留。
        return React.cloneElement(childElement, {
          index: index.toString(),
        })
      } else {
        console.error(
          'error: Menu has a child which is not a MenuItem component'
        )
      }
    })
  }

  return (
    <ul className={classes} style={style}>
      <MenuContext.Provider value={context}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

Menu.defaultProps = {
  mode: 'horizonal',
  defaultIndex: '0',
  defaultOpenSubMenus: [],
}

export default Menu
