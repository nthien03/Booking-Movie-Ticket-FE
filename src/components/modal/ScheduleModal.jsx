import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    InputNumber,
    Modal,
    Select,
    DatePicker,
    Switch,
    notification,
    TimePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import { callFetchMovies } from "../../utils/api";

const ScheduleModal = ({ isModalOpen, setIsModalOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchData = async () => {
            try {
                const [moviesRes] = await Promise.all([
                    callFetchMovies(1, 1000)
                ]);
                setMovies(moviesRes.data.result);
                console.log("Movies:", moviesRes.data);
            } catch (err) {
                notification.error({ message: "Lỗi khi tải dữ liệu", description: err.message });
            }
        };
        fetchData();
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            setDuration(0);
            form.setFieldsValue({ status: true });
            setRooms([]);
        }
    }, [isModalOpen]);

    const handleMovieChange = (movieId) => {
        const selected = movies.find((m) => m.id === movieId);
        const newDuration = selected?.duration || 0;
        setDuration(newDuration);
        triggerRoomCheck(newDuration);
    };

    const triggerRoomCheck = (currentDuration = duration) => {
        const values = form.getFieldsValue();
        const { date, startTime, bufferTime } = values;
        if (date && startTime != null && bufferTime != null) {
            fetchAvailableRooms(date, startTime, currentDuration, bufferTime);
        }
    };

    const fetchAvailableRooms = async (date, startTime, movieDuration, bufferTime) => {
        try {
            const start = moment(`${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`, "YYYY-MM-DD HH:mm");
            const end = moment(start).add(movieDuration + bufferTime, "minutes");

            const res = await axios.get("http://localhost:8080/api/v1/schedules/available-rooms", {
                params: {
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
                },
            });
            setRooms(res.data);
        } catch (err) {
            notification.error({
                message: "Lỗi khi kiểm tra phòng trống",
                description: err.message,
            });
        }
    };

    const handleSubmit = async (values) => {
        const { movieId, roomId, date, startTime, bufferTime, status } = values;
        const start = moment(`${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`, "YYYY-MM-DD HH:mm");
        const end = moment(start).add(duration + bufferTime, "minutes");

        const payload = {
            movieId,
            roomId,
            date: date.startOf("day").toISOString(),
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            bufferTime,
            status,
        };

        try {
            setLoading(true);

            await axios.post("http://localhost:8080/api/v1/schedules", payload);
            notification.success({ message: "Thêm mới lịch chiếu thành công!" });
            form.resetFields();
            setIsModalOpen(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            notification.error({ message: "Lỗi khi lưu", description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm mới lịch chiếu"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item name="movieId" label="Phim" rules={[{ required: true, message: "Vui lòng chọn phim" }]}>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleMovieChange}
                        placeholder="Chọn phim">
                        {movies.map((movie) => (
                            <Select.Option key={movie.id} value={movie.id}>
                                {movie.movieName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="date" label="Ngày chiếu" rules={[{ required: true, message: "Vui lòng chọn ngày chiếu" }]}>
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày chiếu"
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}>
                    <TimePicker
                        format="HH:mm"
                        style={{ width: "100%" }}
                        placeholder="Chọn giờ bắt đầu"
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="bufferTime" label="Khoảng nghỉ (phút)" rules={[{ required: true, message: "Vui lòng nhập khoảng nghỉ" }]}>
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="roomId" label="Phòng chiếu" rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}>
                    <Select placeholder="Chọn phòng" disabled={
                        !form.getFieldValue("movieId") ||
                        !form.getFieldValue("date") ||
                        !form.getFieldValue("startTime") ||
                        form.getFieldValue("bufferTime") === undefined}>
                        {rooms.map((room) => (
                            <Select.Option key={room.id} value={room.id}>
                                {room.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Mở" unCheckedChildren="Tắt" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleModal;
