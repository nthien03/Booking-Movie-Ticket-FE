import axios from "axios";
import { http } from "../utils/baseUrl";
import { GROUPID } from "../utils/constant";


export const LayDanhSachPhim = () => http.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUPID}`, null)

export const LayThongTinPhimChiTiet = (id) => http.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`)

export const themPhimUpload = (formData) => http.post(`/QuanLyPhim/ThemPhimUploadHinh`, formData)

export const capNhatPhimUpload = (formData) => http.post(`/QuanLyPhim/CapNhatPhimUpload`, formData)

export const xoaPhim = (maPhim) => http.delete(`/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`)

export const callUploadSingleFile = (file, folderType) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios({
        method: 'post',
        url: 'http://localhost:8080/api/v1/files',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
