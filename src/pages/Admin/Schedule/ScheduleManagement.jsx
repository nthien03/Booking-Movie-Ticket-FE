import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tooltip, notification, Tag, DatePicker } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { FiPlus } from "react-icons/fi";
import CreateScheduleModal from '../../../components/modal/ScheduleModal';
import { SearchOutlined } from '@ant-design/icons';
import { callFetchSchedules } from '../../../utils/api';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Search } = Input;
export default function ScheduleManagement() {
    const [data, setData] = useState([]);                    // Danh sách lịch chiếu
    const [openModal, setOpenModal] = useState(false);       // Trạng thái mở modal
    const [editingSchedule, setEditingSchedule] = useState();// Lịch đang sửa (nếu có)
    const [keyword, setKeyword] = useState('');
    const [filterDate, setFilterDate] = useState(null);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [loading, setLoading] = useState(false);


    // Fetch dữ liệu lịch chiếu
    // const fetchSchedules = () => {
    //     axios.get('http://localhost:8080/api/v1/schedules')
    //         .then(response => {
    //             if (response.data) {
    //                 setData(response.data);
    //             } else {
    //                 notification.error({
    //                     message: 'Lỗi',
    //                     description: 'Không thể lấy dữ liệu lịch chiếu từ server.',
    //                 });
    //             }
    //         })
    //         .catch(error => {
    //             notification.error({
    //                 message: 'Lỗi',
    //                 description: 'Đã có lỗi xảy ra khi lấy dữ liệu.',
    //             });
    //             console.error('Error fetching schedules:', error);
    //         });
    // };
    const fetchSchedules = async (page, size = pageSize, movieName = '', date = null) => {
        setLoading(true);
        try {

            const cleanMovieName = movieName && movieName.trim() ? movieName.trim() : undefined;
            const cleanDate = date || undefined;

            const res = await callFetchSchedules(page, size, cleanMovieName, cleanDate);

            if (res.code === 1000) {
                const { result, meta } = res.data;
                setData(result);
                setMeta(meta);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: res.message || "Không thể lấy dữ liệu lịch chiếu.",
                });
            }
        } catch (err) {
            notification.error({
                message: "Lỗi",
                description: "Đã có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.",
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSchedules(currentPage, pageSize, keyword, filterDate);
    }, [currentPage, keyword, filterDate]);

    // Mở modal tạo mới
    const handleCreate = () => {
        setEditingSchedule(undefined);  // không có dataInit
        setOpenModal(true);
    };

    // Mở modal sửa
    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);  // truyền dataInit
        setOpenModal(true);
    };

    // Đóng modal
    const handleModalClose = (shouldReload = false) => {
        setOpenModal(false);
        setEditingSchedule(undefined);
        if (shouldReload) fetchSchedules(); // reload nếu có tạo/sửa thành công
    };

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: meta.total || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        // showTotal: (total, range) =>
        //     `Hiển thị ${range[0]}-${range[1]} của ${total} lịch chiếu`,
        onChange: (page) => setCurrentPage(page),
    };

    // Tìm kiếm theo tên phim
    const handleSearch = (value) => {
        setCurrentPage(1);             // reset về page đầu
        setKeyword(value ? value.trim() : '');     // gán vào state keyword
    };

    const handleDateChange = (date) => {
        setCurrentPage(1);
        if (date) {
            // Chỉ convert khi date có giá trị
            const fDate = dayjs(date).tz("Asia/Ho_Chi_Minh").startOf('day').utc().toISOString();
            setFilterDate(fDate);
        } else {
            // Khi clear date, set về null
            setFilterDate(null);
        }
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Tên phim',
            dataIndex: 'movie',
            render: (movie) => movie.movieName,
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'room',
            render: (room) => room.roomName,
        },
        {
            title: 'Ngày chiếu',
            dataIndex: 'date',
            render: (date) => new Date(date).toLocaleDateString('vi-VN',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Thời gian chiếu',
            render: (_, record) => {
                const start = new Date(record.startTime);
                const end = new Date(record.endTime);
                return `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            render: (_, schedule) => (
                <>
                    <Tooltip title="Xem chi tiết lịch chiếu">
                        <button
                            onClick={() => handleEdit(schedule)}
                            className="text-green-600 mr-6 text-xl"
                        >
                            <EyeOutlined />
                        </button>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa lịch chiếu">
                        <button
                            onClick={() => handleEdit(schedule)}
                            className="text-blue-600 text-xl"
                        >
                            <EditOutlined />
                        </button>
                    </Tooltip>
                </>
            ),
            width: 150
        }
    ];

    return (
        <div className="adminFilm">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl uppercase font-bold">Quản lý Lịch Chiếu</h2>
                <Button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                >
                    <FiPlus /> Thêm mới lịch chiếu
                </Button>
            </div>

            {/* Tìm kiếm */}
            {/* <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tên phim"
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={searchKeyword}
            /> */}
            <div className="mb-4 flex gap-2 items-center w-full">
                <div className="w-2/3">
                    <Search
                        placeholder="Tìm kiếm theo tên phim"
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        onSearch={handleSearch}
                        className="flex-grow mr-6"
                    />
                </div>
                <div className="w-1/3 flex gap-2">
                    <DatePicker
                        placeholder="Lọc theo ngày chiếu"
                        format="DD/MM/YYYY"
                        size="large"
                        onChange={handleDateChange}
                        allowClear
                    />
                    <Button size="large" type="primary" onClick={() => setCurrentPage(1)}>
                        Lọc
                    </Button>
                </div>
            </div>

            {/* Bảng */}
            <div className="overflow-x-auto">
                <div className="min-w-[768px]">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={meta.total > pageSize ? paginationConfig : false}
                    />
                </div>
            </div>

            {/* Modal Tạo / Sửa */}
            <CreateScheduleModal
                isModalOpen={openModal}
                setIsModalOpen={handleModalClose}
                dataInit={editingSchedule}
                onSuccess={() => { fetchSchedules(currentPage, pageSize, keyword, filterDate); }}
            />
        </div>
    );
}
