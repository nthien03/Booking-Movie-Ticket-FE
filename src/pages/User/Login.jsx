import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useRoute from '../../hooks/useRoute';
import { getLocalStorage, setLocalStorage, SwalConfig } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusLogin } from '../../redux/reducers/UserReducer';
import { history } from '../../utils/history';
import { DangNhap } from '../../services/UserService';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import NotFound from '../NotFound';

export default function Login() {
    const dispatch = useDispatch();
    const { navigate } = useRoute();

    // Lấy trạng thái authentication từ Redux (giả sử có trong store)
    const isAuthenticated = useSelector(state => state.user?.isLogin || false);

    const [userLogin, setUserLogin] = useState({
        taiKhoan: '',
        matKhau: ''
    });

    const [error, setError] = useState({
        taiKhoan: '',
        matKhau: ''
    });

    // Thêm loading state và password visibility
    const [isSubmit, setIsSubmit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Lấy callback URL từ query params
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callback');

    // Authentication check với useEffect
    useEffect(() => {
        if (isAuthenticated || getLocalStorage(LOCALSTORAGE_USER)) {
            // Hard redirect như file 2
            const redirectUrl = callback ? callback : '/';
            window.location.href = redirectUrl;
        }
    }, [isAuthenticated, callback]);

    // Validation functions chi tiết hơn
    const validateField = (name, value) => {
        switch (name) {
            case 'taiKhoan':
                if (!value.trim()) {
                    return 'Tài khoản không được để trống';
                } else if (value.includes(' ')) {
                    return 'Tài khoản không được có khoảng cách';
                }
                return '';

            case 'matKhau':
                if (!value.trim()) {
                    return 'Mật khẩu không được để trống';
                } else if (value.length < 6) {
                    return 'Mật khẩu phải có ít nhất 6 ký tự';
                } else if (value.length > 50) {
                    return 'Mật khẩu không được quá 50 ký tự';
                }
                return '';

            default:
                return '';
        }
    };

    const callApiLogin = async (userLogin) => {
        setIsSubmit(true);
        try {
            const apiLogin = await DangNhap(userLogin);

            // Check response structure như file 2
            if (apiLogin?.data) {
                setLocalStorage(LOCALSTORAGE_USER, apiLogin.data.content);
                dispatch(setStatusLogin(true));
                SwalConfig('Đăng nhập thành công!', 'success', false);

                // Redirect với callback support
                const redirectUrl = callback ? callback : '/';
                window.location.href = redirectUrl;
            } else {
                // Handle case when no data returned
                const errorMsg = apiLogin.message && Array.isArray(apiLogin.message)
                    ? apiLogin.message[0]
                    : apiLogin.message || 'Đăng nhập thất bại';
                SwalConfig(errorMsg, 'error', true, 5000);
            }
        } catch (error) {
            // Enhanced error handling
            let errorMessage = 'Đăng nhập thất bại';

            if (error.response?.data?.content) {
                errorMessage = error.response.data.content;
            } else if (error.response?.data?.message) {
                if (Array.isArray(error.response.data.message)) {
                    errorMessage = error.response.data.message[0];
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            SwalConfig(errorMessage, 'error', true, 5000);
        } finally {
            setIsSubmit(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setUserLogin((prev) => ({ ...prev, [name]: value }));

        // Real-time validation
        const fieldError = validateField(name, value);
        setError((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { taiKhoan, matKhau } = userLogin;
        let newErrors = { taiKhoan: '', matKhau: '' };
        let isValid = true;

        // Validate all fields
        Object.keys(userLogin).forEach(field => {
            const fieldError = validateField(field, userLogin[field]);
            newErrors[field] = fieldError;
            if (fieldError) isValid = false;
        });

        setError(newErrors);

        if (isValid) {
            callApiLogin(userLogin);
        } else {
            SwalConfig('Vui lòng kiểm tra lại thông tin!', 'warning', false);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Không render nếu đã authenticated (sẽ redirect ở useEffect)
    if (isAuthenticated || getLocalStorage(LOCALSTORAGE_USER)) {
        return null;
    }

    return (
        <div className="login">
            <div className="login__overlay"></div>
            <form onSubmit={handleSubmit} className="form rounded-lg bg-white p-2 sm:p-4 md:p-8">
                <div className="text-center mb-6">
                    <FontAwesomeIcon className="w-10 h-10 text-orange-500" icon={faCircleUser} />
                    <h2 className="text-xl font-bold">Đăng Nhập</h2>
                </div>

                {/* Tài khoản Input */}
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

                {/* Mật khẩu Input với icon mắt */}
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

                    {/* Toggle Password Visibility Button */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                        disabled={isSubmit}
                    >
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="w-4 h-4"
                        />
                    </button>
                </div>
                <p className="form-err font-medium mb-4 mt-1 text-red-500">{error.matKhau}</p>

                {/* Submit Button với Loading State */}
                <div className="my-2 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmit}
                        className={`w-full py-4 font-bold text-sm leading-tight uppercase rounded shadow-md transition duration-150 ease-in-out
                            ${isSubmit
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg'
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

                {/* Register Link */}
                <div className="text-right">
                    <span
                        onClick={() => !isSubmit && navigate('/register')}
                        className={`font-medium cursor-pointer ${isSubmit ? 'opacity-50 cursor-not-allowed' : 'text-black hover:text-black'}`}
                    >
                        Bạn chưa có tài khoản ? <span className="text-red-600">Đăng ký ngay !</span>
                    </span>
                </div>
            </form>
        </div>
    );
}