import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    news: [],
    newsLoading: false,
    newsError: null,
    newsTotal: 0,
    totalTags: 0,
    likeCount: 0,
    likeId: null,
    dislikeCounts: 0,
    dislikeId: null,
    tagParams: null,
    totalLikes: 0,
    totalDisLikes: 0
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
        },
        setLikeCount: (state, action) => {
            state.likeCount = state.news.reduce((acc, item) => (item.likes + action.payload || 0), 0);
        },
        setLikeId: (state, action) => {
            if (action.payload) {
                state.likeId = action.payload
            } else {
                state.likeId = 0
            }
        },
        setDislikeId: (state, action) => {
            state.dislikeId = action.payload
        },
        setDislikeCounts: (state, action) => {
            state.dislikeCounts = action.payload
        },
        setTagParams: (state, action) => {
            state.tagParams = action.payload
        },
        removeTagParams: (state) => {
            state.tagParams = null
        },
        setTotalLikes: (state, action) => {
            state.totalLikes = action.payload
        },
        setTotalDisLikes: (state, action) => {
            state.totalDisLikes = action.payload
        }
    }
})

export const {
    getAllNewsStart,
    getAllNewsSuccess,
    getAllNewsFailure,
    setNewsTotal,
    setNewsTotalTags,
    setLikeCount,
    setDislikeCounts,
    setLikeId,
    setDislikeId,
    setTagParams,
    removeTagParams,
    setTotalLikes,
    setTotalDisLikes
} = newsSlice.actions

export default newsSlice.reducer