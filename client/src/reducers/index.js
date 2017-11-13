import { combineReducers } from 'redux';

import serverStatus from './reducer_example';
import exchangeData from './exchange-data';
import portfolio from './portfolio';
import ticker from './ticker';
import marketCap from './market-cap';


const rootReducer = combineReducers({
    serverStatus,
    exchangeData,
    portfolio,
    ticker,
    marketCap
});

export default rootReducer;
