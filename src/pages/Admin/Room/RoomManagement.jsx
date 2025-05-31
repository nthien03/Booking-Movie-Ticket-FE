import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tooltip, notification, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import RoomModal from '../../../components/modal/RoomModal'; // tạo file này

const { Search } = Input;

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const fetchRooms = () => {
        axios.get('http://localhost:8080/api/v1/rooms')
            .then(res => setRooms(res.data))
            .catch(err => {
                console.error(err);
                notification.error({ message: 'Lỗi', description: 'Không thể tải danh sách phòng' });
            });
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreate = () => {
        setEditingRoom(null);
        setOpenModal(true);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setOpenModal(true);
    };

    const handleModalClose = (shouldReload = false) => {
        setOpenModal(false);
        setEditingRoom(null);
        if (shouldReload) fetchRooms();
    };

    const searchRoom = (value) => {
        if (!value.trim()) return fetchRooms();
        const filtered = rooms.filter(r => r.roomName.toLowerCase().includes(value.toLowerCase()));
        setRooms(filtered);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id'
        },
        {
            title: 'Tên phòng',
            dataIndex: 'roomName'
        },
        {
            title: 'Số hàng ghế',
            dataIndex: 'total_row'
        },
        {
            title: 'Số ghế tối đa mỗi hàng',
            dataIndex: 'total_column'
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
            render: (_, room) => (
                <>
                    <Tooltip title="Xem">
                        <button className="text-green-600 mr-6 text-xl" onClick={() => handleEdit(room)}>
                            <EyeOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <button className="text-blue-600 text-xl" onClick={() => handleEdit(room)}>
                            <EditOutlined />
                        </button>
                    </Tooltip>

                    {/* <Tooltip title="Sơ đồ ghế">
                        <button className="text-blue-600 text-xl" onClick={() => handleEdit(room)}>
                            <EditOutlined />
                        </button>
                    </Tooltip> */}
                </>
            )
        }
    ];

    return (
        <div className="adminRoom">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl uppercase font-bold">Quản lý Phòng Chiếu</h2>
                <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                    onClick={handleCreate}
                >
                    <FiPlus /> Thêm phòng mới
                </Button>
            </div>

            {/* Tìm kiếm */}
            <Search
                className='mb-4'
                placeholder="Tìm theo tên phòng"
                enterButton
                size="large"
                onSearch={searchRoom}
            />

            <Table columns={columns} dataSource={rooms} rowKey="id" />

            {/* Modal tạo/sửa */}
            <RoomModal
                isModalOpen={openModal}
                setIsModalOpen={handleModalClose}
                dataInit={editingRoom}
            />
        </div>
    );
}
