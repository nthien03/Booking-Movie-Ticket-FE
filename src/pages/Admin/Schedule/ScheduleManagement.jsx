import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Tooltip, notification } from 'antd';
import { EditOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import axios from 'axios';
import { FiPlus } from "react-icons/fi";
import CreateScheduleModal from '../../../components/modal/CreateScheduleModal';

const { Search } = Input;

export default function ScheduleManagement() {
    const [data, setData] = useState([]); // Dữ liệu lịch chiếu
    const [openCreateScheduleModal, setCreateScheduleModal] = useState(false);
    const [openEditScheduleModal, setEditScheduleModal] = useState(false);

    useEffect(() => {
        // Lấy danh sách lịch chiếu từ API
        axios.get('http://localhost:8080/schedules') // Thay URL này với URL thực tế của bạn
            .then(response => {
                if (response.data) {
                    setData(response.data); // Cập nhật dữ liệu vào state
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể lấy dữ liệu lịch chiếu từ server.',
                    });
                }
            })
            .catch(error => {
                notification.error({
                    message: 'Lỗi',
                    description: 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                });
                console.error('Error fetching data:', error);
            });
    }, []); // Chạy khi component mount lần đầu

    const searchKeyword = (value) => {
        setData(prevData => prevData.filter(item => {
            if (value.trim() === '') return true;
            return item.movie.movieName.toLowerCase().includes(value.toLowerCase());
        }));
    }

    const columns = [
        {
            title: 'Mã lịch chiếu',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend'],
        },
        {
            title: 'Tên phim',
            dataIndex: 'movie',
            render: (movie) => movie.movieName, // Hiển thị tên phim
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'room',
            render: (room) => room.roomName, // Hiển thị tên phòng chiếu
        },
        {
            title: 'Ngày chiếu',
            dataIndex: 'date',
            render: (date) => new Date(date).toLocaleDateString(), // Hiển thị ngày chiếu
        },
        {
            title: 'Thời gian chiếu',
            dataIndex: 'startTime',
            render: (startTime, record) => {
                const endTime = new Date(record.endTime);
                return `${new Date(startTime).toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`;
            }, // Hiển thị thời gian chiếu
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     render: (status) => status ? 'Đang chiếu' : 'Dừng chiếu', // Hiển thị trạng thái
        // },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            render: (text, schedule) => {
                return (
                    <>
                        {/* Xem chi tiết */}
                        <Tooltip placement="leftBottom" title={'Xem chi tiết lịch chiếu'}>
                            <button
                                onClick={() => setEditScheduleModal(true)}
                                className="bg-dark text-green-600 mr-3 text-2xl"
                            >
                                <EyeOutlined />
                            </button>
                        </Tooltip>

                        {/* Sửa lịch chiếu */}
                        <Tooltip placement="bottom" title={'Chỉnh sửa lịch chiếu'}>
                            <button
                                onClick={() => setEditScheduleModal(true)}
                                className="bg-dark text-blue-600 mr-3 text-2xl"
                            >
                                <EditOutlined />
                            </button>
                        </Tooltip>

                        {/* Xóa lịch chiếu */}
                        {/* <Tooltip placement="topRight" title={'Xóa lịch chiếu'}>
                            <button
                                onClick={() => {
                                    Swal.fire({
                                        title: 'Bạn có muốn xóa lịch chiếu này không ?',
                                        showDenyButton: true,
                                        confirmButtonText: 'Đồng ý',
                                        denyButtonText: 'Hủy',
                                        icon: 'question',
                                        iconColor: 'rgb(104 217 254)',
                                        confirmButtonColor: '#f97316'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            // Gọi API xóa lịch chiếu
                                            axios.delete(`http://localhost:8080/schedules/${schedule.id}`)
                                                .then(() => {
                                                    notification.success({
                                                        message: 'Thành công',
                                                        description: 'Đã xóa lịch chiếu.',
                                                    });
                                                    setData(prevData => prevData.filter(item => item.id !== schedule.id));
                                                })
                                                .catch(() => {
                                                    notification.error({
                                                        message: 'Lỗi',
                                                        description: 'Không thể xóa lịch chiếu.',
                                                    });
                                                });
                                        }
                                    })
                                }}
                                className="bg-dark text-red-600 text-2xl hover:text-red-400"
                            >
                                <DeleteOutlined />
                            </button>
                        </Tooltip> */}
                    </>
                );
            },
            width: 150
        },
    ];

    return (
        <div className="adminFilm">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }} className="mb-6">
                <h2 className="text-2xl uppercase font-bold">Quản lý Lịch Chiếu</h2>
                <Button
                    onClick={() => setCreateScheduleModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                    aria-label="Add New Schedule"
                >
                    <FiPlus /> Thêm mới lịch chiếu
                </Button>
            </div>

            <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tên phim"
                enterButton="Search"
                size="large"
                onSearch={searchKeyword}
            />

            <div className="overflow-x-auto">
                <div className="min-w-[768px]">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                    />
                </div>
            </div>

            {/* Modal tạo lịch chiếu */}
            <CreateScheduleModal
                isModalOpen={openCreateScheduleModal}
                setIsModalOpen={setCreateScheduleModal}
                movieOptions={data.map(schedule => ({
                    label: schedule.movie.movieName,
                    value: schedule.movie.id,
                }))}
                roomOptions={[{ label: "Phòng 1", value: 1 }, { label: "Phòng 2", value: 2 }]} // Cập nhật phòng chiếu nếu cần
            />
        </div>
    );
}
