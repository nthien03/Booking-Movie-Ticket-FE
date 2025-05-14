import { DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import React from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';
import { themPhimApi } from '../../../redux/reducers/MovieReducer';
import { useDispatch } from 'react-redux';
import { GROUPID } from '../../../utils/constant';
import { SwalConfig } from '../../../utils/config';

export default () => {
    const [imgSrc, setImgSrc] = useState(null)
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            tenPhim: '',
            trailer: '',
            moTa: '',
            ngayKhoiChieu: '',
            dangChieu: false,
            sapChieu: false,
            hot: false,
            danhGia: 0,
            hinhAnh: {},
        },
        onSubmit: (value) => {
            value.maNhom = GROUPID
            let { tenPhim, trailer, moTa, ngayKhoiChieu, danhGia } = value
            if (tenPhim !== '' && trailer !== '' && moTa !== '' && ngayKhoiChieu !== '' && danhGia !== '') {
                // tạo đối tượng formData
                let formData = new FormData()
                for (let key in value) {
                    if (key !== 'hinhAnh') {
                        formData.append(key, value[key])
                    }
                    else {
                        formData.append('File', value.hinhAnh, value.hinhAnh.name)
                    }
                }
                dispatch(themPhimApi(formData))
                setImgSrc('')
            }
            else {
                SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true)
            }
        }
    })

    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value)
        }
    }

    const handleChangeDatePicker = (value) => {
        let ngayKhoiChieu = moment(value).format('DD/MM/YYYY')
        formik.setFieldValue('ngayKhoiChieu', ngayKhoiChieu)
    }

    const handleChangeFile = async (e) => {
        // lấy ra file từ e
        let file = e.target.files[0]

        if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif') {

            await formik.setFieldValue('hinhAnh', file)

            // tạo đối tượng để đọc file
            let reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                setImgSrc(e.target.result) // hình có định dạng là base 64
            }

        }
    }

    return (
        <div className='addFilmAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Thêm Phim Mới</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 10,
                }}
            >
                <Form.Item label="Tên phim">
                    <Input name='tenPhim' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Trailer">
                    <Input name='trailer' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Input name='moTa' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker format={'DD/MM/YYYY'} name='ngayKhoiChieu' onChange={handleChangeDatePicker} />
                </Form.Item>
                <Form.Item label="Đang chiếu" valuePropName="checked" >
                    <Switch onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>
                <Form.Item label="Hot" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('hot')} />
                </Form.Item>
                <Form.Item label="Số sao">
                    <InputNumber onChange={value => formik.setFieldValue('danhGia', value)} min={1} max={10} />
                </Form.Item>
                <Form.Item label="Hình ảnh">
                    <input type="file" onChange={handleChangeFile} /> <br />
                    <img src={imgSrc} alt={imgSrc} style={{ width: 150, height: 150 }} accept='image/png image/jpeg image/jpg image/gif' />
                </Form.Item>
                <Form.Item label="Tác vụ">
                    <button type='submit' className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'> Thêm phim</button>
                </Form.Item>
            </Form>
        </div>
    );
};
// import { DatePicker, Form, Input, InputNumber, Switch } from 'antd';
// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import moment from 'moment';
// import { useDispatch } from 'react-redux';
// import { themPhimApi } from '../../../redux/reducers/FilmReducer';
// import { GROUPID } from '../../../utils/constant';
// import { SwalConfig } from '../../../utils/config';

// export default () => {
//     const [imgSrc, setImgSrc] = useState(null)
//     const dispatch = useDispatch()
//     const formik = useFormik({
//         initialValues: {
//             movieName: '',
//             director: '',
//             actors: '',
//             description: '',
//             releaseDate: '',
//             duration: 0,
//             genre: '',
//             trailerUrl: '',
//             ageRestriction: 0,
//             status: false,
//             poster: {},
//         },
//         onSubmit: (value) => {
//             //     value.maNhom = GROUPID
//             //     let { movieName, director, actors, description, releaseDate, trailerUrl, genre, ageRestriction, duration, status } = value
//             //     if (movieName !== '' && director !== '' && actors !== '' && description !== '' && releaseDate !== '' && trailerUrl !== '' && genre !== '' && ageRestriction !== '' && duration > 0) {
//             //         // Tạo đối tượng formData
//             //         let formData = new FormData()
//             //         for (let key in value) {
//             //             if (key !== 'poster') {
//             //                 formData.append(key, value[key])
//             //             } else {
//             //                 formData.append('File', value.poster, value.poster.name)
//             //             }
//             //         }
//             //         dispatch(themPhimApi(formData))
//             //         setImgSrc('')
//             //     } else {
//             //         SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true)
//             //     }
//             // }
//             const formData = new FormData();

//             // Thêm dữ liệu vào formData
//             for (let key in value) {
//                 if (key !== 'poster') {
//                     formData.append(key, value[key]);
//                 } else {
//                     formData.append('poster', value.poster, value.poster.name); // Gửi hình ảnh
//                 }
//             }

//             // Gọi API thêm phim
//             // axios.post('http://localhost:8080/api/movies', formData) // Đổi URL thành đúng API của bạn
//             //     .then(response => {
//             //         console.log('Phim đã được thêm:', response.data);
//             //         alert('Thêm phim thành công');
//             //         // Xử lý sau khi thêm phim thành công
//             //     })
//             //     .catch(error => {
//             //         console.error('Lỗi khi thêm phim:', error);
//             //         alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
//             //     });


//         }
//     })

//     const handleChangeSwitch = (name) => {
//         return (value) => {
//             formik.setFieldValue(name, value)
//         }
//     }

//     const handleChangeDatePicker = (value) => {
//         let releaseDate = moment(value).format('DD/MM/YYYY')
//         formik.setFieldValue('releaseDate', releaseDate)
//     }

//     const handleChangeFile = async (e) => {
//         let file = e.target.files[0]

//         if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif') {
//             await formik.setFieldValue('poster', file)

//             let reader = new FileReader();
//             reader.readAsDataURL(file)
//             reader.onload = (e) => {
//                 setImgSrc(e.target.result)
//             }
//         }
//     }

//     return (
//         <div className='addFilmAdmin'>
//             <h2 className='text-xl uppercase font-bold mb-4'>Thêm Phim Mới</h2>
//             <Form
//                 onSubmitCapture={formik.handleSubmit}
//                 labelCol={{
//                     span: 8,
//                 }}
//                 wrapperCol={{
//                     span: 10,
//                 }}
//             >
//                 <Form.Item label="Tên phim">
//                     <Input name='movieName' onChange={formik.handleChange} />
//                 </Form.Item>
//                 <Form.Item label="Đạo diễn">
//                     <Input name='director' onChange={formik.handleChange} />
//                 </Form.Item>
//                 <Form.Item label="Diễn viên">
//                     <Input name='actors' onChange={formik.handleChange} />
//                 </Form.Item>
//                 <Form.Item label="Mô tả">
//                     <Input.TextArea name='description' onChange={formik.handleChange} rows={4} />
//                 </Form.Item>
//                 <Form.Item label="Ngày khởi chiếu">
//                     <DatePicker format={'DD/MM/YYYY'} name='releaseDate' onChange={handleChangeDatePicker} />
//                 </Form.Item>
//                 <Form.Item label="Thời lượng (phút)">
//                     <InputNumber min={1} onChange={value => formik.setFieldValue('duration', value)} />
//                 </Form.Item>
//                 <Form.Item label="Thể loại">
//                     <Input name='genre' onChange={formik.handleChange} />
//                 </Form.Item>
//                 <Form.Item label="Trailer">
//                     <Input name='trailerUrl' onChange={formik.handleChange} />
//                 </Form.Item>
//                 <Form.Item label="Giới hạn độ tuổi">
//                     <InputNumber min={1} max={18} onChange={value => formik.setFieldValue('ageRestriction', value)} />
//                 </Form.Item>
//                 {/* <Form.Item label="Đang chiếu" valuePropName="checked">
//                     <Switch onChange={handleChangeSwitch('status')} />
//                 </Form.Item> */}
//                 {/* <Form.Item label="Hình ảnh">
//                     <input type="file" onChange={handleChangeFile} accept="image/png, image/jpeg, image/jpg, image/gif" /> <br />
//                     <img src={imgSrc} alt="Poster Preview" style={{ width: 150, height: 150 }} />
//                 </Form.Item> */}
//                 <Form.Item label="Hình ảnh">
//                     <input type="file" onChange={handleChangeFile} /> <br />
//                     <img src={imgSrc} alt={imgSrc} style={{ width: 150, height: 150 }} accept='image/png image/jpeg image/jpg image/gif' />
//                 </Form.Item>
//                 <Form.Item label="   ">
//                     <button type='submit' className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'>Thêm phim</button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };
