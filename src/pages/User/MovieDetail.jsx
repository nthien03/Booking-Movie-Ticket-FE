import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import ScheduleByMovieModal from '../../components/modal/ScheduleByMovieModal'

export default function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [showTrailer, setShowTrailer] = useState(false)
    const [showSchedule, setShowSchedule] = useState(false)
    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/movies/${id}`)
            .then((res) => setMovie(res.data.data))
            .catch((err) => console.error(err))
    }, [id])

    const fetchSchedules = () => {
        axios.get(`http://localhost:8080/api/v1/schedules/movie/${id}`)
            .then((res) => {
                setSchedules(res.data.data || [])
                setShowSchedule(true)
            })
            .catch((err) => {
                console.error('Failed to fetch schedules:', err)
                setSchedules([])
                setShowSchedule(true)
            })
    }

    if (!movie) return <div>Loading...</div>

    const closeTrailerModal = () => setShowTrailer(false)
    const closeScheduleModal = () => setShowSchedule(false)

    const getEmbedUrl = (url) => {
        if (url.includes('youtu.be')) {
            const videoId = url.split('/').pop()
            return `https://www.youtube.com/embed/${videoId}`
        } else if (url.includes('watch?v=')) {
            return url.replace('watch?v=', 'embed/')
        }
        return url
    }

    return (
        <div
            className="text-white"
            style={{
                backgroundImage: `url(http://localhost:8080/storage/poster/${movie.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            {/* overlay mờ */}
            <div className="bg-black bg-opacity-70 w-full h-full px-6 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3">
                            <img
                                src={`http://localhost:8080/storage/poster/${movie.poster}`}
                                alt={movie.movieName}
                                className="rounded-xl w-full object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold uppercase text-white">
                                {movie.movieName}
                            </h2>

                            <div className="text-sm text-gray-300 space-y-1">
                                <p><span className="font-semibold">Thể loại:</span> {movie.genres.join(', ')}</p>
                                <p><span className="font-semibold">Thời lượng:</span> {movie.duration} phút</p>
                                <p><span className="font-semibold">Đạo diễn:</span> {movie.director}</p>
                                <p><span className="font-semibold">Diễn viên:</span> {movie.actors.join(', ')}</p>
                                <p><span className="font-semibold">Khởi chiếu:</span> {new Date(movie.releaseDate).toLocaleDateString('vi-VN',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}</p>
                            </div>

                            <div
                                className="text-sm text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: movie.description }}
                            />

                            <div className="text-sm text-orange-600">
                                {movie.ageRestriction === 0
                                    ? 'Kiểm duyệt: P - Phim được phép phổ biến đến người xem ở mọi độ tuổi.'
                                    : `Kiểm duyệt: T${movie.ageRestriction} - Phim được phổ biến đến người xem từ đủ ${movie.ageRestriction} tuổi trở lên (${movie.ageRestriction}+)`}
                            </div>


                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="mt-8 text-sm border border-yellow-600 text-yellow-600 px-4 py-2 rounded-full font-semibold transition-transform duration-200 hover:scale-110"
                                >
                                    Xem trailer
                                </button>

                                <button
                                    onClick={fetchSchedules}
                                    style={{
                                        color: 'rgb(61, 149, 212)',
                                        border: '1px solid rgb(61, 149, 212)',
                                    }}
                                    className="mt-8 text-sm px-4 py-2 rounded-full font-semibold transition-transform duration-200 hover:scale-110"
                                >
                                    Đặt vé
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showTrailer && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
                    <div className="bg-black rounded-xl overflow-hidden max-w-3xl w-full relative">
                        <button
                            onClick={closeTrailerModal}
                            className="absolute top-2 right-2 text-white text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src={getEmbedUrl(movie.trailerUrl)}
                                title="Trailer"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="w-full h-96"
                            />
                        </div>
                    </div>
                </div>
            )}

            {showSchedule && (
                <ScheduleByMovieModal
                    schedules={schedules}
                    onClose={closeScheduleModal}
                />
            )}
        </div>
    )
}
