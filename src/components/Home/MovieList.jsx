import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import MovieGrid from './MovieGrid'
import { useLocation } from 'react-router-dom'
import useRoute from '../../hooks/useRoute'
import axios from 'axios'

export default function MovieList() {
    const [keyword, setKeyword] = useState('')
    const [filteredFilms, setFilteredFilms] = useState([])
    const [arrFilmDangChieu, setArrFilmDangChieu] = useState([])
    const [arrFilmSapChieu, setArrFilmSapChieu] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('1')

    const { navigate } = useRoute()
    const location = useLocation()

    // Lấy dữ liệu phim từ API - chuyển từ Home.jsx sang
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true)
                const fetchDangChieu = axios.get('http://localhost:8080/api/v1/movies/now-showing')
                const fetchSapChieu = axios.get('http://localhost:8080/api/v1/movies/now-showing') // Đã sửa API endpoint cho đúng

                const [resDangChieu, resSapChieu] = await Promise.all([fetchDangChieu, fetchSapChieu])

                const dangChieuData = resDangChieu.data.data || []
                const sapChieuData = resSapChieu.data.data || []

                setArrFilmDangChieu(dangChieuData)
                setArrFilmSapChieu(sapChieuData)

                // Thiết lập dữ liệu cho tab đang active ban đầu
                if (activeTab === '1') {
                    setFilteredFilms(dangChieuData)
                } else {
                    setFilteredFilms(sapChieuData)
                }
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu phim:', err)
                setError('Không thể tải danh sách phim, vui lòng thử lại sau')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovies()
    }, [])

    // Scroll theo hash khi location thay đổi
    useEffect(() => {
        if (location.hash) {
            const elem = document.getElementById(location.hash.slice(1))
            if (elem) elem.scrollIntoView({ behavior: 'smooth' })
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
    }, [location])

    // Hàm tìm kiếm phim đang chiếu khi người dùng submit form
    const handleSearch = async (e) => {
        e.preventDefault()
        const searchKeyword = keyword.trim()

        if (searchKeyword) {
            try {
                // Chỉ tìm kiếm trong danh sách phim đang chiếu
                const url = `http://localhost:8080/api/v1/movies/now-showing?keyword=${encodeURIComponent(searchKeyword)}`
                const res = await fetch(url)

                if (!res.ok) throw new Error('Lỗi khi tìm kiếm phim')

                const json = await res.json()

                // Nếu đang ở tab phim đang chiếu, hiển thị kết quả tìm kiếm
                if (activeTab === '1') {
                    setFilteredFilms(json.data || [])
                }
            } catch (error) {
                console.error(error)
                if (activeTab === '1') {
                    setFilteredFilms([])
                }
            }
        } else {
            // Nếu không có từ khóa, hiển thị lại tất cả phim của tab hiện tại
            setFilteredFilms(activeTab === '1' ? arrFilmDangChieu : arrFilmSapChieu)
        }
    }

    // Xử lý khi chuyển tab
    const handleTabChange = (key) => {
        setActiveTab(key)
        // Reset từ khóa tìm kiếm chỉ khi chuyển từ tab phim đang chiếu sang tab khác
        if (key !== '1') {
            setKeyword('')
        }
        setFilteredFilms(key === '1' ? arrFilmDangChieu : arrFilmSapChieu)
    }

    // Hiển thị thông báo loading hoặc lỗi
    if (isLoading) return <div className="text-center py-8">Đang tải danh sách phim...</div>
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>

    return (
        <div id="movie-list" className="movie-list container mx-auto md:px-8 lg:px-10">
            {/* Search input dùng chung cho desktop và mobile */}
            <div className="bg-white rounded-lg shadow-2xl py-4 px-6 w-full md:w-3/4 xl:w-2/3 mx-auto -mt-10 z-10 mb-10 relative">
                <form
                    onSubmit={handleSearch}
                    className="flex items-center"
                >
                    <input
                        type="search"
                        placeholder="🔍 Tìm kiếm phim đang chiếu theo tên"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </form>
            </div>

            {/* Tabs cho desktop */}
            <Tabs
                className="hidden md:block centered-tabs"
                defaultActiveKey="1"
                activeKey={activeTab}

                onChange={handleTabChange}
                items={[
                    {
                        label: 'Phim đang chiếu',
                        key: '1',
                        children: <MovieGrid arrFilm={filteredFilms} />,
                    },
                    {
                        label: 'Phim sắp chiếu',
                        key: '2',
                        children: <MovieGrid arrFilm={filteredFilms} />,
                    },
                ]}
            />

            {/* Grid cho mobile */}
            <div className="block mt-8 md:hidden">
                {/* Tab chọn cho mobile */}
                <div className="flex mb-4 border-b border-gray-200">
                    <button
                        className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === '1' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('1')}
                    >
                        Phim đang chiếu
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === '2' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('2')}
                    >
                        Phim sắp chiếu
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFilms.map((itemFilm, index) => {
                        // Format thời lượng phim và ngày phát hành
                        const formattedDuration = itemFilm.duration ? `${itemFilm.duration} phút` : '';

                        const formattedDate = itemFilm.releaseDate
                            ? new Date(itemFilm.releaseDate).toLocaleDateString('vi-VN')
                            : '';

                        return (
                            <div
                                key={index}
                                className="rounded-lg shadow-xl bg-white text-gray-800 h-full flex flex-col"
                            >
                                <div
                                    className="cursor-pointer h-48 sm:h-60"
                                    onClick={() => navigate(`detail/${itemFilm.id}`)}
                                    style={{ aspectRatio: '3/4' }}
                                >
                                    <img
                                        src={`http://localhost:8080/storage/poster/${itemFilm.poster}`}
                                        alt={itemFilm.movieName}
                                        onError={(e) => {
                                            e.target.onerror = null
                                            e.target.src = 'https://picsum.photos/300/400'
                                        }}
                                        className="object-cover object-center w-full h-full rounded-t-lg"
                                    />
                                </div>
                                <div className="flex flex-col justify-between p-3 flex-grow">
                                    <h2 className="film-name-card-mobile font-semibold text-sm mb-1 line-clamp-2 h-10">
                                        {itemFilm.movieName.toUpperCase()}
                                    </h2>
                                    <div className="text-xs text-gray-600 mb-2">
                                        <div className="flex justify-between mb-1">
                                            <span>Thời lượng:</span>
                                            <span>{formattedDuration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Khởi chiếu:</span>
                                            <span>{formattedDate}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`detail/${itemFilm.id}`)}
                                        className="flex items-center justify-center w-full p-2 font-semibold rounded-md bg-yellow-500 text-white mt-auto"
                                    >
                                        Đặt vé
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}