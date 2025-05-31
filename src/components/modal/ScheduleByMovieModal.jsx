import React, { useState } from 'react';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function ScheduleByMovieModal({ schedules, onClose }) {
    // Nhóm lịch chiếu theo ngày
    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const dateObj = dayjs(schedule.date);
        const dateKey = dateObj.format('DD/MM/YYYY'); // Format như "31/05/2025"

        console.log('Original date:', schedule.date, 'Formatted:', dateKey);

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(schedule);
        return acc;

        // const date = schedule.date ? new Date(schedule.date).toLocaleDateString('vi-VN') : ''
        // console.log(date)
        // if (!acc[date]) acc[date] = []
        // acc[date].push(schedule)
        // return acc
    }, {})

    const formatDateDisplay = (dateKey) => {
        // Parse lại từ format "31/05/2025"
        const d = dayjs(dateKey, 'DD/MM/YYYY', true).hour(12);

        // console.log('------------------------');
        // console.log('dateKey:', dateKey);             // chuỗi gốc
        // console.log('Parsed dayjs:', d.toString());   // để xem thực tế nó parse ra ngày gì
        // console.log('isValid:', d.isValid());         // xem có đúng format không
        // console.log('format DD/MM:', d.format('DD/MM'));
        // console.log('------------------------');

        const isToday = d.isSame(dayjs(), 'day');
        const dayName = isToday ? 'Hôm Nay' : d.format('dddd');
        const dayDate = d.format('DD/MM');

        return { dayName, dayDate };
    };

    const dates = Object.keys(groupedSchedules).sort((a, b) => {
        // Sort theo thứ tự ngày tháng
        const dateA = dayjs(a, 'DD/MM/YYYY');
        const dateB = dayjs(b, 'DD/MM/YYYY');
        return dateA.isAfter(dateB) ? 1 : -1;
    });
    console.log('Dates:', dates);
    const [selectedDate, setSelectedDate] = useState(dates[0] || '');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-800 text-2xl font-bold"
                >
                    &times;
                </button>

                {/* Tabs chọn ngày */}
                <div className="flex gap-3 overflow-x-auto mb-6 pb-1">
                    {dates.map(date => {
                        //console.log('Processing date:', date);
                        const { dayName, dayDate } = formatDateDisplay(date);
                        //console.log('Formatted date:', date, 'Day name:', dayName, 'Day date:', dayDate);
                        const isSelected = selectedDate === date;

                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[60px] transition-all duration-200 text-sm font-medium ${isSelected
                                    ? 'bg-[rgb(61,149,212)] text-white shadow'
                                    : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
                                    }`}
                            >
                                <span className="capitalize">{dayName}</span>
                                <span className="font-semibold">{dayDate}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Giờ chiếu */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {selectedDate && groupedSchedules[selectedDate] && (
                        <div>
                            <div className="flex flex-wrap gap-3">
                                {groupedSchedules[selectedDate].map(sch => (
                                    <button
                                        key={sch.id}
                                        className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-[rgb(61,149,212)] hover:text-white transition"
                                    >
                                        {dayjs(sch.startTime).format('HH:mm')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>


    );
}
