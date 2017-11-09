import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
   logoutUser
} from '../actions/index';

import Auth from '../modules/auth';

class Logout extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.logoutUser();
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      logoutUser
    }, dispatch);
  }

export default connect(null, mapDispatchToProps)(Logout);