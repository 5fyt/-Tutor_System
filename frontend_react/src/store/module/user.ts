import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

const initialState: Store.userState = {
  checkedkeys: [],
  isAllChecked: true
};
const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCheckedKeys: (state, { payload }) => {
      state.checkedkeys = payload;
    },
    setAllChecked: (state, { payload }) => {
      state.isAllChecked = payload;
    }
  }
});
export const { setCheckedKeys, setAllChecked } = userReducer.actions;
export const checkedkeys = (state: RootState) => state.user.checkedkeys;
export const checkedAll = (state: RootState) => state.user.isAllChecked;

export default userReducer.reducer;
