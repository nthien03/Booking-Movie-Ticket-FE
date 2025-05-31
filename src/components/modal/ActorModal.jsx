import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Switch, Button, notification } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'

export default function ActorModal({ isModalOpen, setIsModalOpen, actor, reloadData }) {
    const [form] = Form.useForm()

    useEffect(() => {
        if (actor) {
            form.setFieldsValue({
                ...actor,
                dateOfBirth: actor.dateOfBirth ? dayjs(actor.dateOfBirth) : null
            })
        } else {
            form.resetFields()
        }
    }, [actor, form])

    const handleSubmit = (values) => {
        const payload = {
            ...values,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
        }

        const request = actor
            ? axios.put(`http://localhost:8080/api/v1/actors/${actor.id}`, payload)
            : axios.post('http://localhost:8080/api/v1/actors', payload)

        request
            .then(() => {
                notification.success({
                    message: actor ? 'Cập nhật thành công' : 'Thêm diễn viên thành công'
                })
                setIsModalOpen(false)
                reloadData()
            })
            .catch(() => {
                notification.error({
                    message: 'Lỗi',
                    description: actor ? 'Cập nhật thất bại' : 'Thêm mới thất bại'
                })
            })
    }

    return (
        <Modal
            open={isModalOpen}
            title={actor ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên'}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập tên diễn viên" />
                </Form.Item>

                <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                >
                    <DatePicker className="w-full" format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="Quốc tịch"
                    name="nationality"
                >
                    <Input placeholder="Nhập quốc tịch" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item className="text-right">
                    <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {actor ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
