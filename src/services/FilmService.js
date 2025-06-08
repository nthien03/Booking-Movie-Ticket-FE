import axios from "axios";

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
