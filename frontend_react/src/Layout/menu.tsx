import React, { FC, useEffect, useState } from 'react';
import * as Icons from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { Menu } from 'antd';
import { useAppSelector } from '@/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuList, MenuItem } from '@/router/type';
import { dynamicRouteList } from '@/router/routeList/dynamicRoute';

type MenuItems = GetProp<MenuProps, 'items'>[number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItems[],
  type?: 'group'
): MenuItems {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItems;
}
interface MenuCProps {
  menuList: MenuList;
}
const customIcons: { [key: string]: any } = Icons;
const addIcon = (name: string) => {
  return React.createElement(customIcons[name]);
};
// 处理后台返回菜单 key 值为 antd 菜单需要的 key 值

const MenuComponent: FC<MenuCProps> = ({ menuList }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const collapsed = useAppSelector(state => state.login.collapsed);
  const [activeMenu, setActiveMenu] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  //当手动输入路由路由表发生变化时，将路由对应的sub展开，其他的隐藏
  const deepLoopFloat = (menuList: MenuList, newArr: MenuItems[] = []) => {
    menuList.forEach((item: MenuItem) => {
      // 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
      if (!item?.children?.length) return newArr.push(getItem(item.name, item.path, addIcon(item?.meta.icon)));
      newArr.push(getItem(item.name, item.path, addIcon(item?.meta?.icon), deepLoopFloat(item.children)));
    });
    return newArr;
  };
  const items: MenuItems[] = deepLoopFloat(menuList);

  useEffect(() => {
    const currentRoute = dynamicRouteList.filter(route => route.path === pathname);
    setActiveMenu([pathname]);
    const currentOpenKeys = currentRoute[0]?.path?.split('/')[1] as string;
    setOpenKeys(collapsed ? [] : [currentOpenKeys]);
  }, [pathname, collapsed]);

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };
  const toPage = ({ key }: { key: string }) => {
    if (pathname === key) return;
    navigate(key, { state: { fullPath: key } });
  };

  return (
    <Menu
      mode="inline"
      onOpenChange={onOpenChange}
      openKeys={openKeys}
      selectedKeys={activeMenu}
      onClick={toPage}
      items={items}
      style={{ width: '250px' }}
    />
  );
};

export default MenuComponent;
