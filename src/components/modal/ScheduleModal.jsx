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

const ScheduleModal = ({ isModalOpen, setIsModalOpen, dataInit = null, onSuccess }) => {
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
                    axios.get("http://localhost:8080/api/v1/movies"),
                ]);
                setMovies(moviesRes.data);
                console.log("Movies:", moviesRes.data);
            } catch (err) {
                notification.error({ message: "Lỗi khi tải dữ liệu", description: err.message });
            }
        };
        fetchData();
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            if (dataInit) {
                form.setFieldsValue({
                    movieId: dataInit.movie.id,
                    roomId: dataInit.room.id,
                    date: moment(dataInit.date),
                    startTime: moment(dataInit.startTime),
                    bufferTime: dataInit.bufferTime,
                    status: dataInit.status,
                });
                const movie = movies.find((m) => m.id === dataInit.movie.id);
                setDuration(movie?.duration || 0);
            } else {
                form.resetFields();
                setDuration(0);
                form.setFieldsValue({ status: true });
                setRooms([]);
            }
        }
    }, [isModalOpen, dataInit, movies]);

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
            if (dataInit?.id) {
                await axios.put(`http://localhost:8080/api/v1/schedules/${dataInit.id}`, payload);
                notification.success({ message: "Cập nhật lịch chiếu thành công!" });
            } else {
                await axios.post("http://localhost:8080/api/v1/schedules", payload);
                notification.success({ message: "Thêm mới lịch chiếu thành công!" });
            }
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
            title={dataInit ? "Cập nhật lịch chiếu" : "Thêm mới lịch chiếu"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={dataInit ? "Cập nhật" : "Lưu"}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item name="movieId" label="Phim" rules={[{ required: true }]}>
                    <Select onChange={handleMovieChange} placeholder="Chọn phim">
                        {movies.map((movie) => (
                            <Select.Option key={movie.id} value={movie.id}>
                                {movie.movieName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="date" label="Ngày chiếu" rules={[{ required: true }]}>
                    <DatePicker
                        style={{ width: "100%" }}
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
                    <TimePicker
                        format="HH:mm"
                        style={{ width: "100%" }}
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="bufferTime" label="Buffer Time (phút)" rules={[{ required: true }]}>
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        onChange={() => triggerRoomCheck()}
                    />
                </Form.Item>

                <Form.Item name="roomId" label="Phòng chiếu" rules={[{ required: true }]}>
                    <Select placeholder="Chọn phòng">
                        {rooms.map((room) => (
                            <Select.Option key={room.id} value={room.id}>
                                {room.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Mở" unCheckedChildren="Ẩn" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleModal;
