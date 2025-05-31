import React, { useEffect, useState } from 'react'
import { Table, Button, Input, Switch } from 'antd'
import { FiPlus } from 'react-icons/fi'
import { EditOutlined } from '@ant-design/icons'
import ActorModal from '../../../components/modal/ActorModal'
import axios from 'axios'

const { Search } = Input

export default function ActorManagement() {
    const [data, setData] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [selectedActor, setSelectedActor] = useState(null)

    const fetchActors = () => {
        axios.get('http://localhost:8080/api/v1/actors?page=1&pageSize=2000')
            .then(res => setData(res.data.data.result))
            .catch(() => alert("Lỗi khi tải danh sách diễn viên"))
    }

    useEffect(() => {
        fetchActors()
    }, [])

    const handleSearch = (value) => {
        const keyword = value.toLowerCase()
        const filtered = data.filter(actor => actor.fullName.toLowerCase().includes(keyword))
        setData(filtered)
    }

    const handleEdit = (record) => {
        setSelectedActor(record)
        setOpenModal(true)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Tên diễn viên',
            dataIndex: 'fullName'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth'
        },
        {
            title: 'Quốc tịch',
            dataIndex: 'nationality'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => <Switch checked={status} disabled />
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                />
            )
        }
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Diễn viên</h2>
                <Button
                    type="primary"
                    icon={<FiPlus />}
                    onClick={() => {
                        setSelectedActor(null)
                        setOpenModal(true)
                    }}
                >
                    Thêm diễn viên
                </Button>
            </div>

            <Search
                placeholder="Tìm theo tên diễn viên"
                enterButton="Tìm"
                onSearch={handleSearch}
                className="mb-4"
            />

            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                scroll={{ x: 800 }}
            />

            <ActorModal
                isModalOpen={openModal}
                setIsModalOpen={setOpenModal}
                actor={selectedActor}
                reloadData={fetchActors}
            />
        </div>
    )
}
