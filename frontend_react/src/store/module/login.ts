import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '@/api/login';
import { Storage } from '@/utils/Storage';
import { ACCESS_TOKEN_KEY, ACCESS_ADMIN_USERINFO, ACCESS_ADMIN_MENULIST } from '@/enums/cacheEnum';
import { RootState } from '..';
import { getAccount, logout } from '@/api/account';
import { MenuList } from '@/router/type';
import { dynamicMenuRoute } from '@/router/routeList/dynamicRoute';

const initialState: Store.loginState = {
  token: Storage.get(ACCESS_TOKEN_KEY, null),
  name: Storage.get(ACCESS_ADMIN_USERINFO, null)?.name || '',
  avatarUrl: Storage.get(ACCESS_ADMIN_USERINFO, null)?.headImg || '',
  // name: '',
  // avatarUrl: '',
  role: '',
  menuList: Storage.get(ACCESS_ADMIN_MENULIST, null) || []
};

const setToken = (state: Store.loginState, params: string) => {
  state.token = params ?? '';
  const ex = 7 * 24 * 60 * 60 * 1000;
  state.token && Storage.set(ACCESS_TOKEN_KEY, state.token, ex);
};
const resetToken = (state: Store.loginState) => {
  state.token = '';
  state.name = '';
  state.avatarUrl = '';
  Storage.remove(ACCESS_TOKEN_KEY);
  Storage.remove(ACCESS_ADMIN_USERINFO);
};
const filterMenu = (state: Store.loginState, menuList: MenuList, newArr: MenuList = []) => {
  newArr = menuList
    .map(item => {
      if (item.children?.length) {
        const childrenMenu = item.children.filter(child => child.meta.role?.includes(state.role));
        if (childrenMenu.length) {
          return { ...item, children: childrenMenu };
        }
      } else {
        return item;
      }
    })
    .filter(menu => menu?.meta.role?.includes(state.role)) as MenuList;
  Storage.set(ACCESS_ADMIN_MENULIST, newArr);
  return newArr;
};
/**
 * 用户登入异步
 */
export const loginUser = createAsyncThunk('login', async (data: API.LoginParams) => {
  const { token } = await login(data);
  return token;
});
export const afterLogin = createAsyncThunk('login/after', async () => {
  const { email, phone, ...data } = await getAccount();
  Storage.set(ACCESS_ADMIN_USERINFO, data);
  return { email, phone, ...data };
});
export const loginOut = createAsyncThunk('loginout', async () => {
  const data = await logout();
  return data;
});
/**
 * 登入
 */
const loginReducer = createSlice({
  name: 'loginStore',
  initialState,
  // reducers: { setToken, resetToken },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        setToken(state, payload);
      })
      .addCase(afterLogin.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.role = payload.role;
        state.avatarUrl = payload.headImg;
        state.menuList = filterMenu(state, dynamicMenuRoute);
      })
      .addCase(loginOut.fulfilled, state => {
        resetToken(state);
      });
  }
});
export const user_name = (state: RootState) => state.login.name;
export const menuList = (state: RootState) => state.login.menuList;
export default loginReducer.reducer;
