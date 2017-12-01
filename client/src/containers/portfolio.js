import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import Ticker from '../components/market/ticker';
import AddTxn from '../components/portfolio/add-txn';
import ImportTxn from '../components/portfolio/import-txn';
import TxnsTable from '../components/portfolio/txns-table';
import NetWorth from '../components/portfolio/net-worth';

import AuthButtons from '../components/auth/auth-buttons';

import { Button, Message, Icon } from 'semantic-ui-react';

import { 
  addTxn,
  fetchTxns,
  deleteTxn,
  addExchangeConnection,
  fetchExchangeConnections,
  deleteExchangeConnection,
  fetchPortfolioSeries
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
    Auth.isUserAuthenticated() && this.props.fetchExchangeConnections();
  }

  componentDidMount() {
    // this.props.fetchTickers();
    // socket.io -> action > returnTickers()
    const socket = socketIOClient();
    socket.on("FromAPI", data => this.props.returnTickers(data));


    this.props.fetchTxns();
    this.props.fetchPortfolioSeries();
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

        <NetWorth ticker={this.props.ticker} portfolio={this.props.portfolio.portfolio} dataSeries={this.props.portfolio.dataSeries} />
        <br/>
        <AddTxn addTxn={this.props.addTxn} />
        <ImportTxn
            userExchanges={this.props.userExchanges}
            addExchange={this.props.addExchangeConnection}
            deleteExchange={this.props.deleteExchangeConnection}
            onRefresh={this.props.fetchTxns}
             />
        <Button 
            disabled={!Auth.isUserAuthenticated()}
            content='Refresh' 
            icon='refresh'
            labelPosition='left'
            positive
            floated='right'
            onClick={this.props.fetchTxns}
            >
        </Button>
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
    ticker,
    userExchanges
  }) {
  return { 
    serverStatus,
    exchangeData,
    portfolio,
    ticker,
    userExchanges
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    addTxn, 
    fetchTxns,
    deleteTxn,
    fetchTickers,
    returnTickers,
    addExchangeConnection,
    fetchExchangeConnections,
    deleteExchangeConnection,
    fetchPortfolioSeries
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);