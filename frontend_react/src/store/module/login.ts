import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '@/api/login';
import { Storage } from '@/utils/Storage';
import { ACCESS_TOKEN_KEY, ACCESS_ADMIN_NAME } from '@/enums/cacheEnum';
import { RootState } from '..';

const initialState: Store.loginState = {
  token: Storage.get(ACCESS_TOKEN_KEY, null),
  name: Storage.get(ACCESS_ADMIN_NAME, null)
};

const setToken = (state: Store.loginState, params: string) => {
  state.token = params ?? '';
  const ex = 7 * 24 * 60 * 60 * 1000;
  state.token && Storage.set(ACCESS_TOKEN_KEY, state.token, ex);
};
const resetToken = (state: Store.loginState) => {
  state.token = '';
  state.name = '';
  Storage.remove(ACCESS_TOKEN_KEY);
};
/**
 * 用户登入异步
 */
export const loginUser = createAsyncThunk('login', async (data: API.LoginParams) => {
  const { token } = await login(data);
  return token;
});
export const afterLogin = createAsyncThunk('login/after', async () => {});
/**
 * 登入
 */
const loginReducer = createSlice({
  name: 'loginStore',
  initialState,
  // reducers: { setToken, resetToken },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      setToken(state, payload);
    });
  }
});
export const user_name = (state: RootState) => state.login.name;
export default loginReducer.reducer;
