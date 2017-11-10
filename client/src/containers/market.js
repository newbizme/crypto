import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Auth from '../modules/auth';

import { Message } from 'semantic-ui-react';

import { 
    fetchTickerData,
  } from '../actions/index';

const styles = {
container: {
    padding: '15px',
}
}

class Market extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="market-container" style={styles.container}>

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
    fetchTickerData
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);