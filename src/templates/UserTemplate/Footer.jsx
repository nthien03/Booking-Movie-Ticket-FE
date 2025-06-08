import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook, faYoutube, faInstagram, faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons'
import { NavLink } from 'react-router-dom'
import logo_home from '../../assets/img/logo_home.png';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="py-6 text-center">
                <p className="text-sm text-gray-500">© 2025 HD Cinema. All rights reserved.</p>
            </div>
        </footer>
    )
}
