import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import Ticker from '../components/ticker';
import AddTxn from '../components/portfolio/add-txn';
import TxnsTable from '../components/portfolio/txns-table';

import { Button } from 'semantic-ui-react';

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
        <h1>Portfolio</h1>
        <Button
          color='red'
          content='Like'
          icon='heart'
          label={{ basic: true, color: 'red', pointing: 'left', content: '2,048' }}
          />
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