import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

class Home extends Component {
  state = { 
    marketData: undefined,
    candlesticks: undefined,
  };
  
  componentDidMount() {
    fetch('/api/v1')
      .then(res => res.json())
      .then((data) => {
        this.props.updateServerStatus(data.status);
      });

    
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

  render() {
    return (
      <div className="home-container" style={styles.container}>
        <p>Server status: { this.props.serverStatus }</p>
        { this.renderMarketData() }
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);