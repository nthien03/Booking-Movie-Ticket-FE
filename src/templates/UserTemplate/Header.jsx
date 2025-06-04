import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Drawer, Space, Tooltip, Avatar, Input } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined, DesktopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'

import logo_home from '../../assets/img/logo_home.png';
import { Dropdown, Menu } from 'antd';

export default () => {

    const user = useSelector(state => state.account.user);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

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
                {
                    key: 'profile',
                    label: <NavLink to='/info'>Thông tin cá nhân</NavLink>,
                    icon: <UserOutlined />,
                },
                {
                    key: 'booking',
                    label: <NavLink to='/bookings/history'>Lịch sử đặt vé</NavLink>,
                    icon: <DesktopOutlined />,
                },
            ]}
        />
    );

    const [search, setSearch] = useState('');

    const handleSearch = () => {
        if (search.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(search.trim())}`);
        }
    };


    // useEffect(() => {

    //     if (getLocalStorage(LOCALSTORAGE_USER)) {
    //         dispatch(setStatusLogin(true))
    //     }

    //     document.addEventListener('scroll', () => {
    //         if (window.scrollY > 50) {
    //             document.getElementById('navBarHeader').style.background = 'rgb(255 255 255 / 80%)'
    //         } else {
    //             document.getElementById('navBarHeader').style.background = '#fff'
    //         }
    //     })

    // }, [])
    useEffect(() => {
        // Kiểm tra xem phần tử có tồn tại trước khi thêm event listener
        const navBarHeader = document.getElementById('navBarHeader');
        if (navBarHeader) {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    navBarHeader.style.background = 'rgb(255 255 255 / 80%)';
                } else {
                    navBarHeader.style.background = '#fff';
                }
            };

            // Thêm event listener cho sự kiện scroll
            document.addEventListener('scroll', handleScroll);

            // Cleanup event listener khi component unmount
            return () => {
                document.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const text = <span>Đăng xuất</span>;

    return (
        <>
            <Drawer
                title="HD Cinema"
                placement='left'
                closable={false}
                onClose={onClose}
                open={open}
                width='300px'
                key='left'
                extra={
                    <Space>
                        <FontAwesomeIcon className='cursor-pointer' onClick={onClose} icon={faXmark} />
                    </Space>
                }
            >
                <div>
                    {isAuthenticated ? <>
                        <Dropdown overlay={menu}>
                            <div className="flex items-center gap-2 cursor-pointer text-base">
                                <Avatar style={{ backgroundColor: '#66CCFF' }} icon={<UserOutlined />} />
                                <span>{user?.fullName}</span>
                            </div>
                        </Dropdown>
                        <Tooltip placement="bottom" title={text}>
                            <NavLink onClick={() => {
                                // Swal.fire({
                                //     title: 'Bạn có muốn đăng xuất không ?',
                                //     showDenyButton: true,
                                //     confirmButtonText: 'Đồng ý',
                                //     denyButtonText: 'Hủy',
                                //     icon: 'question',
                                //     iconColor: 'rgb(104 217 254)',
                                //     confirmButtonColor: '#f97316'
                                // }).then((result) => {
                                //     if (result.isConfirmed) {
                                //         SwalConfig('Đã đăng xuất', 'success', false)
                                //         removeLocalStorage(LOCALSTORAGE_USER)
                                //         dispatch(setStatusLogin(false))
                                //         navigate('/')
                                //     }
                                // })
                            }} className='flex justify-center mt-2 items-center border-none ml-2'>
                                <FontAwesomeIcon className='w-8 h-8' icon={faArrowRightFromBracket} />
                            </NavLink>
                        </Tooltip>
                    </> : <>
                        <div className='text-gray-500 hover:text-red-600 flex items-center mb-4'>
                            <FontAwesomeIcon className='w-5 h-5 mr-1' icon={faCircleUser} />
                            <NavLink to='login' className='text-base font-semibold text-gray-500 hover:text-red-600'>Đăng Nhập</NavLink>
                        </div>
                        <div className='text-gray-500 hover:text-red-600 flex items-center mb-4'>
                            <FontAwesomeIcon className='w-5 h-5 mr-1' icon={faCircleUser} />
                            <NavLink to='register' className='text-base font-semibold text-gray-500 hover:text-red-600'>Đăng Ký</NavLink>
                        </div>
                    </>}
                </div>
                <hr />
                <ul className="list-reset justify-center flex-1 items-center mt-2">
                    <li className="mr-3">
                        <NavLink to='/' className="block py-2 px-4 text-black font-medium text-base hover:text-red-600 no-underline" >Danh sách phim</NavLink>
                    </li>
                    <li className="mr-3">
                        <NavLink className="block no-underline text-black font-medium text-base hover:text-red-600 hover:text-underline py-2 px-4"
                            to='news'>Tin tức</NavLink>
                    </li>

                </ul>
            </Drawer>

            <header className="bg-gray-400 font-sans leading-normal tracking-normal">
                <nav
                    style={{ borderBottom: '1px solid #c1c0c04a' }}
                    id='navBarHeader'
                    className="transition-all duration-500 flex items-center justify-between flex-wrap bg-white py-2 px-4 fixed w-full z-10 top-0">
                    <div className="flex items-center flex-shrink-0 text-white mr-4 ml-20">
                        <NavLink to='/' aria-label="Back to homepage" className="flex items-center">
                            <img src={logo_home} alt="logo_home" className="w-30 h-14 object-contain" />
                        </NavLink>
                    </div>
                    <div className="block lg:hidden">
                        <button onClick={showDrawer} id="nav-toggle"
                            className="flex items-center px-3 py-2 border rounded text-gray-500 border-orange-500">
                            <svg className="fill-current h-4 w-4 text-orange-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden  pt-3 lg:pt-0"
                        id="nav-content">
                        <ul className="list-reset lg:flex justify-start flex-1 items-center mb-0 pl-12">
                            <li className="mr-3">
                                <Link to='/#movie-list' className="inline-block py-2 px-4 text-black font-medium md:text-base hover:text-red-600 no-underline" >Phim</Link>
                            </li>
                            <li className="mr-3">
                                <Link className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4"
                                    to="/#menuCinema">Lịch chiếu</Link>
                            </li>
                            <li className="mr-3">
                                <NavLink className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4"
                                    to='news'>Giá vé</NavLink>
                            </li>
                            <li className="mr-3">
                                <NavLink className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4"
                                    to='aboutapp'>Giới thiệu</NavLink>
                            </li>
                        </ul>
                        <div className='flex text-gray-500'>
                            <Input
                                className="w-64 h-10 px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mr-8"
                                placeholder="Tìm phim theo tên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onPressEnter={handleSearch}
                                suffix={<SearchOutlined className="text-gray-500 text-lg" onClick={handleSearch} />}
                            />


                            {isAuthenticated ? <>
                                <Dropdown overlay={menu}>
                                    <div className="flex items-center gap-2 cursor-pointer text-base mr-20">
                                        <Avatar style={{ backgroundColor: 'rgb(61, 149, 212)' }} icon={<UserOutlined />} />
                                        <span>{user?.fullName}</span>
                                    </div>
                                </Dropdown>
                                {/* <NavLink to='/inforUser' className="flex flex-row items-center justify-center border-r-2 border-gray-300 pr-2">
                                    <div className="relative">
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 border rounded-full border-gray-50" />
                                        <img src={`https://i.pravatar.cc/150?u=${getLocalStorage(LOCALSTORAGE_USER).taiKhoan}`} className="w-10 h-10 border rounded-full" />
                                    </div>
                                    <div>
                                        <h5 className='m-0 pl-2 text-center'>{getLocalStorage(LOCALSTORAGE_USER).taiKhoan}</h5>
                                    </div>
                                </NavLink> */}
                                {/* <Tooltip placement="bottomRight" title={text}>
                                    <NavLink onClick={() => {
                                        // Swal.fire({
                                        //     title: 'Bạn có muốn đăng xuất không ?',
                                        //     showDenyButton: true,
                                        //     confirmButtonText: 'Đồng ý',
                                        //     denyButtonText: 'Hủy',
                                        //     icon: 'question',
                                        //     iconColor: 'rgb(104 217 254)',
                                        //     confirmButtonColor: '#f97316'
                                        // }).then((result) => {
                                        //     if (result.isConfirmed) {
                                        //         SwalConfig('Đã đăng xuất', 'success', false)
                                        //         removeLocalStorage(LOCALSTORAGE_USER)
                                        //         dispatch(setStatusLogin(false))
                                        //         navigate('/')
                                        //     }
                                        // })

                                    }} className='border flex items-center border-none ml-2'>
                                        <FontAwesomeIcon className='w-8 h-8' icon={faArrowRightFromBracket} />
                                    </NavLink>
                                </Tooltip> */}
                            </> : <>
                                <div className="mr-20 flex items-center space-x-2">
                                    <NavLink
                                        to='login'
                                        className='text-gray-500 hover:text-red-600 text-sm font-semibold py-2 px-3 rounded-lg'
                                    >
                                        Đăng Nhập
                                    </NavLink>
                                    <span className="text-gray-400">|</span>
                                    <NavLink
                                        to='register'
                                        className='text-gray-500 hover:text-red-600 text-sm font-semibold py-2 px-3 rounded-lg'
                                    >
                                        Đăng Ký
                                    </NavLink>
                                </div>

                            </>}
                        </div>
                    </div>
                </nav >
            </header >
        </>
    )
}




