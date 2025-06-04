// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
// import useRoute from '../../hooks/useRoute';
// import { kiemTraDinhDang, kiemTraDoDai, kiemTraRong } from '../../utils/validation';
// import { SwalConfig } from '../../utils/config';
// import { DangKy } from '../../services/UserService';
// import { GROUPID } from '../../utils/constant';

// export default function Register() {

//     const {navigate} = useRoute()

//     const [state, setState] = useState({
//         nguoiDung: {
//             taiKhoan: '',
//             matKhau: '',
//             hoTen: '',
//             email: '',
//             soDt: '',
//             maNhom: GROUPID
//         },
//         err: {
//             taiKhoan: '',
//             matKhau: '',
//             hoTen: '',
//             email: '',
//             soDt: ''
//         },
//         isValid: true
//     })
//     const HandleChangeInput = (e) => {
//         let { name, title, value } = e.target
//         let { nguoiDung, err, isValid } = { ...state }

//         isValid = true

//         if (name == 'taiKhoan') {
//             isValid &= kiemTraRong(value, err, name, title) && kiemTraDinhDang(value, err, name, title, /^\S*$/, 'không được có khoảng cách')
//         }
//         if (name == 'matKhau') {
//             isValid &= kiemTraRong(value, err, name, title) && kiemTraDoDai(value, err, name, title, 6, 50) && kiemTraDinhDang(value, err, name, title, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/, 'phải có chữ thường, chữ hoa, số và ký tự đặc biệt')
//         }
//         if (name == 'hoTen') {
//             isValid &= kiemTraRong(value, err, name, title) && kiemTraDinhDang(value, err, name, title, "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
//                 "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
//                 "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$", 'không được có số và ký tự đặc biệt')
//         }
//         if (name == 'email') {
//             isValid &= kiemTraRong(value, err, name, title) && kiemTraDinhDang(value, err, name, title, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'không hợp lệ')
//         }
//         if (name == 'soDt') {
//             isValid &= kiemTraRong(value, err, name, title) && kiemTraDinhDang(value, err, name, title, /^[0-9]+$/, 'phải là số') && kiemTraDoDai(value, err, name, title, 10, 10)
//         }

//         nguoiDung[name] = value

//         setState({ ...state, nguoiDung, err, isValid })
//     }

//     const callApiRegister = async (userRegister) => {
//         try {
//             await DangKy(userRegister)
//             SwalConfig('Đăng ký thành công', 'success', false)
//             navigate('/login')  
//         } catch (error) {
//             SwalConfig(error.response.data.content, 'error', true, 3000)
//         }
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         let { taiKhoan, matKhau, hoTen, email, soDt, maNhom } = state.nguoiDung
//         if (taiKhoan !== '' && matKhau !== '' && hoTen !== '' && email !== '' && soDt !== '' && state.isValid == true) {
//             callApiRegister(state.nguoiDung)
//         }
//         else {
//             SwalConfig('Vui lòng điền đầy đủ thông tin', 'info', false)
//         }
//     }

//     return (
//         <div className='register mt-16'>
//             <div className="register__overlay"></div>
//             <form onSubmit={handleSubmit} className="form rounded-lg bg-white p-2 sm:px-8 sm:py-4 lg:py-6">
//                 <div className='text-center mb-4'>
//                     <FontAwesomeIcon className='w-10 h-10 text-orange-500' icon={faCircleCheck} />
//                     <h2 className='text-xl font-bold'>Đăng Ký</h2>
//                 </div>
//                 <div className="form-control">
//                     <input onChange={HandleChangeInput} placeholder="none" type="text" name="taiKhoan" title='Tài khoản' className="form-input" autoComplete='off' />
//                     <label className="form-label bg-white">Tài khoản</label>
//                 </div>
//                 <p className='form-err font-medium mb-4 mt-1 '>{state.err.taiKhoan}</p>
//                 <div className="form-control mt-5">
//                     <input onChange={HandleChangeInput} placeholder="none" type="password" name="matKhau" title='Mật khẩu' className="form-input" autoComplete='off' />
//                     <label className="form-label bg-white">Mật khẩu</label>
//                 </div>
//                 <p className='form-err font-medium mb-4 mt-1 '>{state.err.matKhau}</p>
//                 <div className="form-control mt-5">
//                     <input onChange={HandleChangeInput} placeholder="none" type="text" name="hoTen" title='Họ tên' className="form-input" autoComplete='off' />
//                     <label className="form-label bg-white">Họ tên</label>
//                 </div>
//                 <p className='form-err font-medium mb-4 mt-1 '>{state.err.hoTen}</p>
//                 <div className="form-control mt-5">
//                     <input onChange={HandleChangeInput} placeholder="none" type="text" name="email" title='Email' className="form-input" autoComplete='off' />
//                     <label className="form-label bg-white">Email</label>
//                 </div>
//                 <p className='form-err font-medium mb-4 mt-1 '>{state.err.email}</p>
//                 <div className="form-control mt-5">
//                     <input onChange={HandleChangeInput} placeholder="none" type="text" name="soDt" title='Số diện thoại' className="form-input" autoComplete='off' />
//                     <label className="form-label bg-white">Số điện thoại</label>
//                 </div>
//                 <p className='form-err font-medium mb-4 mt-1 '>{state.err.soDt}</p>
//                 <div className="my-2 mt-4">
//                     <button className="w-full py-4 bg-red-600 text-white font-bold text-sm leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg
//                          focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out">Đăng Ký
//                     </button>
//                 </div>
//                 <div className='text-right'>
//                     <span onClick={() => navigate('/login')} className='text-black hover:text-black font-medium cursor-pointer'>
//                         Bạn đã có tài khoản ? <span className='text-red-600'>Đăng nhập ngay !</span>
//                     </span>
//                 </div>
//             </form>
//         </div>
//     )
// }

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { callRegister } from '../../utils/api';

export default function Register() {
    const navigate = useNavigate();

    // State cho dữ liệu đăng ký
    const [userRegister, setUserRegister] = useState({
        hoTen: '',
        taiKhoan: '',
        email: '',
        soDt: '',
        matKhau: '',
        xacNhanMatKhau: ''
    });

    // State cho lỗi nhập liệu
    const [error, setError] = useState({
        hoTen: '',
        taiKhoan: '',
        email: '',
        soDt: '',
        matKhau: '',
        xacNhanMatKhau: ''
    });

    // State xử lý hiển thị loading khi submit
    const [isSubmit, setIsSubmit] = useState(false);

    // Hiện/ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Hàm kiểm tra dữ liệu hợp lệ
    const validateField = (name, value) => {
        switch (name) {
            case 'hoTen':
                if (!value.trim()) return 'Họ tên không được để trống';
                if (!/^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/.test(value)) {
                    return 'Họ tên không được có số và ký tự đặc biệt';
                }
                break;
            case 'taiKhoan':
                if (!value.trim()) return 'Tên tài khoản không được để trống';
                if (/\s/.test(value)) return 'Tên tài khoản không được có khoảng cách';
                break;
            case 'email':
                if (!value.trim()) return 'Email không được để trống';
                if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
                    return 'Email không hợp lệ';
                }
                break;
            case 'soDt':
                if (!value.trim()) return 'Số điện thoại không được để trống';
                if (!/^[0-9]+$/.test(value)) return 'Số điện thoại phải là số';
                if (value.length !== 10) return 'Số điện thoại phải có 10 chữ số';
                break;
            case 'matKhau':
                if (!value.trim()) return 'Mật khẩu không được để trống';
                if (value.length < 6 || value.length > 50) return 'Mật khẩu phải có từ 6-50 ký tự';
                if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/.test(value)) {
                    return 'Mật khẩu phải có chữ thường, chữ hoa, số và ký tự đặc biệt';
                }
                break;
            case 'xacNhanMatKhau':
                if (!value.trim()) return 'Xác nhận mật khẩu không được để trống';
                if (value !== userRegister.matKhau) return 'Mật khẩu xác nhận không khớp';
                break;
            default:
                return '';
        }
        return '';
    };

    // Gọi API đăng ký
    const callApiRegister = async (userRegister) => {
        setIsSubmit(true);
        try {
            const apiRegister = await callRegister({
                hoTen: userRegister.hoTen,
                taiKhoan: userRegister.taiKhoan,
                email: userRegister.email,
                soDt: userRegister.soDt,
                matKhau: userRegister.matKhau,
                maNhom: 'GP01' // Hoặc GROUPID từ constant
            });

            if (apiRegister?.data) {
                notification.success({
                    message: 'Đăng ký thành công!',
                    description: 'Bạn có thể đăng nhập ngay bây giờ.',
                    duration: 3
                });

                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                const errorMsg = apiRegister.message && Array.isArray(apiRegister.message)
                    ? apiRegister.message[0]
                    : apiRegister.message || 'Đăng ký thất bại';

                notification.error({
                    message: 'Đăng ký thất bại',
                    description: errorMsg,
                    duration: 4,
                });
            }
        } catch (error) {
            console.error('Register error:', error);
            let errorMessage = 'Đăng ký thất bại';

            if (error.response?.data?.content) {
                errorMessage = error.response.data.content;
            } else if (error.response?.data?.message) {
                errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message[0]
                    : error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            notification.error({
                message: 'Đăng ký thất bại',
                description: errorMessage,
                duration: 4,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserRegister(prev => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng bắt đầu nhập
        if (error[name]) {
            setError(prev => ({ ...prev, [name]: '' }));
        }

        // Kiểm tra xác nhận mật khẩu khi mật khẩu thay đổi
        if (name === 'matKhau' && userRegister.xacNhanMatKhau) {
            if (value !== userRegister.xacNhanMatKhau) {
                setError(prev => ({ ...prev, xacNhanMatKhau: 'Mật khẩu xác nhận không khớp' }));
            } else {
                setError(prev => ({ ...prev, xacNhanMatKhau: '' }));
            }
        }
    };

    // Xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {
            hoTen: '',
            taiKhoan: '',
            email: '',
            soDt: '',
            matKhau: '',
            xacNhanMatKhau: ''
        };
        let isValid = true;

        // Validate tất cả các trường
        Object.keys(userRegister).forEach(field => {
            const fieldError = validateField(field, userRegister[field]);
            newErrors[field] = fieldError;
            if (fieldError) isValid = false;
        });

        setError(newErrors);

        if (isValid) {
            callApiRegister(userRegister);
        }
    };

    // Toggle hiển thị mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="register min-h-screen flex items-center justify-center py-8">
            <div className="register__overlay"></div>
            <form onSubmit={handleSubmit} className="form rounded-lg bg-white p-2 sm:p-4 md:p-8 w-full max-w-2xl mx-auto my-8 relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <FontAwesomeIcon className="w-10 h-10 text-[#3d95d4]" icon={faCircleUser} />
                    <h2 className="text-xl font-bold">Đăng Ký</h2>
                </div>

                {/* Two-column grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* Left Column */}
                    <div className="space-y-1">
                        {/* Họ tên */}
                        <div className="form-field">
                            <div className="form-control">
                                <input
                                    placeholder="none"
                                    title="Họ tên"
                                    onChange={handleInputChange}
                                    type="text"
                                    name="hoTen"
                                    value={userRegister.hoTen}
                                    className={`form-input ${error.hoTen ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Họ tên</label>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.hoTen}</p>
                        </div>

                        {/* Email */}
                        <div className="form-field">
                            <div className="form-control">
                                <input
                                    placeholder="none"
                                    title="Email"
                                    onChange={handleInputChange}
                                    type="email"
                                    name="email"
                                    value={userRegister.email}
                                    className={`form-input ${error.email ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Email</label>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.email}</p>
                        </div>

                        {/* Mật khẩu */}
                        <div className="form-field">
                            <div className="form-control relative">
                                <input
                                    placeholder="none"
                                    title="Mật khẩu"
                                    onChange={handleInputChange}
                                    type={showPassword ? "text" : "password"}
                                    name="matKhau"
                                    value={userRegister.matKhau}
                                    className={`form-input pr-10 ${error.matKhau ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Mật khẩu</label>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                                    disabled={isSubmit}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.matKhau}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-1">
                        {/* Tên tài khoản */}
                        <div className="form-field">
                            <div className="form-control">
                                <input
                                    placeholder="none"
                                    title="Tên tài khoản"
                                    onChange={handleInputChange}
                                    type="text"
                                    name="taiKhoan"
                                    value={userRegister.taiKhoan}
                                    className={`form-input ${error.taiKhoan ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Tên tài khoản</label>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.taiKhoan}</p>
                        </div>

                        {/* Số điện thoại */}
                        <div className="form-field">
                            <div className="form-control">
                                <input
                                    placeholder="none"
                                    title="Số điện thoại"
                                    onChange={handleInputChange}
                                    type="tel"
                                    name="soDt"
                                    value={userRegister.soDt}
                                    className={`form-input ${error.soDt ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Số điện thoại</label>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.soDt}</p>
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div className="form-field">
                            <div className="form-control relative">
                                <input
                                    placeholder="none"
                                    title="Nhập lại mật khẩu"
                                    onChange={handleInputChange}
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="xacNhanMatKhau"
                                    value={userRegister.xacNhanMatKhau}
                                    className={`form-input pr-10 ${error.xacNhanMatKhau ? 'border-red-500' : ''}`}
                                    autoComplete="off"
                                    disabled={isSubmit}
                                />
                                <label className="form-label bg-white">Nhập lại mật khẩu</label>
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                                    disabled={isSubmit}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="form-err font-medium mt-1 text-red-500 min-h-[1.25rem]">{error.xacNhanMatKhau}</p>
                        </div>
                    </div>
                </div>

                {/* Submit button - Full width across both columns */}
                <div className="col-span-full">
                    <button
                        type="submit"
                        disabled={isSubmit}
                        className={`w-full py-4 font-bold text-sm leading-tight uppercase rounded shadow-md transition duration-150 ease-in-out ${isSubmit
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#3d95d4] hover:bg-[#3384c3] hover:shadow-lg focus:bg-[#3384c3] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#2a7bb3] active:shadow-lg'
                            } text-white`}
                    >
                        {isSubmit ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang đăng ký...
                            </span>
                        ) : (
                            'Đăng Ký'
                        )}
                    </button>
                </div>

                <div className="text-right mt-4">
                    <span
                        onClick={() => !isSubmit && navigate('/login')}
                        className={`font-medium cursor-pointer ${isSubmit ? 'opacity-50 cursor-not-allowed' : 'text-black hover:text-black'}`}
                    >
                        Bạn đã có tài khoản ? <span className="text-red-600">Đăng nhập ngay</span>
                    </span>
                </div>
            </form>
        </div>
    );
}