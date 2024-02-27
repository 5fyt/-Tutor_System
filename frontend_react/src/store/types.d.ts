declare namespace Store {
  type loginState = {
    token: string;
    name: string;
    role: string[];
    avatarUrl: string;
    collapsed: boolean;
    menuList: any[];
  };
  type userState = {
    checkedkeys: React.Key[];
    isAllChecked: boolean;
  };
}
