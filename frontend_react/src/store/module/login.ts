import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '@/api/login';
import { Storage } from '@/utils/Storage';
import { ACCESS_TOKEN_KEY, ACCESS_ADMIN_NAME } from '@/enums/cacheEnum';
import { RootState } from '..';
import { getAccount, logout } from '@/api/account';

const initialState: Store.loginState = {
  token: Storage.get(ACCESS_TOKEN_KEY, null),
  name: Storage.get(ACCESS_ADMIN_NAME, null),
  avatarUrl: ''
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
  Storage.remove(ACCESS_ADMIN_NAME);
};
/**
 * 用户登入异步
 */
export const loginUser = createAsyncThunk('login', async (data: API.LoginParams) => {
  const { token } = await login(data);
  return token;
});
export const afterLogin = createAsyncThunk('login/after', async () => {
  const data = await getAccount();
  Storage.set(ACCESS_ADMIN_NAME, data.name);
  return data;
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
        state.avatarUrl = payload.headImg;
      })
      .addCase(loginOut.fulfilled, state => {
        resetToken(state);
      });
  }
});
export const user_name = (state: RootState) => state.login.name;
export default loginReducer.reducer;
