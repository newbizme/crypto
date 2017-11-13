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

            <Link to="/portfolio">
            <Menu.Item active={window.location.pathname === '/portfolio' }>
                <Icon name='pie chart' />
                Portfolio
            </Menu.Item>
            </Link>

            <Link to="/market">
            <Menu.Item active={window.location.pathname === '/market' }>
                <Icon name='line chart' />
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

/*
            <Link to="/market">
            <Menu.Item name='video camera' active={window.location.pathname === '/market' }>
                <Icon name='line chart' />
                Market
            </Menu.Item>
            </Link>
            */

export default TopNav;