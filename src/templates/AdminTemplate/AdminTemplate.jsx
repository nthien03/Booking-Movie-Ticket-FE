import { NavLink, Outlet } from 'react-router-dom'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SnippetsOutlined, FileAddOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import useRoute from '../../hooks/useRoute';
import LoadingPage from '../../pages/LoadingPage';
import logo from '../../assets/img/logo.png';
import { useSelector } from 'react-redux';
import { Avatar, Dropdown } from 'antd';
import { LogoutOutlined, ScheduleOutlined, DesktopOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menu = (
    <Menu
        items={[
            {
                key: 'logout',
                label: 'Đăng xuất',
                icon: <LogoutOutlined />,
                onClick: () => {
                    // removeLocalStorage(LOCALSTORAGE_USER);
                    // navigate('/login');
                },
            },
        ]}
    />
);
export default function AdminTemplate() {
    const [collapsed, setCollapsed] = useState(false);
    const { navigate } = useRoute()
    const [isLoading, setIsLoading] = useState(true)
    const user = useSelector(state => state.account.user);

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
                                        icon: <HomeOutlined />,
                                        label: <NavLink to='schedule'>Trang chủ</NavLink>,
                                    },
                                    {
                                        key: '2',
                                        icon: <UserOutlined />,
                                        label: 'Quản lý người dùng',
                                        children: [{
                                            key: '21',
                                            icon: <SnippetsOutlined />,
                                            label: <NavLink to='user'>Quản lý người dùng</NavLink>,
                                        },
                                        {
                                            key: '22',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='user/addnewuser'>Add User</NavLink>,
                                        },
                                        ]
                                    },
                                    {
                                        key: '3',
                                        icon: <SnippetsOutlined />,
                                        label: 'Quản lý phim',
                                        children: [{
                                            key: '31',
                                            icon: <SnippetsOutlined />,
                                            label: <NavLink to='movie'>Danh sách phim</NavLink>,
                                        },
                                        {
                                            key: '32',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='actors'>Quản lý diễn viên</NavLink>,
                                        },
                                        {
                                            key: '33',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='genres'>Quản lý thể loại</NavLink>,
                                        },
                                        ]

                                    },

                                    {
                                        key: '4',
                                        icon: <ScheduleOutlined />,
                                        label: <NavLink to='schedule'>Quản lý lịch chiếu</NavLink>,

                                    },

                                    {
                                        key: '5',
                                        icon: <DesktopOutlined />,
                                        label: 'Quản lý phòng chiếu',
                                        children: [{
                                            key: '51',
                                            icon: <SnippetsOutlined />,
                                            label: <NavLink to='room'>Danh sách phòng chiếu</NavLink>,
                                        },
                                        {
                                            key: '52',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='actors'>Quản lý diễn viên</NavLink>,
                                        },
                                        {
                                            key: '53',
                                            icon: <FileAddOutlined />,
                                            label: <NavLink to='genres'>Quản lý thể loại</NavLink>,
                                        },
                                        ]

                                    },
                                    {
                                        key: '6',
                                        icon: <UnorderedListOutlined />,
                                        label: <NavLink to='bookings'>Quản lý đơn đặt vé</NavLink>,

                                    },


                                ]}
                            />
                        </Sider>
                        <Layout className="site-layout">
                            <Header className="site-layout-background pl-4 pr-4 flex justify-between items-center text-[1.8rem]">
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapsed(!collapsed),
                                })}

                                {/* Hiển thị tên người dùng */}
                                <Dropdown overlay={menu}>
                                    <div className="flex items-center gap-2 cursor-pointer text-base">
                                        <Avatar style={{ backgroundColor: 'rgb(61, 149, 212)' }} icon={<UserOutlined />} />
                                        <span>{user?.fullName}</span>
                                    </div>
                                </Dropdown>
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
