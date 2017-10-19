/*
export const RETURN_PORTFOLIO_DATA = 'RETURN_PORTFOLIO_DATA';
export const RETURN_CANDLESTICK_DATA = 'RETURN_CANDLESTICK_DATA';
export const RETURN_EXCHANGE_SELECTION = 'RETURN_EXCHANGE_SELECTION';
export const RETURN_CURRENCY_SELECTION = 'RETURN_CURRENCY_SELECTION';
*/

import { 
    RETURN_TICKER_DATA,
    RETURN_CANDLESTICK_DATA,
    RETURN_EXCHANGE_SELECTION,
    RETURN_CURRENCY_SELECTION,
} from '../actions/index';

const initialState = {
    exchange: 'gdax',
    currency: 'ETH-USD',
    candlesticks: undefined,
    ticker: {
        bid: undefined,
        ask: undefined,
        high: undefined,
        low: undefined,
        volume: undefined
    }
};

const exchangeData = (state = initialState, action) => {
    switch(action.type) {
        case RETURN_CURRENCY_SELECTION:
            return Object.assign({}, state, {
                currency: action.payload
            });
        case RETURN_EXCHANGE_SELECTION:
            return Object.assign({}, state, {
                exchange: action.payload
            });
        case RETURN_CANDLESTICK_DATA:
            return Object.assign({}, state, {
                candlesticks: action.payload
            });
        case RETURN_TICKER_DATA:
            return Object.assign({}, state, {
                ticker: {
                    bid: action.payload.ticker.bid,
                    ask: action.payload.ticker.ask,
                    high: action.payload.ticker.high,
                    low: action.payload.ticker.low,
                    volume: action.payload.ticker.quoteVolume
                }
            });
        
        
        default:
            return state
    }
}

export default exchangeData;