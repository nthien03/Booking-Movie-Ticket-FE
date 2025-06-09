import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, notification, Empty, Spin, Input, Tag } from 'antd';
import { CalendarOutlined, FileTextOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from '../../utils/axios-customize';
import { callFetchBookingHistory } from '../../utils/api';
import BookingDetailModal from '../../components/modal/BookingDetailModal';

const { Search } = Input;
const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleViewDetails = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalVisible(true);
    };


    // Lấy thông tin user từ Redux
    const user = useSelector(state => state.account.user);
    const userId = user?.id;
    const [pageSize] = useState(6);

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

    // API call thực tế - Backend pagination
    const fetchBookings = async (page, size = pageSize, keyword = '') => {
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        setLoading(true);
        try {
            const response = await callFetchBookingHistory(page, size, keyword);
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
            fetchBookings(currentPage, pageSize, searchKeyword);
        }
    }, [currentPage, userId, searchKeyword]);

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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (s) => <Tag color={getStatusColor(s)}>{mapBookingStatus(s)}</Tag>,
        },

        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button
                    className="bg-[#3d95d4] text-white border-none hover:opacity-90"
                    onClick={() => handleViewDetails(record.id)}
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
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onPressEnter={() => {
                                setCurrentPage(1);
                                fetchBookings(1, pageSize, searchKeyword.trim());
                            }}
                            suffix={<SearchOutlined className="text-gray-500 text-lg"
                                onClick={() => {
                                    setCurrentPage(1);
                                }}
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

                    <BookingDetailModal
                        bookingId={selectedBookingId}
                        open={isModalVisible}
                        onClose={() => {
                            setIsModalVisible(false);
                            setSelectedBookingId(null);
                        }}
                    />

                </div>
            </div>
        </div>
    );
};

export default BookingHistory;