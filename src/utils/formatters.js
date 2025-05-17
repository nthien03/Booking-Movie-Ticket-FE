/**
 * Format thời lượng phim từ phút sang định dạng phút
 * @param {number} minutes - Thời lượng phim tính bằng phút
 * @returns {string} Thời lượng đã được định dạng (ví dụ: 131 phút)
 */
export const formatDuration = (minutes) => {
    if (!minutes) return '';
    return `${minutes} phút`;
};

/**
 * Format ngày tháng từ chuỗi ISO sang định dạng dd/mm/yyyy
 * @param {string} dateString - Chuỗi ngày tháng dạng ISO
 * @returns {string} Ngày đã được định dạng (ví dụ: 27/04/2025)
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

