import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBooks: [],
  allCheckedInBooks: [],
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setAllCheckedInBooks: (state, action) => {
      state.allCheckedInBooks = [];
      state.allCheckedInBooks = action.payload;
    },
    setAllBooks: (state, action) => {
      state.allBooks = [];
      state.allBooks = action.payload;
    },
  },
});

export const { setAllCheckedInBooks, setAllBooks } = bookSlice.actions;

export default bookSlice.reducer;
