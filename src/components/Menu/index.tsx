import { FC } from 'react'
import Menu, { MenuProps } from './menu'
import SubMenu, { SubMenuProps } from './subMenu'
import MenuItem, { MenuItemProps } from './menuItem'

// 因为Menu的MenuProps没有Item和SubMenu，所以不能直接挂载
// 所以需要交叉类型的方式，加上Item和SubMenu
export type IMenuComponent = FC<MenuProps> & {
  Item: FC<MenuItemProps>
  SubMenu: FC<SubMenuProps>
}
const TransMenu = Menu as IMenuComponent

// 把MenuItem和SubMenu都挂载到Menu下，可以直接使用Menu.Item / Menu.SubMenu
TransMenu.Item = MenuItem
TransMenu.SubMenu = SubMenu

export default TransMenu
