import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminTemplate from './templates/AdminTemplate/AdminTemplate'
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import UserTemplate from './templates/UserTemplate/UserTemplate';
import Home from './pages/User/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Admin/Dashboard';
import Film from './pages/Admin/Film/Film';
import Users from './pages/Admin/Users/Users'
import AddNewUser from './pages/Admin/Users/AddNewUser';
import EditUser from './pages/Admin/Users/EditUser';
import ScheduleManagement from './pages/Admin/Schedule/ScheduleManagement';
import MovieDetail from './pages/User/MovieDetail';
import RoomManagement from './pages/Admin/Room/RoomManagement';
import GenreManagement from './pages/Admin/Genre/GenreManagement';
import { fetchAccount, setRefreshTokenAction } from './redux/reducers/accountReducer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookingPage from './pages/User/BookingPage';
import BookingManagement from './pages/Admin/Booking/BookingManagement';
import BookingHistory from './pages/User/BookingHistory';
import UserInfo from './pages/User/UserInfo';
import { message } from 'antd';
import PaymentResultPage from './pages/User/PaymentResultPage';

// Router configuration
const router = createBrowserRouter([
    {
        path: '/',
        element: <UserTemplate />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'movies/:id',
                element: <MovieDetail />
            },
            {
                path: 'info',
                element: <UserInfo />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'booking',
                element: <BookingPage />
            },
            {
                path: '/payment/result',
                element: <PaymentResultPage />
            },
            {
                path: 'booking/history',
                element: <BookingHistory />
            },
            {
                path: 'notfound',
                element: <NotFound />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminTemplate />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'user',
                element: <Users />
            },
            {
                path: 'user/addnewuser',
                element: <AddNewUser />
            },
            {
                path: 'user/edit/:taiKhoan',
                element: <EditUser />
            },
            {
                path: 'movie',
                element: <Film />
            },
            {
                path: 'room',
                element: <RoomManagement />
            },
            {
                path: 'genres',
                element: <GenreManagement />
            },
            {
                path: 'schedule',
                element: <ScheduleManagement />
            },
            {
                path: 'bookings',
                element: <BookingManagement />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

function App() {
    const dispatch = useDispatch();
    const isRefreshToken = useSelector(state => state.account.isRefreshToken);
    const errorRefreshToken = useSelector(state => state.account.errorRefreshToken);

    // Handle refresh token error
    useEffect(() => {
        if (isRefreshToken === true) {
            localStorage.removeItem('access_token');
            message.error(errorRefreshToken);
            dispatch(setRefreshTokenAction({ status: false, message: "" }));
            window.location.href = '/login';
        }
    }, [isRefreshToken, errorRefreshToken, dispatch]);

    // Fetch account info on app load (except for login/register pages)
    useEffect(() => {
        const excludedPaths = ['/login', '/register'];

        if (excludedPaths.includes(window.location.pathname)) {
            return;
        }

        dispatch(fetchAccount());
    }, [dispatch]);

    return <RouterProvider router={router} />;
}

export default App;