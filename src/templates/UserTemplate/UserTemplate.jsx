import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
// import '../../assets/sass/layout/_usertemplate.scss'

export default function UserTemplate() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
