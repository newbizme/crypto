import React from 'react';
import { Link } from 'react-router-dom';

import LoginButton from './login-button';

const TopNav = (props) => {

    return (
        <nav className="nav">
            <div className="nav-left">
                <a className="nav-item">
                <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma logo" />
                </a>
                <a className="nav-item">
                    <h2><strong>Taylor McManus</strong></h2> 
                </a>
                <a className="nav-item">
                    <h4>Philadelphia, PA</h4>
                </a>
            </div>

            <div className="nav-center">
                <a className="nav-item">
                <span className="icon">
                    <i className="fa fa-github"></i>
                </span>
                </a>
                <a className="nav-item">
                <span className="icon">
                    <i className="fa fa-twitter"></i>
                </span>
                </a>
            </div>


            <span className="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </span>


            <div className="nav-right nav-menu">
                <a className="nav-item">
                Home
                </a>
                <a className="nav-item">
                Documentation
                </a>
                <a className="nav-item">

                </a>

                <div className="nav-item">
                <div className="field is-grouped">
                    
                </div>
                </div>
            </div>
        </nav>
    )
}

export default TopNav;