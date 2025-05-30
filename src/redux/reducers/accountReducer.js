

// src/redux/reducers/accountReducer.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '../../utils/api'; // Hàm gọi API lấy thông tin user

// Async thunk để gọi API lấy thông tin tài khoản
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data; // Giả sử response.data chứa thông tin user
    }
);

// Khởi tạo state mặc định cho account
const initialState = {
    isAuthenticated: false,  // Trạng thái đã đăng nhập hay chưa
    isLoading: true,         // Trạng thái đang tải thông tin tài khoản
    isRefreshToken: false,   // Trạng thái làm mới token
    errorRefreshToken: '',   // Lỗi nếu có khi refresh token
    user: {
        id: '',
        username: '',
        fullName: '',
        role: {
            id: '',
            roleName: '',
            permissions: [], // Danh sách quyền của user (mảng object)
        },
    },
    activeMenu: 'home', // Mục menu đang active trong giao diện
};

const accountReducer = createSlice({
    name: 'account',
    initialState,
    reducers: {
        // Set menu đang active (thường dùng để highlight menu trong UI)
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        // Cập nhật thông tin user khi đăng nhập thành công
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;

            const payload = action.payload || {};

            state.user.id = payload.id || '';
            state.user.username = payload.username || '';
            state.user.fullName = payload.fullName || '';

            // Cập nhật role và quyền hạn
            state.user.role = payload.role || { id: '', roleName: '', permissions: [] };

            // Đảm bảo permissions là mảng, tránh undefined
            state.user.role.permissions = (payload.role && payload.role.permissions) || [];
        },
        // Logout: xóa access_token, reset trạng thái user
        setLogoutAction: (state) => {
            localStorage.removeItem('access_token'); // Xóa token khỏi localStorage
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = {
                id: '',
                email: '',
                name: '',
                role: {
                    id: '',
                    name: '',
                    permissions: [],
                },
            };
        },
        // Cập nhật trạng thái refresh token và lỗi nếu có
        setRefreshTokenAction: (state, action) => {
            const payload = action.payload || {};
            state.isRefreshToken = payload.status || false;
            state.errorRefreshToken = payload.message || '';
        },
    },
    extraReducers: (builder) => {
        // Khi bắt đầu gọi API fetchAccount
        builder.addCase(fetchAccount.pending, (state) => {
            state.isLoading = true;
            // Có thể reset trạng thái đăng nhập tạm thời khi load lại
            state.isAuthenticated = false;
        });

        // Khi fetchAccount thành công
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            const payload = action.payload || {};
            state.isAuthenticated = true;
            state.isLoading = false;

            state.user.id = payload.user?.id || '';
            state.user.email = payload.user?.email || '';
            state.user.name = payload.user?.name || '';

            state.user.role = payload.user?.role || { id: '', name: '', permissions: [] };
            state.user.role.permissions = payload.user?.role?.permissions || [];
        });

        // Khi fetchAccount thất bại
        builder.addCase(fetchAccount.rejected, (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            // Có thể thêm xử lý lỗi ở đây nếu muốn
        });
    },
});

// Export actions để dispatch
export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
} = accountReducer.actions;

// Export reducer để đưa vào store
export default accountReducer.reducer;
