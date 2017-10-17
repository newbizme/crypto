import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Auth from '../modules/auth';

export default class Logout extends Component {
    componentWillMount() {
        Auth.deauthenticateUser();
    }

    render() {
        return (
        <div>
            <Redirect to={{ pathname: '/' }} />
        </div>
        );
    }
}