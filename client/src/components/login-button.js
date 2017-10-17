import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Auth from '../modules/auth';

const styles = {
    container: {
        background: '#00d1b2',
        height: '40px',
        width: '100px',
        position: 'fixed',
        zIndex: '100',
        right: '6px'
    },
    button: {
        marginTop: '6px'
    },
    showLoginTrigger: {
        background: '#00d1b2',
        height: '40px',
        width: '6px',
        position: 'fixed',
        right: '0',
        top: '10px',
        zIndex: '100'
  }
}

export default class LoginButton extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showLoginButton: false
        };
    }

    toggleShowLogin = () => {
        this.state.showLoginButton ? this.setState({ showLoginButton: false }) : this.setState({ showLoginButton: true });
    }

    render() {
        return (
            <div 
                className="show-login" 
                style={styles.showLoginTrigger}
                onClick={this.toggleShowLogin}
            >
            { this.state.showLoginButton && <Button />}
            </div>
          
        )
    }
}

const Button = () => {
    return (
            <div className="login-button-container" style={styles.container}>
                {Auth.isUserAuthenticated() ? 
                    <Link to='/logout'>
                        <button className="button is-white is-small" style={styles.button}>Logout</button>
                    </Link> :
                    <Link to='/login'>
                        <button className="button is-primary is-small" style={styles.button}>Login</button>
                    </Link>
                    }
            </div>
        )
}
