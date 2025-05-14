import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Switch, notification, Spin } from "antd";
import axios from 'axios';
import moment from 'moment';

const CreateScheduleModal = ({ isModalOpen, setIsModalOpen, dataInit, movieOptions = [], roomOptions = [] }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    //const navigate = useNavigate();
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                movieId: dataInit.movieId,
                roomId: dataInit.roomId,
                date: moment(dataInit.date),
                startTime: moment(dataInit.startTime),
                endTime: moment(dataInit.endTime),
                status: dataInit.status,
            });
        }
    }, [dataInit]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const date = moment(values.date).startOf('day'); // Starting at midnight of the selected date
            const startTime = moment(values.startTime);
            const endTime = moment(values.endTime);

            const payload = {
                movieId: values.movieId,
                roomId: values.roomId,
                date: date.toISOString(),
                startTime: date.clone().set({
                    hour: startTime.hour(),
                    minute: startTime.minute(),
                    second: startTime.second(),
                    millisecond: startTime.millisecond(),
                }).toISOString(),
                endTime: date.clone().set({
                    hour: endTime.hour(),
                    minute: endTime.minute(),
                    second: endTime.second(),
                    millisecond: endTime.millisecond(),
                }).toISOString(),
                status: values.status,
            };

            console.log("Payload to be sent:", payload); // Debugging line

            const response = await axios.post('http://localhost:8080/schedules', payload);

            if (response.data.code === 1000) {
                notification.success({
                    message: "Thành công",
                    description: "Lịch chiếu đã được tạo thành công!",
                });
                form.resetFields();
                setIsModalOpen(false);
                window.location.reload();
                //navigate('/schedule')
            } else if (response.data.code === 4000) {  // Kiểm tra mã lỗi 4000
                notification.error({
                    message: "Lỗi",
                    description: "Phòng chiếu đã được sử dụng vào thời gian bạn chọn.",
                });
            }
            else {
                notification.error({
                    message: "Lỗi",
                    description: "Đã có lỗi xảy ra khi tạo lịch chiếu.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || error.message || "Đã có lỗi xảy ra khi gửi dữ liệu.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm mới lịch chiếu"
            maskClosable={false}
            open={isModalOpen}
            onCancel={() => {
                form.resetFields();
                setIsModalOpen(false);
            }}
            footer={null}
            width={600}
            className="top-4"
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    <Form.Item
                        name="movieId"
                        label="Chọn phim"
                        rules={[{ required: true, message: "Vui lòng chọn phim" }]}
                    >
                        <Select
                            placeholder="Chọn phim"
                            options={movieOptions}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        name="roomId"
                        label="Chọn phòng chiếu"
                        rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
                    >
                        <Select
                            placeholder="Chọn phòng"
                            options={roomOptions}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Ngày chiếu"
                        rules={[{ required: true, message: "Vui lòng chọn ngày chiếu" }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="startTime"
                        label="Giờ bắt đầu"
                        rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
                    >
                        <TimePicker className="w-full" format="HH:mm" />
                    </Form.Item>

                    <Form.Item
                        name="endTime"
                        label="Giờ kết thúc"
                        rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
                    >
                        <TimePicker className="w-full" format="HH:mm" />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        valuePropName="checked"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                        <Switch checkedChildren="Mở" unCheckedChildren="Ẩn" />
                    </Form.Item>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                form.resetFields();
                                setIsModalOpen(false);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Lưu
                        </button>
                    </div>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateScheduleModal;
