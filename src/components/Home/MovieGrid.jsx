import React from 'react'
import { Card } from 'antd'
import useRoute from '../../hooks/useRoute'

export default function MovieGrid({ arrFilm = [] }) {
  const { navigate } = useRoute()

  const getSafeField = (film, field1, field2) => film[field1] || film[field2] || ''

  const formatDuration = (minutes) => {
    if (!minutes) return ''
    return `${minutes} phút`
  }

  return (
    <div className="px-8 md:px-24 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10 animate__animated animate__fadeInUp animate__fast pb-6">
      {arrFilm.map((film, index) => {
        const id = getSafeField(film, 'id', 'maPhim')
        const title = getSafeField(film, 'movieName', 'tenPhim')
        const image = getSafeField(film, 'poster', 'hinhAnh')
        const duration = film.duration || 0
        const releaseDate = film.releaseDate || ''
        const imageUrl = image.startsWith('http')
          ? image
          : `http://localhost:8080/storage/poster/${image}`
        const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : ''

        return (
          <div
            key={index}
            className="cursor-pointer flex flex-col w-full max-w-[250px] mx-auto"
          >
            <div
              className="w-full aspect-[3/4] overflow-hidden rounded-lg"
              onClick={() => navigate(`movies/${id}`)}
            >
              <img
                src={imageUrl}
                className="w-full h-full object-cover"
                alt={title}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://picsum.photos/300/400'
                }}
              />
            </div>
            <h2 className="text-sm font-bold uppercase text-left mt-3 line-clamp-2 leading-tight min-h-[35px]">
              {title}
            </h2>

            <div className="text-s text-gray-800 leading-snug text-left mt-2">
              <div><span className="font-semibold">Thời lượng:</span> {formatDuration(duration)}</div>
              <div><span className="font-semibold">Khởi chiếu:</span> {formattedDate}</div>
            </div>
            {/* <button
              onClick={() => navigate(`detail/${id}`)}
              className="mt-2 w-full py-1 bg-sky-500 hover:bg-sky-600 text-white text-base font-semibold rounded transition duration-300"
            >
              Đặt vé
            </button> */}
          </div>
        )
      })}
    </div>
  )
}
