import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateServerStatus } from '../actions/index';


const styles = {
  container: {
    padding: '15px',
  }
}

class Home extends Component {
  state = { 
    marketData: undefined
  };
  
  componentDidMount() {
    fetch('/api/v1')
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        this.props.updateServerStatus(data.status);
      });

    fetch('/api/v1/exchanges/gdax')
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ marketData: data });
      })
  }

  renderMarketData() {
    if (!this.state.marketData) {
      return <div></div>;
    }

    return (
      <div>
        <h3>GDAX - ETH/USD</h3>
        <ul>
          <li>TimeStamp: { this.state.marketData.ticker.timestamp }</li>
          <li>Current Bid: { this.state.marketData.ticker.bid }</li>
          <li>Current Ask: { this.state.marketData.ticker.ask }</li>
          <li>24h High: { this.state.marketData.ticker.high }</li>
          <li>24h Low: { this.state.marketData.ticker.low }</li>
          <li>Volume: { this.state.marketData.ticker.quoteVolume }</li>
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="home-container" style={styles.container}>
        <p>Server status: { this.props.serverStatus }</p>
        { this.renderMarketData() }
      </div>
    )
  }
}

function mapStateToProps({ serverStatus }) {
  return { serverStatus };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    updateServerStatus, 
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);