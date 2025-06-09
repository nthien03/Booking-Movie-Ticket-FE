import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleTwoTone, CloseCircleTwoTone, ExclamationCircleTwoTone } from "@ant-design/icons";


const PaymentResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("orderId");

    const handleGoToHistory = () => {
        navigate("/booking/history");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
                {status === "success" ? (
                    <>
                        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "64px" }} />
                        <h2 className="text-green-600 text-2xl font-bold mb-4">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-700 mb-6 text-base">
                            Cảm ơn bạn đã đặt vé
                        </p>
                        <p className="text-gray-700 mb-6">
                            Mã đơn hàng: <strong>{orderId}</strong>
                        </p>
                        <button
                            onClick={handleGoToHistory}
                            className="bg-[rgb(61,149,212)] hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Xem lịch sử đặt vé
                        </button>
                    </>
                ) : status === "failed" ? (
                    <>
                        <h2 className="text-red-600 text-2xl font-bold mb-4">
                            Thanh toán thất bại!
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Giao dịch không thành công hoặc đã bị hủy.
                        </p>
                        <button
                            onClick={handleGoHome}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                            Quay về trang chủ
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-yellow-600 text-2xl font-bold mb-4">
                            Không xác định trạng thái giao dịch!
                        </h2>
                        <p className="text-gray-700 mb-6">Vui lòng kiểm tra lại.</p>
                        <button
                            onClick={handleGoHome}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                            Quay về trang chủ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;
