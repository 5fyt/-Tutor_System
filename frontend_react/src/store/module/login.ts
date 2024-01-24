import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '@/api/login';
import { Storage } from '@/utils/Storage';
// import { RootState } from '..';
import { ACCESS_TOKEN } from '@/enums/cacheEnum';

const initialState = {
  token: Storage.get(ACCESS_TOKEN, null)
};
// const setToken = (token: string) => {};
/**
 * 用户登入异步
 */
export const loginUser = createAsyncThunk('login', async (data: API.LoginParams) => {
  const res = await login(data);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('name', res.data.name);
  localStorage.setItem('photo', res.data.photo);
  return res;
});

/**
 * 退出登入
 */
const loginReducer = createSlice({
  name: 'loginStore',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.token = payload.data.token;
    });
  }
});

export default loginReducer.reducer;
