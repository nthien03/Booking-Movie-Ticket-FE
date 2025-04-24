import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MovieList from '../../components/Home/MovieList'
import HomeCarousel from '../../components/Home/HomeCarousel'
import MenuCinema from '../../components/Home/MenuCinema'
import LoadingPage from '../LoadingPage'
import { callApiFilm, getFilmList } from '../../redux/reducers/FilmReducer'
import { LayHeThongRapChieu } from '../../redux/reducers/CinemaReducer'
import { history } from '../../utils/history'
import { LayThongTinLichChieuHeThongRap } from '../../services/CinemaService'

export default function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const { arrFilm } = useSelector(state => state.FilmReducer)
    // const { heThongRapChieu } = useSelector(state => state.CinemaReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        history.listen(() => {
            window.scrollTo(0, 0);
        });
        dispatch(callApiFilm)

        // const getApiHeThongRapChieu = async() => {
        //     try {
        //         const apiHeThongRap = await LayThongTinLichChieuHeThongRap()
        //         dispatch(LayHeThongRapChieu(apiHeThongRap.data.content))
        //         setIsLoading(false)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getApiHeThongRapChieu()
    }, [])

    // return (
    //     <div>
    //         {isLoading ? <LoadingPage /> : <>
    //             <HomeCarousel />
    //             <MovieList arrFilm={arrFilm} />
    //             {/* <MenuCinema heThongRapChieu={heThongRapChieu} /> */}
    //         </>}
    //     </div>
    // )
    return (
        <div>
            {/* Hiển thị luôn phần giao diện mà không cần chờ isLoading */}
            <HomeCarousel />
            <MovieList arrFilm={arrFilm} />
        </div>
    )

    // return (
    //     <div>
    //         {isLoading ? <LoadingPage /> : null}  {/* Bạn có thể hiển thị LoadingPage tại đây nếu muốn */}

    //         {/* Hiển thị luôn phần carousel, movie list, menu */}
    //         <HomeCarousel />
    //         {/* <MovieList arrFilm={arrFilm} /> */}
    //         {/* <MenuCinema heThongRapChieu={heThongRapChieu} /> */}
    //     </div>
    // )

    // return (
    //     <div>
    //         {isLoading ? (
    //             <LoadingPage />  // Hiển thị LoadingPage khi đang tải
    //         ) : (
    //             <>
    //                 {/* Hiển thị các phần tử khác khi isLoading = false */}
    //                 <HomeCarousel />
    //                 <MovieList arrFilm={arrFilm} />
    //             </>
    //         )}
    //     </div>
    // );

    // return (
    //     <div>
    //         {isLoading ? <LoadingPage /> : null} {/* Hiển thị LoadingPage khi đang tải dữ liệu */}
    //         <HomeCarousel /> {/* Chỉ hiển thị phần carousel */}
    //         {/* Bạn có thể bỏ qua các phần khác cho đến khi cần */}
    //         <MovieList arrFilm={arrFilm} />
    //         {/* /* <MenuCinema heThongRapChieu={heThongRapChieu} /> */}
    //     </div>
    // );


}
