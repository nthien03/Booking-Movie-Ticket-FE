
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function MovieSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {Array(count).fill().map((_, i) => (
                <div key={i} className="p-2">
                    <Skeleton height={300} />
                    <Skeleton height={20} style={{ marginTop: 10 }} />
                    <Skeleton height={20} width={80} />
                </div>
            ))}
        </div>
    )
}
