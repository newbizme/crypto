import React from 'react';
import { Link } from 'react-router-dom';

import LoginButton from './login-button';
import AuthButtons from './auth/auth-buttons';

const TopNav = (props) => {

    return (
        <nav className="nav">
            <div className="nav-left">
                <Link to='/'>
                <a className="nav-item">
                <h4>CryptoNow</h4>
                </a>
                </Link>
            </div>

            <span className="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </span>


            <div className="nav-right nav-menu">
                <a className="nav-item">
                    <AuthButtons />
                </a>
            </div>
        </nav>
    )
}

export default TopNav;