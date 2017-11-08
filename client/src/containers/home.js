import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import Ticker from '../components/ticker';
import AuthButtons from '../components/auth/auth-buttons';

import { Button, Icon, Message } from 'semantic-ui-react';

import { 
  addTxn,
  fetchTxns,
  deleteTxn
} from '../actions/portfolio';

const styles = {
  container: {
    padding: '15px',
  }
}

class Home extends Component {
  componentDidMount() {
    this.props.fetchTxns();
  }

  testAuthClient = () => {
    console.log('Client',Auth.getUser(), Auth.getToken());
  }

  testAuthServer = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/auth/v1/user');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('Server', xhr.response);
      } 
    });
    xhr.send();
  }

  render() {
    console.log(this.props);
    return (
      <div className="home-container" style={styles.container}>
        <div style={{textAlign: 'center', color: 'green'}}>
        <Message success color='black'>
          <Message.Header>Login to track your portfolio</Message.Header>
          <Message.Content>
            <br />
            <AuthButtons />
            <br /><br />
            <p>Already logged in? Click the pie chart!</p>
            <Link to='/portfolio'><Icon name='pie chart' size='massive' /></Link>
          </Message.Content>
        </Message>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ 
    serverStatus,
    exchangeData,
    portfolio
  }) {
  return { 
    serverStatus,
    exchangeData,
    portfolio
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    addTxn, 
    fetchTxns,
    deleteTxn
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);