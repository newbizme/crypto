import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Auth from '../modules/auth';

export default class Logout extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        let message = Auth.deauthenticateUser();
    }

    render() {

        return (
        <div>
            <Redirect to={{ pathname: '/' }} />
        </div>
        );
    }
}