import { NavLink, Outlet } from 'react-router-dom'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SnippetsOutlined, FileAddOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { getLocalStorage, removeLocalStorage } from '../../utils/config';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import useRoute from '../../hooks/useRoute';
import { LayThongTinTaiKhoan } from '../../services/UserService';
import LoadingPage from '../../pages/LoadingPage';
import NotFound from '../../pages/NotFound';
import logo from '../../assets/img/logo.png';

const { Header, Sider, Content } = Layout;

export default function AdminTemplate() {
    const [collapsed, setCollapsed] = useState(false);
    const { navigate } = useRoute()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // const token = getLocalStorage(LOCALSTORAGE_USER)
        // if (!token) {
        //     navigate('/login')
        // }
        // else if (token.maLoaiNguoiDung !== 'QuanTri') {
        //     navigate('/notfound')
        // }
        // else {
        //     const callApiThongTinNguoiDungCheckAdmin = async () => {
        //         try {
        //             const apiNguoiDung = await LayThongTinTaiKhoan()
        //             if (apiNguoiDung.data.content.maLoaiNguoiDung !== token.maLoaiNguoiDung) {
        //                 navigate('/notfound')
        //             }else {
        //                 setIsLoading(false)
        //             }
        //         } catch (error) {
        //             removeLocalStorage(LOCALSTORAGE_USER)
        //             navigate('/notfound')
        //         }
        //     }
        //     callApiThongTinNguoiDungCheckAdmin()
        // }

        // 1) Responsive: tự động collapse sidebar khi <768px
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };
        handleResize();

        // 2) Kết thúc loading
        setIsLoading(false);

        // 3) Lắng nghe resize
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return (
        <>
            {isLoading ? <LoadingPage /> : <>
                {/* Màn hình từ 1280px trở lên mới cho vào trang Admin */}
                {/* <div className='hidden xl:block'> */}
                <div className='block'>

                    <Layout className='min-h-screen'>
                        <Sider trigger={null} collapsible collapsed={collapsed} className=''>
                            <NavLink to='/' aria-label="Back to homepage" className="flex items-center justify-center p-2">

                                <img src={logo} alt="Logo" className="w-24 h-20 object-contain" />

                            </NavLink>
                            <Menu
                                theme="dark"
                                mode="inline"
                                items={[
                                    {
                                        key: '1',
                                        icon: <UserOutlined />,
                                        label: 'Người dùng',
                                        children: [{
                                            key: '11',
                                            icon: <SnippetsOutlined />,
                                            label: <NavLink to='user'>Quản lý người dùng</NavLink>,
                                        },
                                        {
                                            key: '12',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='user/addnewuser'>Add User</NavLink>,
                                        },
                                        ]
                                    },
                                    {
                                        key: '2',
                                        icon: <SnippetsOutlined />,
                                        label: <NavLink to='movie'>Quản lý phim</NavLink>,

                                    },

                                    {
                                        key: '3',
                                        icon: <SnippetsOutlined />,
                                        label: <NavLink to='schedule'>Quản lý lịch chiếu</NavLink>,

                                    },

                                ]}
                            />
                        </Sider>
                        <Layout className="site-layout">
                            <Header className="site-layout-background pl-4 text-[1.8rem]">
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapsed(!collapsed),
                                })}
                            </Header>
                            <Content
                                className="site-layout-background contentAdmin"
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    minHeight: 500,
                                }}>
                                <Outlet />
                            </Content>
                        </Layout>
                    </Layout>
                </div>
                {/* Màn hình dưới 1280px KHÔNG cho vào trang Admin */}
                {/* <div className="block xl:hidden">
                    <NotFound />
                </div> */}
            </>}
        </>
    );
};
