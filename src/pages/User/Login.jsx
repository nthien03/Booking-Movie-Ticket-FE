import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoginInfo } from '../../redux/reducers/accountReducer';
import { callLogin } from '../../utils/api';

export default function Login() {
    // Redux và điều hướng
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.account?.isAuthenticated || false);
    console.log('isAuthenticated', isAuthenticated);

    // State cho dữ liệu đăng nhập
    const [userLogin, setUserLogin] = useState({
        taiKhoan: '',
        matKhau: ''
    });

    // State cho lỗi nhập liệu
    const [error, setError] = useState({
        taiKhoan: '',
        matKhau: ''
    });

    // State xử lý hiển thị loading khi submit
    const [isSubmit, setIsSubmit] = useState(false);

    // Hiện/ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Lấy callback URL từ query string nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callback');


    // Kiểm tra nếu đã đăng nhập thì chuyển hướng
    useEffect(() => {
        if (isAuthenticated) {
            const redirectUrl = callback ? callback : '/';
            navigate(redirectUrl, { replace: true });
        }
    }, [isAuthenticated, callback, navigate]);

    // Hàm kiểm tra dữ liệu hợp lệ
    const validateField = (name, value) => {
        if (!value.trim()) {
            return name === 'taiKhoan' ? 'Tài khoản không được để trống' : 'Mật khẩu không được để trống';
        }
        return '';
    };

    // Gọi API đăng nhập
    const callApiLogin = async (userLogin) => {
        setIsSubmit(true);
        try {
            const apiLogin = await callLogin(userLogin.taiKhoan, userLogin.matKhau);
            if (apiLogin?.data) {
                localStorage.setItem("access_token", apiLogin.data.access_token);

                dispatch(setUserLoginInfo(apiLogin.data.user));

                notification.success({ message: 'Đăng nhập thành công!', duration: 2 });

                setTimeout(() => {
                    const redirectUrl = callback ? callback : '/';
                    navigate(redirectUrl, { replace: true });
                }, 500);
            } else {
                const errorMsg = apiLogin.message && Array.isArray(apiLogin.message)
                    ? apiLogin.message[0]
                    : apiLogin.message || 'Đăng nhập thất bại';

                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: errorMsg,
                    duration: 4,
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Đăng nhập thất bại';
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
                message: 'Đăng nhập thất bại',
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
        setUserLogin(prev => ({ ...prev, [name]: value }));
        if (error[name]) {
            setError(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = { taiKhoan: '', matKhau: '' };
        let isValid = true;

        Object.keys(userLogin).forEach(field => {
            const fieldError = validateField(field, userLogin[field]);
            newErrors[field] = fieldError;
            if (fieldError) isValid = false;
        });

        setError(newErrors);

        if (isValid) {
            callApiLogin(userLogin);
        }
    };

    // Ẩn hiện mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Nếu đã xác thực thì chuyển hướng ngay lập tức
    // if (isAuthenticated) {
    //     return <Navigate to={callback || '/'} replace />;
    // }

    return (
        <div className="login">
            <div className="login__overlay"></div>
            <form onSubmit={handleSubmit} className="form rounded-lg bg-white p-2 sm:p-4 md:p-8 max-w-[30rem] w-full mx-auto">
                <div className="text-center mb-6">
                    <FontAwesomeIcon className="w-10 h-10 text-[#3d95d4]" icon={faCircleUser} />
                    <h2 className="text-xl font-bold">Đăng Nhập</h2>
                </div>

                <div className="form-control">
                    <input
                        placeholder="none"
                        title="Tài khoản"
                        onChange={handleInputChange}
                        type="text"
                        name="taiKhoan"
                        value={userLogin.taiKhoan}
                        className={`form-input ${error.taiKhoan ? 'border-red-500' : ''}`}
                        autoComplete="off"
                        disabled={isSubmit}
                    />
                    <label className="form-label bg-white">Tài khoản</label>
                </div>
                <p className="form-err font-medium mb-4 mt-1 text-red-500">{error.taiKhoan}</p>

                <div className="form-control mt-6 relative">
                    <input
                        placeholder="none"
                        title="Mật khẩu"
                        onChange={handleInputChange}
                        type={showPassword ? "text" : "password"}
                        name="matKhau"
                        value={userLogin.matKhau}
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
                <p className="form-err font-medium mb-4 mt-1 text-red-500">{error.matKhau}</p>

                <div className="my-2 mt-4">
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
                                Đang đăng nhập...
                            </span>
                        ) : (
                            'Đăng Nhập'
                        )}
                    </button>

                </div>

                <div className="text-right">
                    <span
                        onClick={() => !isSubmit && navigate('/register')}
                        className={`font-medium cursor-pointer ${isSubmit ? 'opacity-50 cursor-not-allowed' : 'text-black hover:text-black'}`}
                    >
                        Bạn chưa có tài khoản ? <span className="text-red-600">Đăng ký ngay</span>
                    </span>
                </div>
            </form>
        </div>
    );
}
