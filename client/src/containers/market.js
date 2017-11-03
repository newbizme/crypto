import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import CandleStickChartWithMACDIndicator from '../components/chart-candlesticksWithMACDIndicator';
import ExchangePicker from '../components/exchange-picker';
import Ticker from '../components/ticker';

import { 
  updateServerStatus,
  fetchCandlestickData,
  fetchTickerData,
} from '../actions/index';

const styles = {
  container: {
    padding: '15px',
  }
}

class Market extends Component {
  componentDidMount() {
    this.props.fetchTickerData();
    this.props.fetchCandlestickData('gdax','ETH-USD');
  }

  renderMarketData() {
    return (
      <div>
        <Ticker />
      </div>
    )
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
        { this.renderMarketData() }

        <button onClick={this.testAuthClient}>Test Auth - Client</button>
        <button onClick={this.testAuthServer}>Test Auth - Server</button>

        <br />
        <ExchangePicker />
        { this.props.exchangeData.candlesticks && 
          <CandleStickChartWithMACDIndicator type='hybrid' data={this.props.exchangeData.candlesticks} />}
      </div>
    )
  }
}

function mapStateToProps({ 
    serverStatus,
    exchangeData
  }) {
  return { 
    serverStatus,
    exchangeData
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    updateServerStatus,
    fetchCandlestickData,
    fetchTickerData
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);