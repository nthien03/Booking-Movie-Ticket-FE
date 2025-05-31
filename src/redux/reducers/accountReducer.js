// src/redux/reducers/accountReducer.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '../../utils/api';

// Async thunk để gọi API lấy thông tin tài khoản
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await callFetchAccount();
            // Kiểm tra code thành công từ API
            if (response.code === 1000) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'API error');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

// Khởi tạo state mặc định cho account
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: '',
    user: {
        id: '',
        username: '',
        fullName: '',
        role: {
            id: '',
            roleName: '', // Đúng với API response
            description: '',
            status: false,
            permissions: [],
        },
    },
    activeMenu: 'home',
    error: null, // Thêm để handle lỗi
};

const accountReducer = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        // Cập nhật để đúng với cấu trúc API
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            const payload = action.payload || {};

            state.user.id = payload.id || '';
            state.user.username = payload.username || '';
            state.user.fullName = payload.fullName || '';

            // Cập nhật role đúng với API structure
            if (payload.role) {
                state.user.role = {
                    id: payload.role.id || '',
                    roleName: payload.role.roleName || '', // Đúng field name
                    description: payload.role.description || '',
                    status: payload.role.status || false,
                    permissions: payload.role.permissions || [],
                };
            }
        },
        // Fix logout để reset đúng structure
        setLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.user = {
                id: '',
                username: '', // Đúng field name
                fullName: '', // Đúng field name
                role: {
                    id: '',
                    roleName: '', // Đúng field name
                    description: '',
                    status: false,
                    permissions: [],
                },
            };
        },
        setRefreshTokenAction: (state, action) => {
            const payload = action.payload || {};
            state.isRefreshToken = payload.status || false;
            state.errorRefreshToken = payload.message || '';
        },
        // Thêm action để clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.isAuthenticated = false; // Cần reset cho F5/App initialization
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            const payload = action.payload || {};
            const user = payload.user || {};

            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            // Map đúng với API response structure
            state.user.id = user.id || '';
            state.user.username = user.username || '';
            state.user.fullName = user.fullName || '';

            // Map role đúng với API response
            if (user.role) {
                state.user.role = {
                    id: user.role.id || '',
                    roleName: user.role.roleName || '', // Đúng field name từ API
                    description: user.role.description || '',
                    status: user.role.status || false,
                    permissions: user.role.permissions || [],
                };
            }
        });

        builder.addCase(fetchAccount.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload || 'Failed to fetch account';
        });
    },
});

export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
    clearError,
} = accountReducer.actions;

export default accountReducer.reducer;