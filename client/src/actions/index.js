import axios from 'axios';
import { formatData } from '../components/utils';

export const EXAMPLE = 'EXAMPLE';
export const RETURN_TICKER_DATA = 'RETURN_PORTFOLIO_DATA';
export const RETURN_CANDLESTICK_DATA = 'RETURN_CANDLESTICK_DATA';
export const RETURN_EXCHANGE_SELECTION = 'RETURN_EXCHANGE_SELECTION';
export const RETURN_CURRENCY_SELECTION = 'RETURN_CURRENCY_SELECTION';


export function updateServerStatus(status) {
    return {
        type: EXAMPLE,
        payload: status
    };
}

export function fetchTickerData() {
    return (dispatch, getState) => {
        axios.get('/api/v1/exchanges/gdax')
            .then((response) => {
                console.log(response);
                dispatch(returnTickerData(response.data));
            })
    };  
}

function returnTickerData(data) {
    return {
        type: RETURN_TICKER_DATA,
        payload: data
    };
}

export function selectCurrency(exchange, currency) {
    return (dispatch, getState) => {
        dispatch(setExchange(exchange));
        dispatch(setCurrencyPair(currency));
        dispatch(fetchCandlestickData(exchange, currency));
    }
}
function setExchange(exchange) {
    return {
        type: RETURN_EXCHANGE_SELECTION,
        payload: exchange
    }
}
function setCurrencyPair(currency) {
    return {
        type: RETURN_CURRENCY_SELECTION,
        payload: currency
    }
}


export function fetchCandlestickData(exchange, currency) {
    return (dispatch, getState) => {
        // fetch(`/api/v1/candlesticks/${exchange}/${currency}`)
        fetch(`/api/v1/exchanges/candlesticks/${exchange}/${currency}`)
        .then(res => res.json())
        .then((data) => {
            var candles = formatData(data);
            console.log('myAPI', candles);
            dispatch(returnCandlestickData(candles));
        })
    }
}
function returnCandlestickData(data) {
    return {
        type: RETURN_CANDLESTICK_DATA,
        payload: data
    }
}