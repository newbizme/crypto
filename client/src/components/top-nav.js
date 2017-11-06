import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import LoginButton from './login-button';
import AuthButtons from './auth/auth-buttons';

// TODO: Add active state depending on route. Need to pass route in: active={this.props.location.pathname === '/portfolio'} 


const TopNav = (props) => {
    console.log(window.location.pathname);
    return (
        <Menu icon='labeled' inverted>
            <Menu.Item header>CryptoNow</Menu.Item>

            <Link to="/portfolio">
            <Menu.Item name='gamepad' active={window.location.pathname === '/portfolio' }>
                <Icon name='gamepad' />
                Portfolio
            </Menu.Item>
            </Link>

            <Link to="/market">
            <Menu.Item name='video camera' active={window.location.pathname === '/market' }>
                <Icon name='video camera' />
                Market
            </Menu.Item>
            </Link>

            <Menu.Menu position="right">
                <Menu.Item>
                    <AuthButtons />
                </Menu.Item>
            </Menu.Menu>

        </Menu>
    );
}

export default TopNav;