import axios from 'axios';
import Auth from '../modules/auth';

export const RETURN_TXNS = 'RETURN_TXNS';
export const RETURN_PORTFOLIO = 'RETURN_PORTFOLIO';
export const RETURN_PORTFOLIO_SERIES = 'RETURN_PORTFOLIO_SERIES';
export const RETURN_EXCHANGE_CONNECTIONS = 'RETURN_EXCHANGE_CONNECTIONS';
export const RETURN_MARKET_INFO = 'RETURN_MARKET_INFO';


// *****************************
// HISTORICAL FUNCTIONS
// *****************************

export function fetchPortfolioSeries() {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.get('/user/v1/portfolio/historical', config)
            .then((response) => {
                dispatch(returnPortfolioSeriesData(response.data));
            })
    }
}
function returnPortfolioSeriesData(data) {
    return {
        type: RETURN_PORTFOLIO_SERIES,
        payload: data
    }
}

function fetchMarketInfo() {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.get('/user/v1/portfolio/current', config)
            .then((response) => {
                dispatch(returnMarketInfo(response.data));
            })
    }
}
function returnMarketInfo(data) {
    return {
        type: RETURN_MARKET_INFO,
        payload: data
    }
}


// *****************************
// TRANSACTION FUNCTIONS
// *****************************

// MANUAL TRANSACTIONS

export function addTxn(txn) {
    return (dispatch, getState) => {
        // post(txn)
        // // console.log('Action>addTxn>', txn);

        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        var data = txn;
        // data['userID'] = Auth.getUser();

        axios.post('/user/v1/txns', data, config)
            .then((response) => {
                // // console.log(response);
                dispatch(fetchTxns());
                
            })
            .catch()
    };
};

export function deleteTxn(id) {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.delete('/user/v1/txns/' + id, config)
            .then((response) => {
                dispatch(fetchTxns());
            })
            .catch((error) => {
                console.error('Error:',error);
            })
    }
}

// IMPORT TRANSACTIONS

export function fetchExchangeConnections() {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.get('/user/v1/auth/exchange', config)
            .then((response) => {
                dispatch (returnExchangeConnections(response.data));
            })
    }
};

function returnExchangeConnections(exchanges) {
    return {
        type: RETURN_EXCHANGE_CONNECTIONS,
        payload: exchanges
    }
};

export function addExchangeConnection(exchange) {
    return (dispatch, getState) => {
        // console.log('AddExchangeConnection', exchange);
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
    
        axios.post('/user/v1/auth/exchange', exchange, config)
            .then((response) => {
                // console.log('Add>response',response);
                dispatch(fetchExchangeConnections());
            })
            .catch((error) => {
                
            })
    }
}

export function deleteExchangeConnection(id) {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.delete('/user/v1/auth/exchange/' + id, config)
            .then((response) => {
                dispatch(fetchExchangeConnections());
            })
            .catch((error) => {
                console.error('Error:',error);
            })
    }
}


// FETCHING TRANSACTIONS

export function fetchTxns() {
    return (dispatch, getState) => {

        axios.get('/user/v1/txns', { headers: {'Authorization': `bearer ${Auth.getToken()}`} })
            .then((response) => {
                // console.log(response.data);
                dispatch(returnTxns(response.data.txns));
                dispatch(returnPortfolio(response.data.portfolio));
                dispatch(fetchPortfolioSeries());
                dispatch(fetchMarketInfo());
            })
            .catch((error) => {
                // console.log('Error: ' + error);
            })
    };
}

function returnTxns(txns) {
    return {
        type: RETURN_TXNS,
        payload: txns
    };
}

function returnPortfolio(data) {
    return {
        type: RETURN_PORTFOLIO,
        payload: data
    };
};
