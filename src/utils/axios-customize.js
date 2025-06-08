import axios from "axios";
import { setRefreshTokenAction } from '../redux/reducers/accountReducer';
import { notification } from "antd";
import { Mutex } from "async-mutex";

let reduxStore = null;

export const injectStore = (_store) => {
    reduxStore = _store;
};

// Tạo instance Axios với cấu hình mặc định
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

const mutex = new Mutex();

// Header này dùng để đánh dấu request không được retry nữa sau khi đã retry 1 lần
const NO_RETRY_HEADER = "x-no-retry";

// Hàm xử lý gọi API refresh token
const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get("/api/v1/auth/refresh");
        if (res && res.data) return res.data.access_token;
        else return null;
    });
};

// ✅ FIXED: Interceptor request - Loại trừ các endpoint không cần token
instance.interceptors.request.use(function (config) {
    // Danh sách các endpoint không cần token
    const publicEndpoints = [
        '/api/v1/auth/login',
        '/api/v1/auth/register',
        '/api/v1/auth/refresh'
    ];

    // Kiểm tra xem có phải endpoint public không
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
        config.url && config.url.includes(endpoint)
    );

    // Chỉ thêm token nếu KHÔNG phải endpoint public
    if (
        !isPublicEndpoint &&
        typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("access_token")
    ) {
        config.headers.Authorization =
            "Bearer " + window.localStorage.getItem("access_token");
    }

    // Nếu Content-Type đã được set mà chưa có Accept thì mặc định thêm Accept và charset
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return config;
});

// Interceptor xử lý sau khi nhận response hoặc khi có lỗi
instance.interceptors.response.use(
    (res) => res.data,   // Trả về trực tiếp data nếu response thành công 
    async (error) => {
        const response = error.response;
        const config = error.config;

        // Nếu lỗi là 401 (Unauthorized) và không phải đang login/register, và chưa retry
        if (
            config &&
            response &&
            response.status === 401 &&
            !config.url?.includes("/api/v1/auth/login") &&
            !config.url?.includes("/api/v1/auth/register") &&
            !config.headers[NO_RETRY_HEADER]
        ) {
            // Gọi refresh token
            const access_token = await handleRefreshToken();

            // Đánh dấu là đã retry để tránh lặp vô hạn
            config.headers[NO_RETRY_HEADER] = "true";

            if (access_token) {
                // Nếu có access token mới, lưu vào localStorage và retry request cũ
                config.headers["Authorization"] = `Bearer ${access_token}`;
                localStorage.setItem("access_token", access_token);
                return instance.request(config);  // Retry lại request với token mới
            }
        }

        // Nếu lỗi là 400 từ API refresh token, và đang ở trang admin thì yêu cầu login lại
        if (
            config &&
            response &&
            response.status === 400 &&
            config.url === "/api/v1/auth/refresh" &&
            window.location.pathname.startsWith("/admin")
        ) {
            const message = response?.data?.error || "Có lỗi xảy ra, vui lòng login.";
            // Cập nhật Redux yêu cầu login lại
            reduxStore.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        // Nếu lỗi là 403 (Forbidden), hiện thông báo lỗi
        if (response && response.status === 403) {
            notification.error({
                // Tiêu đề
                message: response?.data?.message || "",
                // Nội dung
                description: response?.data?.error || "",
            });
        }
        // Trả lỗi về cho hàm gọi xử lý
        return Promise.reject(error);
    }
);

export default instance;