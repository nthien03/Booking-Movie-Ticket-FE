import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip, Input, notification } from 'antd';
import { FiPlus } from 'react-icons/fi';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import GenreModal from '../../../components/modal/GenreModal';

const { Search } = Input;

export default function GenreManagement() {
    const [genres, setGenres] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = () => {
        axios.get('http://localhost:8080/api/v1/genres?page=1&pageSize=1000')
            .then(res => {
                if (res.data?.code === 1000) {
                    setGenres(res.data.data.result);
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải danh sách thể loại',
                    });
                }
            })
            .catch(err => {
                notification.error({
                    message: 'Lỗi kết nối',
                    description: 'Không thể kết nối tới server',
                });
            });
    };

    const handleSearch = (value) => {
        if (!value) return fetchGenres();
        setGenres(prev =>
            prev.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleEdit = (genre) => {
        setSelectedGenre(genre);
        setOpenModal(true);
    };

    const handleCreate = () => {
        setSelectedGenre(null);
        setOpenModal(true);
    };

    const columns = [
        {
            title: 'Mã thể loại',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     render: (status) => status ? 'Hiển thị' : 'Ẩn',
        // },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa thể loại">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                </Tooltip>
            ),
            width: 100,
        }
    ];

    return (
        <div className="adminGenre">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl uppercase font-bold">Quản lý Thể Loại</h2>
                <Button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FiPlus /> Thêm thể loại
                </Button>
            </div>

            <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tên thể loại"
                enterButton="Tìm kiếm"
                size="large"
                onSearch={handleSearch}
            />

            <div className="overflow-x-auto">
                <Table
                    dataSource={genres}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </div>

            <GenreModal
                isModalOpen={openModal}
                setIsModalOpen={setOpenModal}
                genre={selectedGenre}
                onSuccess={fetchGenres}
            />
        </div>
    );
}
