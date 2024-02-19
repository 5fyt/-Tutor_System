declare namespace Store {
  type loginState = {
    token: string;
    name: string;
    role: string;
    avatarUrl: string;
    collapsed: boolean;
    menuList: any[];
  };
}
