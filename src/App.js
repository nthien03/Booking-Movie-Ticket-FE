import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { history } from './utils/history'
import AdminTemplate from './templates/AdminTemplate/AdminTemplate'
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import UserTemplate from './templates/UserTemplate/UserTemplate';
import Home from './pages/User/Home';
import InforUser from './pages/User/InforUser';
import Detail from './pages/User/Detail';
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
import { fetchAccount } from './redux/reducers/accountReducer';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BookingPage from './pages/User/BookingPage';
import BookingManagement from './pages/Admin/Booking/BookingManagement';
import BookingHistory from './pages/User/BookingHistory';
import UserInfo from './pages/User/UserInfo';
function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            dispatch(fetchAccount());
        }
    }, [dispatch]);

    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path='/' element={<UserTemplate />}>
                    <Route index path='/' element={<Home />} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='notfound' element={<NotFound />} />
                    <Route path='detail/:id' element={<Detail />} />
                    <Route path='movies/:id' element={<MovieDetail />} />
                    <Route path='info' element={<UserInfo />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                    <Route path='booking' element={<BookingPage />} />
                    <Route path='bookings/history' element={<BookingHistory />} />
                </Route>
                <Route path='/admin' element={<AdminTemplate />}>
                    {/* <Route path='/admin' index element={<Dashboard />} /> */}
                    <Route index element={<Dashboard />} />
                    <Route path='user' element={<Users />} />
                    <Route path='user/addnewuser' element={<AddNewUser />} />

                    <Route path='user/edit/:taiKhoan' element={<EditUser />} />

                    <Route path='movie' element={<Film />} />
                    <Route path='room' element={<RoomManagement />} />
                    <Route path='genres' element={<GenreManagement />} />

                    <Route path='schedule' element={<ScheduleManagement />} />
                    <Route path='bookings' element={<BookingManagement />} />

                </Route>
            </Routes>
        </HistoryRouter>
    );
}
export default App;
