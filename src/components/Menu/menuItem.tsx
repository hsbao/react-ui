import React, { useContext } from 'react'
import classNames from 'classnames'

import { MenuContext } from './menu'

export interface MenuItemProps {
  className?: string
  style?: React.CSSProperties
  index?: string
  disabled?: boolean
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { disabled, className, style, children, index } = props

  // 获取父组件传过来的context
  const context = useContext(MenuContext)

  const classes = classNames('cmp-menu-item', className, {
    'is-disabled': disabled,
    'is-active': context.index === index,
  })

  const handleClickItem = () => {
    if (!disabled && context.onSelect && typeof index === 'string') {
      context.onSelect(index)
    }
  }

  return (
    <li className={classes} style={style} onClick={handleClickItem}>
      {children}
    </li>
  )
}

MenuItem.displayName = 'MenuItem'

MenuItem.defaultProps = {
  disabled: false,
}

export default MenuItem
