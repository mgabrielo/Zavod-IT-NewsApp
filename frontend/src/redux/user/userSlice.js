import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    authError: null,
    loading: false,
    isAuthenticated: false,
    totalUsers: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signUpStart: (state) => {
            state.loading = true
            state.authError = null
            state.isAuthenticated = false
        },
        signUpSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.authError = null
            state.isAuthenticated = true
        },
        signUpFailure: (state, action) => {
            state.authError = action.payload
            state.loading = false
            state.isAuthenticated = false
        },
        signInStart: (state) => {
            state.loading = true
            state.authError = null
            state.isAuthenticated = false
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.authError = null
            state.isAuthenticated = true
        },
        signInFailure: (state, action) => {
            state.authError = action.payload
            state.loading = false
            state.currentUser = null
            state.isAuthenticated = false
        },
        clearAuthError: (state) => {
            state.authError = null
            state.currentUser = null
            state.error = null
        },
        saveUserDetailsStart: (state) => {
            state.loading = true
            state.error = null
        },
        saveUserDetailsSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.isAuthenticated = true
        },
        saveUserDetailsFailure: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
        },
        signOutUserStart: (state) => {
            state.loading = true
            state.authError = null
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.authError = null
            state.error = null
            state.isAuthenticated = false
        },
        signOutUserFailure: (state, action) => {
            state.authError = action.payload
            state.loading = false
            state.isAuthenticated = false
        },
        setTotatUsers: (state, action) => {
            state.totalUsers = action.payload
            state.loading = false
            state.isAuthenticated = true
            state.authError = null
        }
    }
});

export const {
    signUpStart,
    signUpSuccess,
    signUpFailure,
    signInStart,
    signInSuccess,
    signInFailure,
    saveUserDetailsStart,
    saveUserDetailsSuccess,
    saveUserDetailsFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
    clearAuthError,
    setTotatUsers
} = userSlice.actions

export default userSlice.reducer