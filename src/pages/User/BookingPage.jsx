import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { notification, Tabs, Descriptions, Radio } from 'antd';
import { callCreateBooking, callCreateTicket, callSeat, callVnpay } from '../../utils/api';
import { useSelector } from 'react-redux';


export default function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ state navigation
    const { schedule, movie } = location.state || {};

    // Lấy thông tin user từ Redux
    const user = useSelector(state => state.account.user);
    const userId = user?.id;

    const [activeTab, setActiveTab] = useState('seat-selection');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Payment states
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    // Redirect nếu không có dữ liệu
    useEffect(() => {
        if (!schedule || !movie) {
            navigate('/');
            return;
        }

        fetchSeats();
    }, [schedule, movie, navigate]);

    const fetchSeats = async () => {
        try {
            setLoading(true);
            const response = await callSeat(schedule.room.id, schedule.id);

            if (response.code === 1000) {
                // Chuyển đổi dữ liệu ghế về định dạng mong muốn
                const transformedSeats = response.data.map(seat => ({
                    id: seat.seatId,
                    seat_number: `${seat.seatRow}${seat.seatNumber}`,
                    row: seat.seatRow,
                    price: seat.price,
                    seat_type: seat.seatTypeName === 'Thường' ? 'Thường' : 'VIP',
                    status: seat.hold ? 'booked' : 'available',
                }));
                console.log('Fetched seats:', transformedSeats);

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

    // ===== PAYMENT FUNCTIONS =====

    const createBooking = async (paymentMethod) => {

        const seatIds = selectedSeats.map(seat => seat.id);
        const seatNumbers = selectedSeats.map(seat => seat.seat_number).join(', ');

        try {
            // Tạo booking
            const bookingResponse = await callCreateBooking(
                totalPrice,
                seatIds.length,
                userId,
                paymentMethod
            );
            if (bookingResponse.code !== 1000) {
                notification.error({
                    description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                    duration: 3,
                });
            }

            const bookingId = bookingResponse.data.id;
            const bookingCode = bookingResponse.data.bookingCode;

            // Tạo ticket cho từng ghế
            for (let seat of selectedSeats) {
                const ticketCode = bookingCode;
                const ticketRes = await callCreateTicket(
                    seat.price,
                    ticketCode,
                    false,
                    schedule.id,
                    seat.id,
                    bookingId
                );

                if (ticketRes.code !== 1000) {
                    console.error('Error creating ticket:', ticketRes.message);
                    notification.error({
                        description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                        duration: 3,
                    });
                }
            }
            return bookingResponse.data;

        } catch (error) {
            console.error('Create booking error:', error);
            notification.error({
                description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                duration: 3,
            });
        }
    };

    const createPaymentUrl = async (amount, orderId) => {
        try {
            const res = await callVnpay(amount, orderId);
            if (res.code !== 1000) {
                notification.error({
                    message: 'Lỗi thanh toán',
                    description: res.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
                    duration: 3,
                });
                console.error('VNPay error:', res.message);
            }
            return res.data;

        } catch (err) {
            console.error('VNPay error:', err);
            notification.error({
                message: 'Lỗi thanh toán',
                description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                duration: 3,
            });
        }
    };

    // Process VNPay payment
    const processVNPayPayment = async () => {
        setIsProcessingPayment(true);
        setPaymentError('');

        try {
            const bookingData = await createBooking(paymentMethod);

            const paymentData = await createPaymentUrl(totalPrice, bookingData.bookingCode);

            //Redirect to VNPay
            window.location.href = paymentData.paymentUrl;

        } catch (error) {
            notification.error({
                description: 'Có lỗi xảy ra trong quá trình thanh toán',
                duration: 3,
            });
            console.error('Payment error:', error);
            setIsProcessingPayment(false);
        }
    };

    // Process other payment methods (cash, card, etc.)
    const processOtherPayment = async () => {
        setIsProcessingPayment(true);
        setPaymentError('');

        try {

            const response = await createBooking(paymentMethod);

            if (response.code === 1000) {
                // Show success message
                alert(`Đặt vé thành công!\nMã booking: ${response.data.bookingCode}\nPhim: ${movie.movieName}\nGhế: ${selectedSeats.map(s => s.seat_number).join(', ')}\nTổng tiền: ${formatPrice(totalPrice)}`);

                // Navigate to booking history or home
                navigate('/booking/history');
            } else {
                throw new Error(response.message || 'Không thể tạo booking');
            }
        } catch (error) {
            notification.error({
                description: 'Có lỗi xảy ra trong quá trình thanh toán',
                duration: 3,
            });
            console.error('Booking error:', error);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // ===== EXISTING FUNCTIONS =====

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

    // Updated payment handler
    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán!');
            return;
        }

        if (paymentMethod === 'vnpay') {
            await processVNPayPayment();
        } else {
            await processOtherPayment();
        }
    };

    // Updated payment methods with more options
    const paymentMethods = [
        {
            id: 'vnpay',
            name: 'VNPAY',
            icon: 'https://cdn.galaxycine.vn/media/2021/12/2/download_1638460623615.png'

        }
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
                        className="mt-4 px-4 py-2 bg-[rgb(61,149,212)] text-white rounded hover:bg-sky-700"
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
            <div className="bg-white shadow-sm border-b mb-6">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    {/* <h1 className="text-2xl font-bold text-gray-800">Đặt Vé Xem Phim</h1>
                    <p className="text-gray-600 mt-1">{movie.movieName}</p> */}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'seat-selection',
                            label: '1. Chọn Ghế',
                            children: (
                                <div className="bg-white rounded-lg shadow-sm p-8">
                                    {/* Movie Info */}
                                    <div className="mb-8 pb-6 border-b border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{movie.movieName}</h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span>📅 {dayjs(schedule.date).format('DD/MM/YYYY')}</span>
                                            <span>🕐 {dayjs(schedule.startTime).format('HH:mm')}</span>
                                            <span>-</span>
                                            <span>{schedule.room.room_name}</span>
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
                                                : 'bg-[rgb(61,149,212)] hover:bg-sky-700 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            {selectedSeats.length === 0 ? 'Chọn ghế để tiếp tục' : 'Đặt Ghế'}
                                        </button>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'payment',
                            label: '2. Thanh Toán',
                            disabled: selectedSeats.length === 0,
                            children: (
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
                                        {/* Booking Info
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
                            </div> */}

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
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={method.icon}
                                                                alt={method.name}
                                                                className="w-8 h-8 object-contain"
                                                                onError={(e) => {
                                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8cGF0aCBkPSJNMTYgOEM5LjM3MiA4IDQgMTMuMzcyIDQgMjBTOS4zNzIgMzIgMTYgMzJTMjggMjYuNjI4IDI4IDIwUzIyLjYyOCA4IDE2IDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                                                                }}
                                                            />
                                                            <span className="font-medium">{method.name}</span>
                                                        </div>
                                                        {paymentMethod === method.id && (
                                                            <div className="ml-auto">
                                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment Error Display */}
                                        {/* {paymentError && (
                                            notification.error({
                                                message: 'Lỗi thanh toán',
                                                description: 'Vui lòng chọn phương thức thanh toán.',
                                                duration: 3, // tự tắt sau 3 giây
                                            }); */}
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Tóm Tắt Đơn Hàng</h3>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Số lượng ghế:</span>
                                                <span className="font-medium">{selectedSeats.length} ghế</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Ghế:</span>
                                                <span className="font-medium">{selectedSeats.map(seat => seat.seat_number).join(', ')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Giá vé:</span>
                                                <div className="text-right">
                                                    {selectedSeats.map(seat => (
                                                        <div key={seat.id} className="font-medium">
                                                            {seat.seat_number}: {formatPrice(seat.price)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Tổng cộng:</span>
                                                <span className="text-red-600">{formatPrice(totalPrice)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={handlePayment}
                                                disabled={!paymentMethod || isProcessingPayment}
                                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${!paymentMethod || isProcessingPayment
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-[rgb(61,149,212)] hover:bg-sky-700 shadow-lg hover:shadow-xl'
                                                    }`}
                                            >
                                                {isProcessingPayment ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Đang xử lý...
                                                    </div>
                                                ) : !paymentMethod ? (
                                                    'Chọn phương thức thanh toán'
                                                ) : (
                                                    'Thanh Toán'
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('seat-selection')}
                                                disabled={isProcessingPayment}
                                                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Quay lại chọn ghế
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
}