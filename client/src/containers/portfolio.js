import React, { Component } from 'react';

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
    fetchTickers
} from '../actions/ticker';

const styles = {
  container: {
    padding: '15px',
  }
}

class Home extends Component {
  componentDidMount() {
    this.props.fetchTickers();
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
    fetchTickers
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);