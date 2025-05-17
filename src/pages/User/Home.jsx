import React, { useEffect } from 'react'
import MovieList from '../../components/Home/MovieList'
import HomeCarousel from '../../components/Home/HomeCarousel'
import { history } from '../../utils/history'

export default function Home() {
    useEffect(() => {
        history.listen(() => {
            window.scrollTo(0, 0)
        })
    }, [])

    return (
        <div>
            <HomeCarousel />
            <MovieList />
        </div>
    )
}