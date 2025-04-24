import React, { useState } from 'react'
import { Table, Input, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { callApiFilm, callApiXoaPhim } from '../../../redux/reducers/FilmReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'

const { Search } = Input;

export default function Film() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { arrFilm } = useSelector(state => state.FilmReducer)
    const [data, setData] = useState([])

    // useEffect(() => {
    //     dispatch(callApiFilm)
    // }, [])

    // useEffect(() => {
    //     setData(arrFilm)
    // }, [arrFilm])

    // Giả lập dữ liệu phim
    useEffect(() => {
        const mockData = [
            {
                maPhim: 1,
                hinhAnh: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018473_0.jpg&w=384&q=75',
                tenPhim: 'A MINECRAFT MOVIE-K - Phụ đề',
                daoDien: 'Anthony Russo, Joe Russo',
                thoiLuong: '181 phút',
                ngayKhoiChieu: '2019-04-26',
            },
            {
                maPhim: 2,
                hinhAnh: 'https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018479_0.jpg&w=384&q=75',
                tenPhim: 'PORORO THÁM HIỂM ĐẠI DƯƠNG XANH - P - Lồng tiếngPORORO THÁM HIỂM ĐẠI DƯƠNG XANH - P - Lồng tiếngPORORO THÁM HIỂM ĐẠI DƯƠNG XANH - P - Lồng tiếng',
                daoDien: 'Anthony Russo, Joe Russo',
                thoiLuong: '181 phút',
                ngayKhoiChieu: '2019-04-26',
            },
            {
                maPhim: 3,
                hinhAnh: 'https://via.placeholder.com/150?text=Film+3',
                tenPhim: 'Inception',
                daoDien: 'Anthony Russo, Joe Russo',
                thoiLuong: '181 phút',
                ngayKhoiChieu: '2019-04-26',
            },
            {
                maPhim: 4,
                hinhAnh: 'https://via.placeholder.com/150?text=Film+4',
                tenPhim: 'The Dark Knight',
                daoDien: 'Anthony Russo, Joe Russo',
                thoiLuong: '181 phút',
                ngayKhoiChieu: '2019-04-26',
            },
            {
                maPhim: 5,
                hinhAnh: 'https://via.placeholder.com/150?text=Film+5',
                tenPhim: 'Titanic',
                daoDien: 'Anthony Russo, Joe Russo',
                thoiLuong: '181 phút',
                ngayKhoiChieu: '2019-04-26',
            },
        ];
        setData(mockData);
    }, []);

    const searchKeyword = (value) => {
        setData(arrFilm.filter(item => {
            if (value.trim() == '') {
                return item
            }
            else {
                let keyLower = value.toLocaleLowerCase()
                let itemLower = item.tenPhim.toLocaleLowerCase()
                return itemLower.includes(keyLower)
            }
        }))
    }
    const columns = [
        // {
        //     title: 'Mã phim',
        //     dataIndex: 'maPhim',
        //     sorter: (a, b) => a.maPhim - b.maPhim,
        //     sortDirections: ['descend'],
        //     width: 150,
        // },
        {
            title: 'Hình ảnh',
            dataIndex: 'hinhAnh',
            render: (text, film, index) => {
                return <>
                    <img src={film.hinhAnh} alt={film.hinhAnh} width='60' height='80'
                        onError={(e) => { e.target.onError = null; e.target.src = `https://picsum.photos/id/${index}/50/50` }} />
                </>
            },
            width: 100
        },
        {
            title: 'Tên phim',
            dataIndex: 'tenPhim',
            sorter: (a, b) => {
                let tenPhimA = a.tenPhim.toLowerCase().trim();
                let tenPhimB = b.tenPhim.toLowerCase().trim();
                if (tenPhimA > tenPhimB) {
                    return 1
                }
                return -1
            },
            render: (text, film) => {
                return film.tenPhim.length > 50 ? film.tenPhim.slice(0, 50) + '...' : film.tenPhim
            },
            sortDirections: ['descend'],
        },
        {
            title: 'Đạo diễn',
            dataIndex: 'daoDien',
            render: (text, film) => film.daoDien,
        },
        {
            title: 'Thời lượng',
            dataIndex: 'thoiLuong',
            render: (text, film) => film.thoiLuong,
        },
        {
            title: 'Ngày khởi chiếu',
            dataIndex: 'ngayKhoiChieu',
            render: (text, film) => new Date(film.ngayKhoiChieu).toLocaleDateString(),
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, film) => {
                return <>
                    <Tooltip placement="leftBottom" title={'Chỉnh sửa phim'}>
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
                    </Tooltip>
                </>
            },
            width: 150
        },
    ];
    return <div className='adminFilm'>
        <h2 className='text-2xl uppercase font-bold mb-4'>Quản lý Phim</h2>

        <Button onClick={() => navigate('/admin/film/addnewfilm')} className='mb-4 font-semibold border-black'>Thêm phim</Button>

        <Search
            className='mb-4'
            placeholder="Tìm kiếm theo tên"
            enterButton='Search'
            size="large"
            onSearch={searchKeyword}
        />
        <div className="overflow-x-auto">
            {/* div con có min-width để ép table luôn rộng 768px */}
            <div className="min-w-[768px]">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="maPhim"
                // có thể thêm scroll nếu muốn
                // scroll={{ x: 768 }}
                />
            </div>
        </div>


        {/* <Table columns={columns} dataSource={data} rowKey='maPhim' /> */}
    </div>;
};
