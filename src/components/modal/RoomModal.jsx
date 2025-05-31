import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, InputNumber, notification } from 'antd';
import axios from 'axios';

export default function RoomModal({ isModalOpen, setIsModalOpen, dataInit }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit) {
            form.setFieldsValue(dataInit);
        } else {
            form.resetFields();
            form.setFieldsValue({ status: true });
        }
    }, [dataInit, form]);

    const handleSubmit = async (values) => {
        try {
            if (dataInit) {
                await axios.put(`http://localhost:8080/api/v1/rooms/${dataInit.id}`, values);
                notification.success({ message: 'Thành công', description: 'Cập nhật phòng thành công' });
            } else {
                await axios.post('http://localhost:8080/api/v1/rooms', values);
                notification.success({ message: 'Thành công', description: 'Tạo phòng mới thành công' });
            }
            setIsModalOpen(true); // để reload danh sách
            setIsModalOpen(false, true); // đóng modal và reload
        } catch (err) {
            console.error(err);
            notification.error({ message: 'Lỗi', description: 'Không thể lưu thông tin phòng' });
        }
    };

    return (
        <Modal
            title={dataInit ? 'Chỉnh sửa phòng chiếu' : 'Thêm phòng chiếu mới'}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            okText={dataInit ? 'Cập nhật' : 'Lưu'}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="roomName" label="Tên phòng" rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="total_row" label="Số hàng ghế" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="total_column" label="Số ghế tối đa mỗi hàng" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
