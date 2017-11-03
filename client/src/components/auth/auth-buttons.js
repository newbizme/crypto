import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../modules/auth';

const AuthButtons = () => {
    if (Auth.isUserAuthenticated()) {
        return (
            <Link to='/logout'><button className="button">Logout</button></Link>
        );
    } else {
        return (
            <div>
                <Link to='/login'><button className="button is-primary">Login</button></Link>
                <Link to='/signup'><button className="button">Signup</button></Link>
            </div>
        );
    }
    
}

export default AuthButtons;