import React, { useState } from 'react'
import { Table, Input, Button, Tooltip, Tag, Modal, Form, Select, DatePicker, InputNumber, Upload, notification, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { EditOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { FiPlus, FiUpload } from "react-icons/fi";
import CreateMovieModal from '../../../components/modal/CreateMovieModal';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';


const { Search } = Input;

export default function Film() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { arrFilm } = useSelector(state => state.FilmReducer)
    const [data, setData] = useState([])
    const [openCreateScheduleModal, setCreateScheduleModal] = useState(false)
    const [openCreateMovieModal, setOpenCreateMovieModal] = useState(false)
    const [openViewMovieModal, setOpenViewMovieModal] = useState(false)
    const [openEditMovieModal, setOpenEditMovieModal] = useState(false)
    // useEffect(() => {
    //     dispatch(callApiFilm)
    // }, [])

    // useEffect(() => {
    //     setData(arrFilm)
    // }, [arrFilm])
    const defaultRoomOptions = [
        { label: "Phòng chiếu số 1", value: 1 },
        { label: "Phòng chiếu số 2", value: 2 },
        { label: "Phòng chiếu số 3", value: 3 },
    ];

    useEffect(() => {
        // URL API để lấy danh sách phim
        axios.get('http://localhost:8080/api/v1/movies') // Thay URL này với URL thực tế của bạn
            .then(response => {
                if (response.data) {
                    setData(response.data); // Cập nhật dữ liệu vào state
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể lấy dữ liệu phim từ server.',
                    });
                }
            })
            .catch(error => {
                notification.error({
                    message: 'Lỗi',
                    description: 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                });
                console.error('Error fetching data:', error);
            });
    }, []); // Chạy khi component mount lần đầu
    // useEffect(() => {
    //     const mockData = [
    //         {
    //             id: 1, // thay vì maPhim
    //             poster: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018473_0.jpg&w=384&q=75', // thay vì hinhAnh
    //             movieName: 'A MINECRAFT MOVIE-K - Phụ đề', // thay vì tenPhim
    //             director: 'Anthony Russo, Joe Russo', // thay vì daoDien
    //             duration: '181 phút', // thay vì thoiLuong
    //             releaseDate: '2019-04-26', // thay vì ngayKhoiChieu
    //         },
    //     ];
    //     setData(mockData);
    // }, []);

    const searchKeyword = (value) => {
        setData(prevData => prevData.filter(item => {
            if (value.trim() === '') return true;
            return item.movieName.toLowerCase().includes(value.toLowerCase());
        }));
    }
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend'],
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'poster',
            render: (text, film, index) => {
                const imageUrl = `http://localhost:8080/storage/poster/${film.poster}`;
                return <>
                    <img src={imageUrl} alt={film.poster} width='60' height='80'
                        onError={(e) => { e.target.onError = null; e.target.src = `https://picsum.photos/id/${index}/50/50` }} />
                </>
            },
            width: 100
        },
        {
            title: 'Tên phim',
            dataIndex: 'movieName',
            sorter: (a, b) => {
                let tenPhimA = a.movieName.toLowerCase().trim();
                let tenPhimB = b.movieName.toLowerCase().trim();
                if (tenPhimA > tenPhimB) {
                    return 1
                }
                return -1
            },
            render: (text, film) => {
                return film.movieName.length > 50 ? film.movieName.slice(0, 50) + '...' : film.movieName
            },
            sortDirections: ['descend'],
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration',
            render: (text, film) => `${film.duration} phút`,
        },

        {
            title: 'Ngày khởi chiếu',
            dataIndex: 'releaseDate',
            render: (text, film) => new Date(film.releaseDate).toLocaleDateString('vi-VN',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, film) => {
                return <>
                    {/* <Tooltip placement="leftBottom" title={'Chỉnh sửa phim'}>
                        <NavLink key={1} className='bg-dark text-blue-600 mr-3 text-2xl ' to={`/admin/film/edit/${film.maPhim}`}><EditOutlined /></NavLink>
                    </Tooltip>
                    <Tooltip placement="bottom" title={'Xóa phim'}>
                        <button onClick={() => {
                            Swal.fire({
                                title: 'Bạn có muốn xóa phim này không ?',
                                showDenyButton: true,
                                confirmButtonText: 'Đồng ý',
                                denyButtonText: 'Hủy',
                                icon: 'question',
                                iconColor: 'rgb(104 217 254)',
                                confirmButtonColor: '#f97316'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    dispatch(callApiXoaPhim(film.maPhim))
                                }
                            })
                        }} key={2} className='bg-dark text-red-600 text-2xl hover:text-red-400'><DeleteOutlined /></button>
                    </Tooltip>
                    <Tooltip placement="topRight" title={'Tạo lịch chiếu'}>
                        <NavLink key={3} className='bg-dark text-orange-600 hover:text-orange-400 ml-3 text-2xl ' to={`/admin/film/showtime/${film.maPhim}/${film.tenPhim}`}><CalendarOutlined /></NavLink>
                    </Tooltip> */}
                    {/* Xem phim */}
                    <Tooltip placement="leftBottom" title={'Xem chi tiết phim'}>
                        <button
                            key={1}
                            onClick={() => setOpenViewMovieModal(true)}
                            className="bg-dark text-green-600 mr-6 text-xl"
                        >
                            <EyeOutlined />
                        </button>
                    </Tooltip>

                    {/* Sửa phim */}
                    <Tooltip placement="bottom" title={'Chỉnh sửa phim'}>
                        <button
                            key={2}
                            onClick={() => setOpenEditMovieModal(true)}
                            className="bg-dark text-blue-600 text-xl"
                        >
                            <EditOutlined />
                        </button>
                    </Tooltip>

                    {/* Tạo lịch chiếu
                    <Tooltip placement="topRight" title={'Tạo lịch chiếu'}>
                        <button
                            key={3}
                            onClick={() => setCreateScheduleModal(true)}
                            className="bg-dark text-orange-600 hover:text-orange-400 ml-3 text-2xl"
                        >
                            <CalendarOutlined />
                        </button>
                    </Tooltip> */}

                </>
            },
            width: 150
        },
    ];
    return <div className='adminFilm'>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}
            className='mb-6'>
            <h2 className='text-2xl uppercase font-bold'>Quản lý Phim</h2>

            <Button
                onClick={() => setOpenCreateMovieModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                aria-label="Add New Movie"
            >
                <FiPlus /> Thêm mới phim
            </Button>

        </div>

        <Search
            className='mb-4'
            placeholder="Tìm kiếm theo tên"
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={searchKeyword}
        />
        <div className="overflow-x-auto">
            {/* div con có min-width để ép table luôn rộng 768px */}
            <div className="min-w-[768px]">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                // có thể thêm scroll nếu muốn
                // scroll={{ x: 768 }}
                />
            </div>
        </div>

        <CreateMovieModal
            isModalOpen={openCreateMovieModal}
            setIsModalOpen={setOpenCreateMovieModal}
        />

        {/* <CreateScheduleModal
            isModalOpen={openCreateScheduleModal}
            setIsModalOpen={setCreateScheduleModal}
            movieOptions={data.map(film => ({
                label: film.movieName,  // Tên phim
                value: film.id,         // ID phim
            }))}
            roomOptions={defaultRoomOptions}
        /> */}


        {/* <Table columns={columns} dataSource={data} rowKey='maPhim' /> */}
    </div>;
};
