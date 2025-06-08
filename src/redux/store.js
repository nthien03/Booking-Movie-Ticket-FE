import { configureStore } from "@reduxjs/toolkit";
import BannerReducer from './reducers/BannerReducer';
import accountReducer from "./reducers/accountReducer";

export const store = configureStore({
    reducer: {
        BannerReducer,
        account: accountReducer // thêm nếu đang dùng account
    }
});
