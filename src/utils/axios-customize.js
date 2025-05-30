import axios from "axios";
import { store } from "./redux/store"; // sửa đường dẫn nếu cần
import { setRefreshTokenAction } from "./redux/slice/accountSlide"; // sửa đường dẫn nếu cần
import { notification } from "antd";
import { Mutex } from "async-mutex";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, // file .env của mày phải có biến này
    withCredentials: true, // nếu backend không dùng cookie thì bỏ dòng này
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get("/api/v1/auth/refresh");
        if (res && res.data) return res.data.access_token;
        else return null;
    });
};

instance.interceptors.request.use(function (config) {
    if (
        typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("access_token")
    ) {
        config.headers.Authorization =
            "Bearer " + window.localStorage.getItem("access_token");
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});

instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        const response = error.response;
        const config = error.config;

        if (
            config &&
            response &&
            response.status === 401 &&
            config.url !== "/api/v1/auth/login" &&
            !config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            config.headers[NO_RETRY_HEADER] = "true";
            if (access_token) {
                config.headers["Authorization"] = `Bearer ${access_token}`;
                localStorage.setItem("access_token", access_token);
                return instance.request(config);
            }
        }

        if (
            config &&
            response &&
            response.status === 400 &&
            config.url === "/api/v1/auth/refresh" &&
            window.location.pathname.startsWith("/admin")
        ) {
            const message = response?.data?.error || "Có lỗi xảy ra, vui lòng login.";
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        if (response && response.status === 403) {
            notification.error({
                message: response?.data?.message || "",
                description: response?.data?.error || "",
            });
        }

        return Promise.reject(error);
    }
);

export default instance;
