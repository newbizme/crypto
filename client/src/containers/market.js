import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';
import MarketTable from '../components/market/market-table';

import { Icon, Button } from 'semantic-ui-react';

import { 
    fetchTickers,
  } from '../actions/ticker';

import {
    fetchCMCTable
} from '../actions/market';

const styles = {
    container: {
        padding: '15px',
    }
}

class Market extends Component {
    componentDidMount() {
        this.props.fetchCMCTable();
    }

    render() {
        return (
            <div className="market-container" style={styles.container}>
                <MarketTable data={this.props.marketCap} />
            </div>
        )
    }
}

function mapStateToProps({ 
    ticker,
    marketCap
    }) {
    return { 
    ticker,
    marketCap
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    fetchTickers,
    fetchCMCTable
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);