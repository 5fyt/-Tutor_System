declare namespace Store {
  type loginState = {
    token: string;
    name: string;
    role: string;
    avatarUrl: string;
    menuList: any[];
  };
}
