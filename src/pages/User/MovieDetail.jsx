import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/movies/${id}`)
            .then((res) => setMovie(res.data.data))
            .catch((err) => console.error(err))
    }, [id])

    if (!movie) return <div>Loading...</div>

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
            <div className="bg-black bg-opacity-80 w-full h-full px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster thu nhỏ */}
                        <div className="w-full md:w-1/3">
                            <img
                                src={`http://localhost:8080/storage/poster/${movie.poster}`}
                                alt={movie.movieName}
                                className="rounded-xl w-full object-cover"
                            />
                        </div>

                        {/* Thông tin phim */}
                        <div className="flex-1 space-y-4">
                            <h2 className="text-3xl font-bold uppercase text-white">
                                {movie.movieName}
                            </h2>

                            <div className="text-base text-gray-300 space-y-1">
                                <p><span className="font-semibold">Thể loại:</span> {movie.genres.join(', ')}</p>
                                <p><span className="font-semibold">Thời lượng:</span> {movie.duration} phút</p>
                                <p><span className="font-semibold">Đạo diễn:</span> {movie.director}</p>
                                <p><span className="font-semibold">Diễn viên:</span> {movie.actors.join(', ')}</p>
                                <p><span className="font-semibold">Khởi chiếu:</span> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>
                            </div>

                            <div
                                className="text-base text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: movie.description }}
                            />

                            <div className="text-base text-red-500 font-medium">
                                Kiểm duyệt: {movie.ageRestriction}+  Phim được phổ biến đến người từ đủ {movie.ageRestriction} tuổi trở lên
                            </div>

                            <div className="flex gap-4 mt-4">
                                {/* <button className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">Chi tiết nội dung</button> */}
                                <a
                                    href={movie.trailerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base border border-yellow-500 text-yellow-500 px-4 py-2 rounded-full font-semibold"
                                >
                                    Xem trailer
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Các suất chiếu - có thể bỏ nếu chưa cần */}
                    {/* <div className="mt-12"> ... </div> */}
                </div>
            </div>
        </div>
    )
}
