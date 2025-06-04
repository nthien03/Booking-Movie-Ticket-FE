import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, notification, Empty, Spin, Input } from 'antd';
import { CalendarOutlined, FileTextOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from '../../utils/axios-customize';

const { Search } = Input;
const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin user từ Redux
    const user = useSelector(state => state.account.user);
    const userId = user?.id;
    const [pageSize] = useState(10);

    // API call thực tế - Backend pagination
    const fetchBookings = async (page, size = pageSize) => {
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/v1/bookings/history?page=${page}&size=${size}`
            );


            if (response.code === 1000) {
                const { result, meta } = response.data || {};
                setBookings(result || []);
                setMeta(meta || {});
            } else {
                console.error('API Error:', response.message || 'Có lỗi xảy ra khi lấy dữ liệu');
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể lấy dữ liệu đơn đặt vé từ server.',
                });
                setBookings([]);
                setMeta({});
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải dữ liệu.',
            });
            setBookings([]);
            setMeta({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchBookings(currentPage, pageSize);
        }
    }, [currentPage, userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timePart = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${datePart} ${timePart}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN',
            {
                style: 'currency',
                currency: 'VND'
            }
        ).format(price);
    };


    const handleViewDetails = (booking) => {
        notification.info({
            message: `Chi tiết đơn hàng ${booking.bookingCode}`,
            description: (
                <div>
                    <p><strong>Tên phim:</strong> {booking.movieName}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(booking.bookingDate)}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(booking.totalPrice)}</p>
                </div>
            ),
            duration: 8,
        });
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    // Định nghĩa columns cho Ant Design Table
    const columns = [
        {
            title: 'Mã đơn đặt',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
            width: 150,
            render: (text) => (
                <span className="text-gray-900">{text}</span>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 180,
            render: (date) => (
                <span className="text-gray-900">{formatDate(date)}</span>
            ),
        },
        {
            title: 'Tên phim',
            dataIndex: 'movieName',
            key: 'movieName',
            ellipsis: true,
            render: (text) => (
                <span className=" text-gray-900">{text}</span>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 150,
            render: (price) => (
                <span className="text-gray-900">
                    {formatPrice(price)}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button
                    className="bg-[#3d95d4] text-white border-none hover:opacity-90"
                    onClick={() => handleViewDetails(record)}
                    size="small"
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    // Cấu hình pagination cho Ant Design Table
    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: meta.total || 0,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} của ${total} kết quả`,
        onChange: (page) => setCurrentPage(page),
    };

    return (
        <div className=" bg-gray-50 min-h-screen">
            <div className='h-12 bg-gray-50 mb-12'></div>
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">

                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {/* <CalendarOutlined className="text-xl text-blue-600 mr-3" /> */}
                        <h1 className="text-xl font-bold text-gray-800">LỊCH SỬ ĐẶT VÉ</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Thanh tìm kiếm */}
                    <div className="mb-4">
                        {/* <Search
                            placeholder="Tìm đơn đặt theo tên phim"
                            enterButton="Tìm kiếm"
                            allowClear
                            size="large"
                            onSearch={(value) => {
                                // setCurrentPage(1);
                                // setSearchKeyword(value);
                            }}
                        /> */}
                        <Input
                            className="w-64 h-10 px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mr-8"
                            placeholder="Tìm đơn đặt theo tên phim"
                            //value={search}
                            //onChange={(e) => setSearch(e.target.value)}
                            //onPressEnter={handleSearch}
                            suffix={<SearchOutlined className="text-gray-500 text-lg"
                            // onClick={handleSearch}
                            />}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={bookings}
                        rowKey="id"
                        loading={loading}
                        pagination={meta.total > pageSize ? paginationConfig : false}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={<FileTextOutlined className="text-6xl text-gray-400" />}
                                    description={
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Chưa có đơn đặt vé nào
                                            </h3>
                                            <p className="text-gray-600">
                                                Bạn chưa có lịch sử đặt vé nào để hiển thị.
                                            </p>
                                        </div>
                                    }
                                />
                            )
                        }}
                        className="ant-table-custom"
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;