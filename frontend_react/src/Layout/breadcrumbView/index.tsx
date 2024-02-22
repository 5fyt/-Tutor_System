import { FC, memo, useEffect, useState } from 'react';
import { useLocation, Link, Location } from 'react-router-dom';
import { theme, Breadcrumb } from 'antd';
import './index.less';
import { useAppSelector } from '@/store';
import { MenuList } from '@/router/type';

const BreadCrumbView: FC = () => {
  const { pathname } = useLocation();
  const location = useLocation() as Location<{ from: string }>;
  const menuList = useAppSelector(state => state.login.menuList);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const [items, setItems] = useState<any>([]);
  const [title, setTitle] = useState<string>('');
  /**
   *
   * @param menuList
   * @param newArr
   * @returns 一个新的数组对象,包含了三个二级菜单和父级菜单的所有项
   */
  const transBreadcrumbItems = (menuList: MenuList) => {
    const otherbreadMenu = menuList.filter(item => item.path !== '/dashboard');
    const transbreadMenu = otherbreadMenu.map(item => {
      const parentItems = { key: item.path, title: <Link to={location.state?.from}>{item.name}</Link> };
      if (item.children?.length) {
        const childrenItems = item.children.map(child => {
          return {
            key: child.path,
            title: child.name
          };
        });
        return [parentItems, ...childrenItems];
      }
    });
    //[[],[]]
    return transbreadMenu;
  };

  useEffect(() => {
    const transbreadMenu = transBreadcrumbItems(menuList).flat(1);
    const filterItems = transbreadMenu.filter(
      (item: any) => item.key === pathname || item.key === pathname.split('/')[1]
    );
    const filterTitle = transbreadMenu.filter((item: any) => item.key === pathname) as any;
    filterItems && setItems(filterItems);
    filterTitle && setTitle(filterTitle[0]?.title);
  }, [pathname, menuList]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {pathname === '/dashboard' ? (
        <></>
      ) : (
        <>
          <div className="bread_header" style={{ background: colorBgContainer }}>
            <Breadcrumb items={items} className="breadcrumb" />
            <h2 className="title">{title}</h2>
          </div>
        </>
      )}
    </>
  );
};
export default memo(BreadCrumbView);
