import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Form, Modal, notification, Spin } from 'antd';
import axios from '../../utils/axios-customize';

const UserInfo = () => {
    const userId = useSelector(state => state.account.user?.id);
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            setLoadingUser(true);
            try {
                const res = await axios.get(`/api/v1/users/${userId}`);
                if (res.code === 1000) {
                    const u = res.data;
                    form.setFieldsValue({
                        fullName: u.fullName,
                        username: u.username,
                        email: u.email,
                        phoneNumber: u.phoneNumber
                    });
                } else {
                    notification.error({ "Lỗi khi lấy thông tin người dùng": res.message || "Không thể lấy thông tin người dùng." });
                }
            } catch (err) {
                notification.error({ "Đã có lỗi xảy ra": "Không thể tải thông tin người dùng." });
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [userId, form]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/v1/users/${userId}`, {
                fullName: values.fullName,
                email: values.email,
                phoneNumber: values.phoneNumber
            });

            if (res.code === 1000) {
                notification.success({
                    message: 'Cập nhật thành công',
                    description: 'Thông tin cá nhân đã được cập nhật.'
                });
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: res.message || 'Có lỗi khi cập nhật thông tin.'
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật thông tin.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = () => {
        setOpenModal(true);
    };

    const handlePasswordSubmit = async (values) => {
        try {
            const res = await axios.put(`/api/v1/users/${userId}/change-password`, values);
            if (res.code === 1000) {
                notification.success({
                    message: 'Thành công',
                    description: 'Mật khẩu đã được thay đổi.'
                });
                setOpenModal(false);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: res.message || 'Không thể đổi mật khẩu.'
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi',
                description: 'Đổi mật khẩu thất bại.'
            });
        }
    };

    return (
        <div className=" bg-gray-50 min-h-screen">
            <div className='h-12 bg-gray-50 mb-12'></div>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {/* <CalendarOutlined className="text-xl text-blue-600 mr-3" /> */}
                        <h1 className="text-xl font-bold text-gray-800">THÔNG TIN CÁ NHÂN</h1>
                    </div>
                </div>
                <div className="p-6">
                    {loadingUser ? (
                        <div className="text-center py-10">
                            <Spin tip="Đang tải thông tin người dùng..." />
                        </div>
                    ) : (
                        <Form form={form} layout="vertical" onFinish={handleUpdate}>
                            <Form.Item
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Tên tài khoản"
                                name="username"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input />
                            </Form.Item>

                            <div className="flex justify-between">
                                <Button className="bg-[#3d95d4] text-white border-none hover:opacity-90" htmlType="submit" loading={loading}>
                                    Cập nhật thông tin
                                </Button>
                                <Button className="bg-[#3d95d4] text-white border-none hover:opacity-90" onClick={handleChangePassword}>
                                    Thay đổi mật khẩu
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
                <Modal
                    title="Thay đổi mật khẩu"
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                >
                    <Form layout="vertical" onFinish={handlePasswordSubmit}>
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="oldPassword"
                            rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Xác nhận mật khẩu mới' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Mật khẩu xác nhận không khớp');
                                    }
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button className="bg-[#3d95d4] text-white border-none hover:opacity-90 w-full" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserInfo;
