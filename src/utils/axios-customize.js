import axios from "axios";
import { setRefreshTokenAction } from '../redux/reducers/accountReducer'; // Import action để xử lý refresh token lỗi
import { notification } from "antd"; // Dùng để hiển thị thông báo
import { Mutex } from "async-mutex"; // Dùng Mutex để tránh gọi refresh token nhiều lần cùng lúc

let reduxStore = null;

export const injectStore = (_store) => {
    reduxStore = _store;
};


// Tạo instance Axios với cấu hình mặc định
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // URL backend được lấy từ file .env
    withCredentials: true, // Gửi cookie kèm theo nếu cần thiết (CSRF protection, session-based auth)
});

const mutex = new Mutex(); // Mutex để đảm bảo refresh token chỉ được gọi 1 lần tại một thời điểm
const NO_RETRY_HEADER = "x-no-retry"; // Header này dùng để đánh dấu request không được retry nữa sau khi đã retry 1 lần

// Hàm xử lý gọi API refresh token
const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get("/api/v1/auth/refresh"); // Gọi API refresh
        if (res && res.data) return res.data.access_token; // Trả về access_token mới nếu thành công
        else return null;
    });
};

// Interceptor xử lý trước khi gửi request đi
instance.interceptors.request.use(function (config) {
    // Nếu có access_token trong localStorage thì thêm vào header Authorization
    if (
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
    (res) => res.data, // Trả về trực tiếp data nếu response thành công
    async (error) => {
        const response = error.response;
        const config = error.config;

        // Nếu lỗi là 401 (Unauthorized) và không phải đang login, và chưa retry
        if (
            config &&
            response &&
            response.status === 401 &&
            config.url !== "/api/v1/auth/login" &&
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
                return instance.request(config); // Retry lại request với token mới
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
            reduxStore.dispatch(setRefreshTokenAction({ status: true, message })); // Cập nhật Redux yêu cầu login lại
        }

        // Nếu lỗi là 403 (Forbidden), hiện thông báo lỗi
        if (response && response.status === 403) {
            notification.error({
                message: response?.data?.message || "", // Tiêu đề
                description: response?.data?.error || "", // Nội dung
            });
        }

        return Promise.reject(error); // Trả lỗi về cho hàm gọi xử lý
    }
);

export default instance; // Xuất ra instance để dùng trong các nơi khác
