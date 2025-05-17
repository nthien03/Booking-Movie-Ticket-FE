import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Upload, notification, Spin, message } from "antd";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { callUploadSingleFile } from '../../services/FilmService';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const CreateMovieModal = ({ isModalOpen, setIsModalOpen, dataInit }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLogo, setDataLogo] = useState([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [actorOptions, setActorOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    const ageRestrictions = [
        { value: "0", label: "All Ages" },
        { value: "13", label: "13+" },
        { value: "16", label: "16+" },
        { value: "18", label: "18+" }
    ];


    /** fetch dropdown data */
    useEffect(() => {
        if (!isModalOpen) return;           // modal chưa mở ⇒ bỏ qua
        const fetchDropdowns = async () => {
            try {
                const [actorRes, genreRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/v1/actors?size=1000`),
                    axios.get(`http://localhost:8080/api/v1/genres?size=1000`),
                ]);
                setActorOptions(
                    actorRes.data.data.result.map((a) => ({ value: a.id, label: a.fullName }))
                );
                setGenreOptions(
                    genreRes.data.data.result.map((g) => ({ value: g.id, label: g.name }))
                );
            } catch (e) {
                message.error("Không lấy được danh sách diễn viên / thể loại");
            }
        };
        fetchDropdowns();
    }, [isModalOpen]);


    useEffect(() => {
        if (dataInit?.id && dataInit?.description) {
            form.setFieldsValue({
                movieName: dataInit.movieName,
                director: dataInit.director,
                actors: dataInit.actors,
                description: dataInit.description,
                poster: dataInit.poster,
                trailerUrl: dataInit.trailerUrl,
                duration: dataInit.duration,
                genres: dataInit.genres,
                releaseDate: moment(dataInit.releaseDate), // Đảm bảo date được định dạng đúng
                ageRestriction: dataInit.ageRestriction,
            });
            setDataLogo([{
                name: dataInit.poster,
                uid: uuidv4(),
            }]);
        }
    }, [dataInit]);

    // Xử lý trước khi upload (kiểm tra file)
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ chấp nhận file JPG/PNG!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
        }

        return isJpgOrPng && isLt2M;

    };

    // const handleFileChange = ({ fileList: newFileList }) => {
    //     // Giới hạn chỉ 1 file
    //     const limitedFileList = newFileList.slice(-1);

    //     setFileList(limitedFileList);

    //     if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
    //         // Tạo URL preview
    //         setPreviewUrl(URL.createObjectURL(limitedFileList[0].originFileObj));
    //     } else {
    //         setPreviewUrl('');
    //     }
    // };
    const handleUploadFileLogo = async (options) => {
        const { file, onSuccess, onError } = options;
        //console.log("File being uploaded1:", file);  // Kiểm tra xem có file nào được gửi không

        const res = await callUploadSingleFile(file, "poster");
        console.log("Upload response:", res.data);

        if (res && res.data) {  // Kiểm tra thêm code
            const fileName = res.data.data.fileName;  // Lấy tên file từ response
            console.log("File being uploadedtrongham:", fileName);
            setDataLogo([{
                name: fileName,
                uid: uuidv4()
            }]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setDataLogo([]);
                const error = new Error(res ? res.message : "Unknown error");  // Xử lý khi không có message
                onError({ event: error });
            }
        }
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            const errorMsg = info && info.file && info.file.error && info.file.error.event && info.file.error.event.message
                ? info.file.error.event.message
                : "Đã có lỗi xảy ra khi upload file.";
            message.error(errorMsg);
        }
    };

    const handleRemoveFile = (file) => {
        setDataLogo([])
    }
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const handlePreview = async (file) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };


    const handleSubmit = async (values) => {
        console.log("Data logo before submit:", dataLogo);  // Kiểm tra dataLogo trước khi gửi
        try {
            if (dataLogo.length === 0) {
                message.error('Vui lòng upload ảnh Logo')
                return;
            }
            // Bắt đầu trạng thái loading khi submit
            setLoading(true);
            const releaseDate = moment(values.releaseDate).toISOString();  // Đảm bảo ngày tháng theo định dạng ISO 8601
            // Gửi dữ liệu lên backend bằng axios
            const response = await axios.post('http://localhost:8080/api/v1/movies', {
                movieName: values.movieName,
                director: values.director,
                actors: values.actors,
                description: values.description,
                poster: dataLogo[0]?.name, // Giả sử bạn đã upload poster thành công và lưu trữ URL
                trailerUrl: values.trailerUrl,
                duration: values.duration,
                genres: values.genres,
                releaseDate: releaseDate,
                ageRestriction: values.ageRestriction,
            });

            // Kiểm tra response từ server
            if (response.data.code === 1000) {
                notification.success({
                    message: "Thành công",
                    description: "Phim đã được tạo thành công!",
                });
                form.resetFields(); // Reset form
                setIsModalOpen(false); // Đóng modal
                window.location.reload(); // Reload trang
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Đã có lỗi xảy ra khi tạo phim. Vui lòng thử lại.",
                });
            }
        } catch (error) {
            // Xử lý lỗi khi gửi request
            notification.error({
                message: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra khi gửi dữ liệu.",
            });
        } finally {
            // Kết thúc trạng thái loading
            setLoading(false);
        }
    };

    // const uploadFile = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     const response = await axios.post('/api/upload', formData);
    //     return response.data.url; // Giả sử server trả về { url: 'đường dẫn ảnh' }
    // };




    // const handleSubmit = async (values) => {
    //     try {
    //         setLoading(true);
    //         await new Promise(resolve => setTimeout(resolve, 2000));
    //         notification.success({
    //             message: "Success",
    //             description: "Movie created successfully!"
    //         });
    //         form.resetFields();
    //         setIsModalOpen(false);
    //     } catch (error) {
    //         notification.error({
    //             message: "Error",
    //             description: "Failed to create movie. Please try again."
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleImageUpload = (info) => {
    //     if (info.file.status === "done") {
    //         setImageUrl(URL.createObjectURL(info.file.originFileObj));
    //     }
    // };
    return (
        <Modal
            title="Thêm mới phim"
            maskClosable={false}
            open={isModalOpen}
            onCancel={() => {
                // Modal.confirm({
                //     title: "Discard Changes?",
                //     content: "Are you sure you want to discard your changes?",
                //     onOk: () => {
                //         form.resetFields();
                //         setIsModalOpen(false);
                //     }
                // });
                form.resetFields();
                setIsModalOpen(false);
            }}
            footer={null}
            width={800}
            className="top-4"
        >
            <Spin spinning={loading}>
                {/* <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}> */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="movieName"
                            label="Tên phim"
                            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
                        >
                            <Input maxLength={255} />
                        </Form.Item>

                        <Form.Item
                            name="director"
                            label="Đạo diễn"
                            rules={[{ required: true, message: "Vui lòng nhập đạo diễn" }]}
                        >
                            <Input maxLength={255} />
                        </Form.Item>

                        <Form.Item
                            name="actors"
                            label="Diễn viên"
                        >
                            <Select
                                mode="multiple"
                                options={actorOptions}
                                placeholder="Chọn diễn viên"
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                } />
                        </Form.Item>

                        <Form.Item
                            name="genres"
                            label="Thể loại"
                        >
                            <Select
                                mode="multiple"
                                options={genreOptions}
                                placeholder="Chọn thể loại"
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                } />
                        </Form.Item>

                        <Form.Item
                            name="releaseDate"
                            label="Chọn ngày khởi chiếu"
                            rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu" }]}
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>

                        <Form.Item
                            name="duration"
                            label="Thời lượng (phút)"
                            tooltip="Enter movie duration in minutes"
                        >
                            <InputNumber min={1} className="w-full" />
                        </Form.Item>

                        <Form.Item
                            name="ageRestriction"
                            label="Giới hạn độ tuổi"
                        >
                            <Select options={ageRestrictions} />
                        </Form.Item>

                        <Form.Item
                            name="trailerUrl"
                            label="Trailer URL"
                            rules={[
                                { required: true, message: "Vui lòng nhập URL của trailer" },
                                { type: "url", message: "Vui lòng nhập URL hợp lệ" }
                            ]}
                        >
                            <Input placeholder="https://..." />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: false }]} // có thể thêm validate nếu muốn
                    >
                        <ReactQuill
                            theme="snow"
                            onChange={(value) => form.setFieldsValue({ description: value })}
                            value={form.getFieldValue("description")}
                            style={{ backgroundColor: "white" }}
                        />
                    </Form.Item>


                    <Form.Item
                        name="poster"
                        label="Poster phim"
                        rules={[{ required: true, message: "Vui lòng tải lên poster!" }]}
                    // valuePropName="fileList"
                    // getValueFromEvent={e => e.fileList}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            multiple={false}
                            customRequest={handleUploadFileLogo}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onRemove={(file) => handleRemoveFile(file)}
                            onPreview={handlePreview}
                            defaultFileList={
                                dataInit?.id ?
                                    [
                                        {
                                            uid: uuidv4(),
                                            name: dataInit?.logo ?? "",
                                            status: 'done',
                                            url: `http://localhost:8080/storage/poster/${dataInit?.logo}`,
                                        }
                                    ] : []
                            }

                        >
                            <div>
                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                Modal.confirm({
                                    title: "Discard Changes?",
                                    content: "Are you sure you want to discard your changes?",
                                    onOk: () => {
                                        form.resetFields();
                                        setIsModalOpen(false);
                                    }
                                });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            Lưu
                        </button>
                    </div>
                </Form>
                {/* </div> */}

            </Spin>
        </Modal>
    )
};

export default CreateMovieModal;