import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import Ticker from '../components/market/ticker';
import AddTxn from '../components/portfolio/add-txn';
import TxnsTable from '../components/portfolio/txns-table';
import NetWorth from '../components/portfolio/net-worth';

import AuthButtons from '../components/auth/auth-buttons';

import { Button, Message, Icon } from 'semantic-ui-react';

import { 
  addTxn,
  fetchTxns,
  deleteTxn
} from '../actions/portfolio';

import {
    fetchTickers,
    returnTickers
} from '../actions/ticker';

const styles = {
  container: {
    padding: '15px',
  }
}

class Portfolio extends Component {
  componentWillMount() {
    this.props.fetchTickers();
  }

  componentDidMount() {
    // this.props.fetchTickers();
    // socket.io -> action > returnTickers()
    const socket = socketIOClient();
    socket.on("FromAPI", data => this.props.returnTickers(data));


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
    return (
      <div className="home-container" style={styles.container}>
        <Ticker ticker={this.props.ticker} />

        { !Auth.isUserAuthenticated() &&         
            <div style={{textAlign: 'center', color: 'green'}}>
            <Message success color='black'>
            <Message.Header>Login to track your portfolio</Message.Header>
            <Message.Content>
                <br />
                <AuthButtons />
                <br />
                <Icon name='pie chart' size='massive' />
            </Message.Content>
            </Message>
            </div> }

        <NetWorth ticker={this.props.ticker} portfolio={this.props.portfolio.portfolio} />
        <br/>
        <AddTxn addTxn={this.props.addTxn} />
        <TxnsTable 
          deleteTxn={this.props.deleteTxn}
          txns={this.props.portfolio.txns} />
      </div>
    )
  }
}

function mapStateToProps({ 
    serverStatus,
    exchangeData,
    portfolio,
    ticker
  }) {
  return { 
    serverStatus,
    exchangeData,
    portfolio,
    ticker
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    addTxn, 
    fetchTxns,
    deleteTxn,
    fetchTickers,
    returnTickers
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);