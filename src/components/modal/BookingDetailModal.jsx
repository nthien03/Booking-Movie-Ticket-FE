import React, { useEffect, useState } from 'react';
import { Modal, Table, Tag, Spin, notification } from 'antd';
import axios from '../../utils/axios-customize';

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
        date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' +
        date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
    );
};

const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const mapBookingStatus = (code) => {
    switch (code) {
        case 0: return 'Nháp';
        case 1: return 'Đã đặt';
        case 2: return 'Hoàn thành';
        case 3: return 'Đã hủy';
        case 4: return 'Đang thanh toán';
        case 5: return 'Thanh toán thất bại';
        default: return 'Không xác định';
    }
};

const getStatusColor = (code) => {
    switch (code) {
        case 0: return 'default';
        case 1: return 'processing';
        case 2: return 'success';
        case 3: return 'error';
        case 4: return 'warning';
        case 5: return 'magenta';
        default: return 'default';
    }
};

const BookingDetailModal = ({ bookingId, open, onClose }) => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBookingDetail = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/bookings/${id}`);
            if (res.code === 1000) {
                setBooking(res.data);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: res.message || 'Không thể lấy chi tiết đơn đặt.',
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi khi tải chi tiết đơn.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId && open) {
            fetchBookingDetail(bookingId);
        } else {
            setBooking(null);
        }
    }, [bookingId, open]);

    return (
        <Modal
            open={open}
            title={booking ? `Chi tiết đơn ${booking.bookingCode}` : 'Đang tải...'}
            onCancel={onClose}
            footer={null}
            width={650}
        >
            {loading ? (
                <div className="text-center py-10">
                    <Spin />
                </div>
            ) : booking ? (
                <>
                    <p><strong>Mã đơn:</strong> {booking.bookingCode}</p>
                    <p><strong>Ngày đặt:</strong> {formatDateTime(booking.bookingDate)}</p>
                    <p><strong>Phim:</strong> {booking.movieName}</p>
                    <p><strong>Phòng chiếu:</strong> {booking.roomName}</p>
                    <p><strong>Ngày chiếu:</strong> {formatDateOnly(booking.date)}</p>
                    <p><strong>Giờ chiếu:</strong> {formatTimeOnly(booking.startTime)}</p>
                    <p><strong>Phương thức thanh toán:</strong> {booking.paymentMethod || '-'}</p>
                    <p>
                        <strong>Trạng thái:</strong>{' '}
                        <Tag color={getStatusColor(booking.status)}>
                            {mapBookingStatus(booking.status)}
                        </Tag>
                    </p>

                    <h3 className="font-semibold mt-4 mb-2">Danh sách ghế</h3>
                    <Table
                        dataSource={booking.tickets}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        bordered
                        columns={[
                            {
                                title: 'Ghế',
                                key: 'seatName',
                                render: (_, record) => `${record.seat.seatRow}${record.seat.seatNumber}`,
                            },
                            {
                                title: 'Giá',
                                dataIndex: 'price',
                                key: 'price',
                                align: 'right',
                                render: formatPrice,
                            },
                        ]}
                    />

                    <p className="mt-4 text-right">
                        <strong>Tổng tiền:</strong> {formatPrice(booking.totalPrice)}
                    </p>
                </>
            ) : (
                <div>Không tìm thấy dữ liệu</div>
            )}
        </Modal>
    );
};

export default BookingDetailModal;
