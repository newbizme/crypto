import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import Auth from '../../modules/auth';

const AuthButtons = () => {
    if (Auth.isUserAuthenticated()) {
        return (
            <Link to='/logout'><Button inverted primary>Logout</Button></Link>
        );
    } else {
        return (
            <div>
                <Button.Group>
                    <Link to='/login'><Button primary>Login</Button></Link>
                    <Button.Or />
                    <Link to='/signup'><Button inverted>Signup</Button></Link>
                </Button.Group>
                
            </div>
        );
    }
    
}

export default AuthButtons;