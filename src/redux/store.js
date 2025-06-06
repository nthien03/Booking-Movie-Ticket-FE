import { configureStore } from "@reduxjs/toolkit";
import BannerReducer from './reducers/BannerReducer';
import UserReducer from './reducers/UserReducer';
import FilmReducer from "./reducers/FilmReducer";
import CinemaReducer from "./reducers/CinemaReducer";
import BookingReducer from "./reducers/BookingReducer";
import accountReducer from "./reducers/accountReducer"; // nếu có

export const store = configureStore({
    reducer: {
        BannerReducer,
        UserReducer,
        FilmReducer,
        CinemaReducer,
        BookingReducer,
        account: accountReducer // thêm nếu đang dùng account
    }
});
