import React from 'react'
import classNames from 'classnames'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'

// https://fontawesome.com/how-to-use/on-the-web/using-with/react

export type ThemeProps =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark'

export interface IconProps extends FontAwesomeIconProps {
  theme?: string
  className?: string
  style?: React.CSSProperties
}

const Icon: React.FC<IconProps> = (props) => {
  const { className, style, theme, ...restProps } = props
  const classes = classNames('cmp-icon', className, {
    [`icon-${theme}`]: theme,
  })

  return <FontAwesomeIcon className={classes} style={style} {...restProps} />
}

export default Icon
