// import React, { Fragment, useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Tabs } from 'antd'
// import moment from 'moment'
// import _ from "lodash";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faXmark, faUserTag } from '@fortawesome/free-solid-svg-icons'
// import useRoute from '../../hooks/useRoute'
// import { LOCALSTORAGE_USER } from '../../utils/constant'
// import { getLocalStorage, SwalConfig } from '../../utils/config'
// import LoadingPage from '../LoadingPage'
// import { LayDanhSachPhongVeService, DatVe } from '../../services/BookingManager'
// import { datGhe, layDanhSachPhongVe, xoaDanhSachGheDangDat } from '../../redux/reducers/BookingReducer'
// import { ThongTinDatVe } from '../../_core/models/ThongTinDatVe'
// import { callApiThongTinNguoiDung, setUserInfor } from '../../redux/reducers/UserReducer'
// import { LayThongTinTaiKhoan } from '../../services/UserService'



// const BookingTicket = (thongTinNguoiDung, id, setIsLoading) => {

//     const dispatch = useDispatch()
//     const { danhSachGhe, thongTinPhim } = useSelector(state => state.BookingReducer.chiTietPhongVe)
//     const { danhSachGheDangDat } = useSelector(state => state.BookingReducer)
//     const renderSeats = () => {
//         return danhSachGhe.map((itemGhe, index) => {
//             let sizeScreen = window.screen.width
//             let size = 16
//             let classGheVip = itemGhe.loaiGhe == 'Vip' ? 'gheVip' : ''
//             let classGheDaDat = itemGhe.daDat == true ? 'gheDaDat' : ''
//             let classGheDangDat = ''
//             let daDat = itemGhe.daDat ? true : false

//             // kiểm tra ghế trong danh sách có trùng với ghế trong danh sách ghế đang đặt ko? -> set css cho ghế đang đặt
//             const indexGheDangDat = danhSachGheDangDat.findIndex(itemGheDangDat => itemGheDangDat.maGhe == itemGhe.maGhe)
//             if (indexGheDangDat !== -1) {
//                 classGheDangDat = 'gheDangDat'
//             }
//             // kiểm tra taiKhoan của account này có trùng với taiKhoan của ghế nào ko ? -> set css cho ghế dc account này đặt
//             let classGheDaDuocTaiKhoanDat = ''
//             if (thongTinNguoiDung.taiKhoan == itemGhe.taiKhoanNguoiDat) {
//                 classGheDaDuocTaiKhoanDat = 'gheDaDuocTaiKhoanNayDat'
//             }
//             console.log(sizeScreen)
//             if (1092 < sizeScreen && sizeScreen <= 1247) {
//                 console.log('con me no')
//                 size = 14
//             }
//             if (783 < sizeScreen && sizeScreen <= 1092) {
//                 console.log('con me no')
//                 size = 12
//             }
//             if (650 < sizeScreen && sizeScreen <= 783) {
//                 size = 10
//             }
//             if (530 < sizeScreen && sizeScreen <= 650) {
//                 size = 8
//             }
//             if (390 < sizeScreen && sizeScreen <= 530) {
//                 size = 6
//             }
//             if (sizeScreen <= 390) {
//                 size = 4
//             }

//             return <Fragment key={index}>
//                 <button disabled={daDat} onClick={() => dispatch(datGhe(itemGhe))}
//                     className={`ghe ${classGheVip} ${classGheDaDat} ${classGheDangDat} ${classGheDaDuocTaiKhoanDat}`}>
//                     {itemGhe.daDat ? classGheDaDuocTaiKhoanDat == '' ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faUserTag} /> : itemGhe.stt}
//                 </button>
//                 {(index + 1) % size == 0 ? <br /> : ''}
//             </Fragment>
//         })
//     }

//     const callApiDatVe = async () => {
//         try {
//             // tạo 1 thongTinDatVe thông qua đối tượng tạo sẵn (gồm maLichChieu và danhSachGhe), do backEnd yêu cầu phải gửi như thế
//             // bên cạnh đó, khi gửi nếu ghế ko có dữ liệu thì vẫn có thông tin, ko bị lỗi ko đáng có
//             const thongTinDatVe = new ThongTinDatVe()
//             thongTinDatVe.maLichChieu = id
//             thongTinDatVe.danhSachVe = danhSachGheDangDat
//             // trong lúc pending thì gọi loading page
//             setIsLoading(true)
//             // gọi tới service DatVe với tham số là thongTinDatVe
//             await DatVe(thongTinDatVe)
//             // hiển thị alert thông báo thành công
//             SwalConfig('Đặt vé thành công', 'success')
//             // xóa các ghế trong danh sách ghế đang đặt
//             dispatch(xoaDanhSachGheDangDat())
//             // đặt vé thành công thì gọi api để load lại phòng vé 
//             const result = await LayDanhSachPhongVeService(id)
//             dispatch(layDanhSachPhongVe(result.data.content))
//             // load lại lịch sử ghế đã đặt của account này luôn, vì lịch sử đặt dc trả về từ ThongTinTaiKhoan
//             const apiNguoiDung = await LayThongTinTaiKhoan()
//             dispatch(setUserInfor(apiNguoiDung.data.content))
//             // khi xong hết thì dừng trạng thái loading page
//             setIsLoading(false)
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     return (
//         <div className='min-h-[100vh]'>
//             <div className="grid grid-cols-12 z-[1] pb-2">
//                 <div className="col-span-12 xl:col-span-10 2xl:col-span-9">
//                     <div className='flex justify-center relative mb-2'>
//                         <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[2] uppercase font-bold tracking-wider text-white'>Screen</div>
//                         <div className='trapezoid'></div>
//                     </div>
//                     <div className='text-center'>
//                         {renderSeats()}
//                     </div>
//                     <div className='mt-5 md:flex md:justify-center hidden'>
//                         <table className='divide-y divide-gray-200 w-full'>
//                             <thead className='bg-gray-50 p-5'>
//                                 <tr>
//                                     <th>Ghế đã đặt</th>
//                                     <th>Ghế thường</th>
//                                     <th>Ghế vip</th>
//                                     <th>Ghế đang chọn</th>
//                                     <th>Ghế được tài khoản này đặt</th>
//                                 </tr>
//                             </thead>
//                             <tbody className='bg-white divide-y divide-gray-200'>
//                                 <tr className='text-center'>
//                                     <td><button className='ghe gheDaDat'><FontAwesomeIcon icon={faXmark} /></button></td>
//                                     <td><button className='ghe'></button></td>
//                                     <td><button className='ghe gheVip'></button></td>
//                                     <td><button className='ghe gheDangDat'></button></td>
//                                     <td>
//                                         <button className='ghe gheDaDuocTaiKhoanNayDat'>
//                                             <FontAwesomeIcon icon={faUserTag} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//                 <div className="col-span-12 xl:col-span-2 2xl:col-span-3">
//                     <h3 className='text-orange-500 text-center text-2xl'>
//                         {danhSachGheDangDat.reduce((tong, ghe) => {
//                             return tong += ghe.giaVe
//                         }, 0).toLocaleString()} VND
//                     </h3>
//                     <hr />
//                     <div className='my-5'>
//                         <h3 className='text-lg mb-2 tracking-wide font-semibold'>{thongTinPhim.tenPhim}</h3>
//                         <p className='mb-2'>{thongTinPhim.tenCumRap} - {thongTinPhim.tenRap}</p>
//                         <p className='mb-2'>Địa điểm: {thongTinPhim.diaChi}</p>
//                         <p>Ngày chiếu: {thongTinPhim.ngayChieu} </p>
//                     </div>
//                     <hr />
//                     <div className="flex flex-row my-5 items-center">
//                         <div className='flex flex-wrap items-center '>
//                             <span className='text-black font-semibold text-lg'>Ghế: </span>
//                             {_.sortBy(danhSachGheDangDat, ['stt'])?.map((itemGheDangChon, indexGheDangChon) =>
//                                 <span key={indexGheDangChon} className='mb-2 text-orange-600 font-semibold text-lg mx-1 border-2 px-2 border-orange-100'>{itemGheDangChon.stt}</span>)}
//                         </div>
//                     </div>
//                     <hr />
//                     <div className='my-5'>
//                         <h2>Email</h2>
//                         {thongTinNguoiDung.email}
//                     </div>
//                     <hr />
//                     <div className='my-5'>
//                         <h2>Phone</h2>
//                         {thongTinNguoiDung.soDT}
//                     </div>
//                     <hr />
//                     <div className='mb-0 cursor-pointer'>
//                         <div onClick={() => {
//                             if (danhSachGheDangDat == '') {
//                                 return SwalConfig('Vui lòng chọn ghế', 'warning', true)
//                             }
//                             else {
//                                 callApiDatVe()
//                             }
//                         }} className='bg-orange-400 hover:bg-orange-600 text-white w-full text-center py-3 font-bold text-xl'>
//                             ĐẶT VÉ
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// const KetQuaDatVe = (thongTinNguoiDung) => {
//     const renderTicketItem = () => {
//         return thongTinNguoiDung.thongTinDatVe?.map((item, index) => {
//             return <div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
//                 <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
//                     <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={item.hinhAnh} />
//                     <div className="flex-grow">
//                         <h2 className="text-gray-900 title-font font-medium">{item.tenPhim}</h2>
//                         <h2 className="text-gray-700 title-font font-medium">{_.first(item.danhSachGhe).tenHeThongRap} - {_.first(item.danhSachGhe).tenCumRap}</h2>
//                         <p className="text-gray-500">Ngày đặt: {moment(item.ngayDat).format('DD-MM-YYYY ~ hh:MM:A')}</p>
//                         <p className="text-gray-500">Thời lượng: {item.thoiLuongPhim} phút</p>
//                         <p>Ghế: {item.danhSachGhe.map((ghe, iGhe) => {
//                             return <button key={iGhe} className='mb-2 text-orange-600 font-semibold text-lg mx-1 px-1 border-orange-100'>{ghe.tenGhe}</button>
//                         })}</p>
//                     </div>
//                 </div>
//             </div>
//         })
//     }
//     return <div>
//         <section className="text-gray-600 body-font">
//             <div className="container px-5 py-10 mx-auto">
//                 <div className="flex flex-col text-center w-full mb-10">
//                     <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 uppercase">lịch sử đặt vé khách hàng</h1>
//                 </div>
//                 <div className="flex flex-wrap -m-2">
//                     {renderTicketItem()}
//                 </div>
//             </div>
//         </section>
//     </div>
// }

// export default () => {
//     const { thongTinNguoiDung } = useSelector(state => state.UserReducer)
//     const dispatch = useDispatch()
//     const [isLoading, setIsLoading] = useState(true)
//     const { param, navigate } = useRoute()

//     useEffect(() => {
//         // if (!getLocalStorage(LOCALSTORAGE_USER)) {
//         //     navigate('/login')
//         // }
//         // else {
//         //     dispatch(callApiThongTinNguoiDung)
//         //     const callApiPhongVe = async () => {
//         //         const result = await LayDanhSachPhongVeService(param.id)
//         //         dispatch(layDanhSachPhongVe(result.data.content))
//         //         setIsLoading(false)
//         //     }
//         //     callApiPhongVe()
//         // }
//         // return () => {
//         //     dispatch(xoaDanhSachGheDangDat())
//         // }
//     }, [])

//     const items = [
//         { label: '01. CHỌN GHẾ & ĐẶT VÉ', key: 1, children: BookingTicket(thongTinNguoiDung, param.id, setIsLoading) },
//         { label: '02. KẾT QUẢ ĐẶT VÉ', key: 2, children: KetQuaDatVe(thongTinNguoiDung) },
//     ];
//     return <>
//         {isLoading ? <LoadingPage /> : <Tabs className='mt-[6rem]  pb-2 min-h-[100vh] booking' items={items} />}
//     </>;
// }

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

export default function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ state navigation
    const { schedule, movie } = location.state || {};

    const [activeTab, setActiveTab] = useState('seat-selection');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Redirect nếu không có dữ liệu
    useEffect(() => {
        if (!schedule || !movie) {
            navigate('/');
            return;
        }

        // Fetch seats data
        fetchSeats();
    }, [schedule, movie, navigate]);

    const fetchSeats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/seats/room/${schedule.room.id}`);

            if (response.data.code === 1000) {
                // Transform API data to match component format
                const transformedSeats = response.data.data.map(seat => ({
                    id: seat.id,
                    seat_number: `${seat.seatRow}${seat.seatNumber}`,
                    row: seat.seatRow,
                    price: seat.price,
                    status: seat.status ? 'available' : 'booked',
                    seat_type: seat.seatType.seatTypeName === 'Thường' ? 'Standard' : 'VIP'
                }));

                setSeats(transformedSeats);
            } else {
                setError('Không thể tải dữ liệu ghế');
            }
        } catch (err) {
            console.error('Error fetching seats:', err);
            setError('Lỗi kết nối với server');
        } finally {
            setLoading(false);
        }
    };

    // Nhóm ghế theo hàng
    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const sortedRows = Object.keys(groupedSeats).sort();

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked') return;

        setSelectedSeats(prev => {
            const isSelected = prev.find(s => s.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.id !== seat.id);
            } else {
                return [...prev, seat];
            }
        });
    };

    const getSeatButtonClass = (seat) => {
        const baseClass = "w-8 h-8 text-xs font-medium rounded border-2 transition-all duration-200 ";
        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (seat.status === 'booked') {
            return baseClass + "bg-red-500 border-red-600 text-white cursor-not-allowed";
        }

        if (isSelected) {
            return baseClass + "bg-green-500 border-green-600 text-white shadow-lg";
        }

        if (seat.seat_type === 'VIP') {
            return baseClass + "bg-yellow-200 border-yellow-400 text-yellow-800 hover:bg-yellow-300";
        }

        return baseClass + "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200";
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleBookSeats = () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ghế!');
            return;
        }
        setActiveTab('payment');
    };

    const handlePayment = () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán!');
            return;
        }

        alert(`Thanh toán thành công!\nPhim: ${movie.movieName}\nGhế: ${selectedSeats.map(s => s.seat_number).join(', ')}\nTổng tiền: ${formatPrice(totalPrice)}\nPhương thức: ${paymentMethod}`);
    };

    const paymentMethods = [
        { id: 'momo', name: 'Ví MoMo', icon: '📱' },
        { id: 'zalopay', name: 'ZaloPay', icon: '💳' },
        { id: 'vnpay', name: 'VNPay', icon: '🏦' },
        { id: 'cash', name: 'Tiền mặt tại quầy', icon: '💵' }
    ];

    // Show loading or error states
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu ghế...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">Đặt Vé Xem Phim</h1>
                    <p className="text-gray-600 mt-1">{movie.movieName}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('seat-selection')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'seat-selection'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        1. Chọn Ghế
                    </button>
                    <button
                        onClick={() => selectedSeats.length > 0 && setActiveTab('payment')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'payment'
                            ? 'border-blue-500 text-blue-600'
                            : selectedSeats.length > 0
                                ? 'border-transparent text-gray-500 hover:text-gray-700'
                                : 'border-transparent text-gray-300 cursor-not-allowed'
                            }`}
                        disabled={selectedSeats.length === 0}
                    >
                        2. Thanh Toán
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'seat-selection' && (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        {/* Movie Info */}
                        <div className="mb-8 pb-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{movie.movieName}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>📅 {dayjs(schedule.date).format('DD/MM/YYYY')}</span>
                                <span>🕐 {dayjs(schedule.startTime).format('HH:mm')}</span>
                                <span>🏠 {schedule.room.room_name}</span>
                                <span>⏱️ {movie.duration} phút</span>
                                <span>🎭 {movie.genres?.join(', ')}</span>
                            </div>
                        </div>

                        {/* Screen */}
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-3 rounded-full mb-3 mx-auto max-w-md"></div>
                            <p className="text-center text-sm text-gray-600 font-medium">MÀN HÌNH</p>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mb-8 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-blue-100 border-2 border-blue-300 rounded"></div>
                                <span>Ghế thường</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
                                <span>Ghế VIP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 border-2 border-green-600 rounded"></div>
                                <span>Đã chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-500 border-2 border-red-600 rounded"></div>
                                <span>Đã đặt</span>
                            </div>
                        </div>

                        {/* Seat Map */}
                        <div className="mb-8">
                            {sortedRows.map(row => (
                                <div key={row} className="flex items-center justify-center gap-2 mb-4">
                                    <span className="w-8 text-center font-bold text-gray-700 text-lg">{row}</span>
                                    <div className="flex gap-2">
                                        {groupedSeats[row]
                                            .sort((a, b) => parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1)))
                                            .map(seat => (
                                                <button
                                                    key={seat.id}
                                                    onClick={() => handleSeatClick(seat)}
                                                    className={getSeatButtonClass(seat)}
                                                    disabled={seat.status === 'booked'}
                                                    title={`${seat.seat_number} - ${seat.seat_type} - ${formatPrice(seat.price)}`}
                                                >
                                                    {seat.seat_number.slice(1)}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Info */}
                        {selectedSeats.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium text-gray-700">Ghế đã chọn:</span>
                                    <span className="text-blue-600 font-medium">
                                        {selectedSeats.map(seat => seat.seat_number).join(', ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Tổng tiền:</span>
                                    <span className="text-2xl font-bold text-red-600">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Book Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleBookSeats}
                                disabled={selectedSeats.length === 0}
                                className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${selectedSeats.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {selectedSeats.length === 0 ? 'Chọn ghế để tiếp tục' : 'Đặt Ghế'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'payment' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Movie & Booking Info */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Thông Tin Đặt Vé</h3>

                            {/* Movie Info */}
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <h4 className="font-medium text-gray-800 mb-3">Thông tin phim</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tên phim:</span>
                                        <span className="font-medium">{movie.movieName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Suất chiếu:</span>
                                        <span className="font-medium">
                                            {dayjs(schedule.date).format('DD/MM/YYYY')} - {dayjs(schedule.startTime).format('HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phòng:</span>
                                        <span className="font-medium">{schedule.room.room_name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-3">Thông tin thanh toán</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ghế:</span>
                                        <span className="font-medium">{selectedSeats.map(seat => seat.seat_number).join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-800 font-medium">Tổng tiền:</span>
                                        <span className="font-bold text-red-600">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <h4 className="font-medium text-gray-800 mb-4">Chọn phương thức thanh toán</h4>
                                <div className="space-y-3">
                                    {paymentMethods.map(method => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="mr-3"
                                            />
                                            <span className="text-2xl mr-3">{method.icon}</span>
                                            <span className="font-medium">{method.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Tóm Tắt Đơn Hàng</h3>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span>Số lượng ghế:</span>
                                    <span>{selectedSeats.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng tiền vé:</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Thành tiền:</span>
                                        <span className="text-red-600">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!paymentMethod}
                                className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${!paymentMethod
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                Thanh Toán
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
