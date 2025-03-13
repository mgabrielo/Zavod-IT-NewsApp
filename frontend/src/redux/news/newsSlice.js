import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    news: [],
    newsLoading: false,
    newsError: null,
    newsTotal: 0,
    totalTags: 0
}

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        getAllNewsStart: (state) => {
            state.news = []
            state.newsLoading = true
            state.newsError = null
        },
        getAllNewsSuccess: (state, action) => {
            state.news = action.payload
            state.newsLoading = false
            state.newsError = null
        },
        getAllNewsFailure: (state, action) => {
            state.news = []
            state.newsLoading = false
            state.newsError = action.payload
        },
        setNewsTotal: (state, action) => {
            state.newsTotal = action.payload
            state.newsError = null
            state.newsLoading = false
        },
        setNewsTotalTags: (state, action) => {
            state.totalTags = action.payload
        }
    }
})

export const {
    getAllNewsStart,
    getAllNewsSuccess,
    getAllNewsFailure,
    setNewsTotal,
    setNewsTotalTags
} = newsSlice.actions

export default newsSlice.reducer