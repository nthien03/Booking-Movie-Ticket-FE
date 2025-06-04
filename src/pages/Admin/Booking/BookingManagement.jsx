import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tooltip, Tag, Modal, Form, Select, DatePicker, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { FiPlus, FiDownload } from "react-icons/fi";
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function BookingManagement() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openViewBookingModal, setOpenViewBookingModal] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filters, setFilters] = useState({
        searchText: ''
    });

    // Fetch booking data from API
    useEffect(() => {
        fetchBookingData();
    }, []);

    const fetchBookingData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/bookings');
            if (response.data && response.data.code === 1000) {
                const bookings = response.data.data.result;
                setData(bookings);
                setOriginalData(bookings);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể lấy dữ liệu đơn đặt vé từ server.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã có lỗi xảy ra khi lấy dữ liệu.',
            });
            console.error('Error fetching booking data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search function
    const searchKeyword = (value) => {
        const filteredData = originalData.filter(item => {
            if (value.trim() === '') return true;
            return item.bookingCode.toString().includes(value) ||
                item.user.username.toLowerCase().includes(value.toLowerCase());
        });
        setData(filteredData);
        setFilters(prev => ({ ...prev, searchText: value }));
    };

    // Filter by status
    const handleStatusFilter = (status) => {
        let filteredData = [...originalData];

        if (filters.searchText) {
            filteredData = filteredData.filter(item =>
                item.bookingCode.toString().includes(filters.searchText) ||
                item.user.username.toLowerCase().includes(filters.searchText.toLowerCase())
            );
        }

        setData(filteredData);
        setFilters(prev => ({ ...prev, status }));
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Handle view booking detail
    const handleViewBooking = (booking) => {
        setSelectedBooking(booking);
        setOpenViewBookingModal(true);
    };



    // Handle delete booking
    const handleDeleteBooking = async (bookingId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đơn đặt vé này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/bookings/${bookingId}`);
                    notification.success({
                        message: 'Thành công',
                        description: 'Xóa đơn đặt vé thành công!',
                    });
                    fetchBookingData(); // Refresh data
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể xóa đơn đặt vé.',
                    });
                }
            }
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend'],
            width: 80,
        },
        {
            title: 'Mã đặt vé',
            dataIndex: 'bookingCode',
            sorter: (a, b) => a.bookingCode - b.bookingCode,
            render: (text) => `${text}`,
            width: 120,
        },
        {
            title: 'Tài khoản',
            dataIndex: ['user', 'username'],
            sorter: (a, b) => a.user.username.localeCompare(b.user.username),
            render: (text, booking) => (
                <div>
                    <div>{booking.user.username}</div>
                    {/* <div className="text-sm text-gray-500">ID: {booking.user.id}</div> */}
                </div>
            ),
            width: 150,
        },
        {
            title: 'Số lượng ghế',
            dataIndex: 'amount',
            sorter: (a, b) => a.amount - b.amount,
            render: (amount) => `${amount}`,
            width: 100,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (price) => formatCurrency(price),
            width: 150,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'bookingDate',
            sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
            render: (date) => (
                <div>
                    <div>{new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}</div>
                    <div className="text-sm text-gray-500">
                        {new Date(date).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            ),
            width: 130,
        },

        {
            title: 'Hành động',
            key: 'actions',
            render: (text, booking) => (
                <div className="flex gap-2">
                    <Tooltip placement="top" title="Xem chi tiết">
                        <button
                            onClick={() => handleViewBooking(booking)}
                            className="text-green-600 hover:text-green-800 text-lg"
                        >
                            <EyeOutlined />
                        </button>
                    </Tooltip>



                    {/* <Tooltip placement="top" title="Xóa">
                        <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-800 text-lg"
                        >
                            <DeleteOutlined />
                        </button>
                    </Tooltip> */}
                </div>
            ),
            width: 120,
        },
    ];

    return (
        <div className="adminBooking">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl uppercase font-bold">Quản lý Đơn đặt vé</h2>
            </div>

            {/* Search */}
            <div className="mb-4">
                <Search
                    placeholder="Tìm kiếm theo mã đặt vé"
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={searchKeyword}
                />
            </div>

            {/* Statistics Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                    <div className="text-sm text-gray-600">Tổng đơn đặt vé</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {data.filter(item => item.status).length}
                    </div>
                    <div className="text-sm text-gray-600">Đã thanh toán</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">
                        {data.filter(item => !item.status).length}
                    </div>
                    <div className="text-sm text-gray-600">Chưa thanh toán</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(data.reduce((sum, item) => sum + item.totalPrice, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Tổng doanh thu</div>
                </div>
            </div> */}

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-[1024px]">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} đơn đặt vé`,
                        }}
                    />
                </div>
            </div>

            {/* View Booking Modal */}
            <Modal
                title="Chi tiết đơn đặt vé"
                open={openViewBookingModal}
                onCancel={() => setOpenViewBookingModal(false)}
                footer={[
                    <Button key="close" onClick={() => setOpenViewBookingModal(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedBooking && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-700">Mã đặt vé:</label>
                                <p className="font-mono">#{selectedBooking.bookingCode}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Khách hàng:</label>
                                <p>{selectedBooking.user.username}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Số lượng vé:</label>
                                <p>{selectedBooking.amount} vé</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Tổng tiền:</label>
                                <p className="font-semibold text-green-600">
                                    {formatCurrency(selectedBooking.totalPrice)}
                                </p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Ngày đặt:</label>
                                <p>{new Date(selectedBooking.bookingDate).toLocaleString('vi-VN')}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Trạng thái:</label>
                                <Tag color={selectedBooking.status ? 'green' : 'red'}>
                                    {selectedBooking.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </Tag>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>


        </div>
    );
}