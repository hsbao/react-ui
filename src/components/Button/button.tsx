import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

export interface BaseButtonProps {
  size?: ButtonSize
  btnType?: ButtonType
  disabled?: boolean
  className?: string
  children: React.ReactNode
  href?: string
}

// react提供的ButtonHTMLAttributes，可拿到button标签上所有原生的属性
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>

// react提供的AnchorHTMLAttributes，可拿到a标签上所有原生的属性
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>

// TS提供的Partial，可将传入的类型变成可选类型
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互
 * ### 引用方法
 *
 * ~~~js
 * import { Button } from 'react-ui'
 * ~~~
 */
const Button: React.FC<ButtonProps> = (props) => {
  const {
    size,
    className,
    disabled,
    btnType,
    href,
    children,
    ...resetProps
  } = props
  const classes = classNames('cmp-btn', className, {
    [`cmp-btn-${size}`]: size,
    [`cmp-btn-${btnType}`]: btnType,
    disabled: btnType === 'link' && disabled,
  })

  if (btnType && btnType === 'link' && href) {
    return (
      <a href={href} className={classes} {...resetProps}>
        {children}
      </a>
    )
  } else {
    return (
      <button className={classes} disabled={disabled} {...resetProps}>
        {children}
      </button>
    )
  }
}

Button.defaultProps = {
  disabled: false,
  btnType: 'default',
  children: '按钮',
}

export default Button
