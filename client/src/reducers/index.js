import { combineReducers } from 'redux';

import serverStatus from './reducer_example';
import exchangeData from './exchange-data';
import portfolio from './portfolio';
import ticker from './ticker';


const rootReducer = combineReducers({
    serverStatus,
    exchangeData,
    portfolio,
    ticker
});

export default rootReducer;
