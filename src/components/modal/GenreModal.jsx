import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, notification } from 'antd';
import axios from 'axios';

export default function GenreModal({ isModalOpen, setIsModalOpen, genre, onSuccess }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (genre) {
            form.setFieldsValue(genre);
        } else {
            form.resetFields();
        }
    }, [genre, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            if (genre) {
                // Update
                axios.put(`http://localhost:8080/api/v1/genres/${genre.id}`, values)
                    .then(res => {
                        notification.success({ message: 'Thành công', description: 'Đã cập nhật thể loại.' });
                        setIsModalOpen(false);
                        onSuccess();
                    })
                    .catch(err => {
                        notification.error({ message: 'Lỗi', description: 'Không thể cập nhật thể loại.' });
                    });
            } else {
                // Create
                axios.post(`http://localhost:8080/api/v1/genres`, values)
                    .then(res => {
                        notification.success({ message: 'Thành công', description: 'Đã tạo thể loại mới.' });
                        setIsModalOpen(false);
                        onSuccess();
                    })
                    .catch(err => {
                        notification.error({ message: 'Lỗi', description: 'Không thể tạo thể loại.' });
                    });
            }
        });
    };

    return (
        <Modal
            title={genre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={() => setIsModalOpen(false)}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên thể loại"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
                >
                    <Input placeholder="Nhập tên thể loại" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea rows={4} placeholder="Mô tả thể loại (nếu có)" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
